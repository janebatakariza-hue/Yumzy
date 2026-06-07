const Order        = require("../models/Order");
const { Payment, Table, Notification, Customer } = require("../models/index");
const { MenuItem } = require("../models/Menu");
const Restaurant   = require("../models/Restaurant");
const { asyncHandler } = require("../middleware/errorHandler");
const { paginate, paginateResponse, logAudit, createNotification } = require("../utils/helpers");

// ── GET all orders (Admin or owner filtered to their restaurant) ────────────
exports.getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const { status, restaurantId, search, paymentStatus, date } = req.query;

  const filter = {};

  // Owners see only their restaurant's orders
  if (req.user.role === "restaurant_owner") {
    filter.restaurantId = req.user.restaurantId;
  } else if (restaurantId) {
    filter.restaurantId = restaurantId;
  }

  if (status)        filter.status        = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (search) {
    filter.$or = [
      { orderNumber: new RegExp(search, "i") },
      { clientName:  new RegExp(search, "i") },
    ];
  }
  if (date) {
    const start = new Date(date);
    const end   = new Date(date);
    end.setDate(end.getDate() + 1);
    filter.createdAt = { $gte: start, $lt: end };
  }

  const [data, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.status(200).json(paginateResponse(data, total, page, limit));
});

// ── GET single order ───────────────────────────────────────────────────────
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("restaurantId", "name email phone")
    .populate("tableId", "tableNumber capacity");
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });
  res.status(200).json({ success: true, data: order });
});

// ── CREATE order ───────────────────────────────────────────────────────────
exports.createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, tableId, clientName, clientPhone, items, paymentMethod, notes } = req.body;

  // Calculate total from actual menu prices
  let totalAmount = 0;
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        throw Object.assign(new Error(`Item "${item.name || item.menuItemId}" is not available.`), { statusCode: 400 });
      }
      totalAmount += menuItem.price * item.qty;
      return { menuItemId: item.menuItemId, name: menuItem.name, qty: item.qty, price: menuItem.price };
    })
  );

  const restaurant = await Restaurant.findById(restaurantId).lean();

  const order = await Order.create({
    restaurantId,
    restaurantName: restaurant?.name,
    tableId,
    tableNumber: req.body.tableNumber,
    clientName,
    clientPhone,
    items: enrichedItems,
    totalAmount,
    paymentMethod: paymentMethod || "CASH",
    notes,
  });

  // Update table status to OCCUPIED
  if (tableId) {
    await Table.findByIdAndUpdate(tableId, { status: "OCCUPIED", currentOrderId: order._id, currentBill: totalAmount });
  }

  // Create payment record
  await Payment.create({
    orderId:        order._id,
    orderNumber:    order.orderNumber,
    restaurantId,
    restaurantName: restaurant?.name,
    clientName,
    amount:         totalAmount,
    method:         paymentMethod || "CASH",
    status:         "PENDING",
  });

  // Increment menu item order counts
  for (const item of enrichedItems) {
    await MenuItem.findByIdAndUpdate(item.menuItemId, { $inc: { totalOrders: item.qty } });
  }

  // Notification for restaurant
  await createNotification(Notification, {
    restaurantId,
    title:   "New Order Received",
    message: `${clientName} placed order ${order.orderNumber} — ${totalAmount.toLocaleString()} RWF`,
    type:    "ORDER",
    metadata: { orderId: order._id },
  });

  res.status(201).json({ success: true, data: order });
});

// ── UPDATE order status ────────────────────────────────────────────────────
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  const allowed = ["NEW", "WAITING", "DELIVERED", "REJECTED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}` });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });

  // Owners can only update their restaurant's orders
  if (req.user.role === "restaurant_owner" &&
      order.restaurantId?.toString() !== req.user.restaurantId?.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  order.status = status;
  if (status === "REJECTED" && rejectionReason) order.rejectionReason = rejectionReason;
  if (status === "DELIVERED") {
    order.deliveredAt    = new Date();
    order.paymentStatus  = "PAID";
    // Update restaurant totals
    await Restaurant.findByIdAndUpdate(order.restaurantId, {
      $inc: { totalSales: order.totalAmount, totalOrders: 1 },
    });
    // Update payment
    await Payment.findOneAndUpdate({ orderId: order._id }, { status: "PAID", paidAt: new Date() });
    // Free table
    if (order.tableId) {
      await Table.findByIdAndUpdate(order.tableId, { status: "AVAILABLE", currentOrderId: null, currentBill: 0 });
    }
  }
  await order.save();

  await logAudit({ user: req.user, action: `ORDER_${status}`, targetModel: "Order", targetId: order._id, details: `Order ${order.orderNumber} → ${status}`, req });

  res.status(200).json({ success: true, data: order });
});

// ── GET order stats ────────────────────────────────────────────────────────
exports.getOrderStats = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;

  const [total, byStatus, revenue] = await Promise.all([
    Order.countDocuments(filter),
    Order.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { ...filter, status: "DELIVERED" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: Object.fromEntries(byStatus.map(s => [s._id, s.count])),
      totalRevenue: revenue[0]?.total || 0,
    },
  });
});
