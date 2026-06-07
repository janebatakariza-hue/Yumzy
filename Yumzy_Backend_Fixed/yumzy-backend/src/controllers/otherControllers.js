const { Table, Staff, Payment, Review, Reservation, Notification, Customer, AuditLog, Settings } = require("../models/index");
const Restaurant = require("../models/Restaurant");
const User       = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");
const { paginate, paginateResponse, logAudit } = require("../utils/helpers");

// ════════════════════════════════════════════════════════════════
// TABLES
// ════════════════════════════════════════════════════════════════

exports.getTables = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  else if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { tableNumber: new RegExp(req.query.search, "i") },
      { waiterName:  new RegExp(req.query.search, "i") },
    ];
  }
  const [data, total] = await Promise.all([
    Table.find(filter).populate("waiterId", "name").sort({ tableNumber: 1 }).skip(skip).limit(limit),
    Table.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id).populate("waiterId", "name email");
  if (!table) return res.status(404).json({ success: false, message: "Table not found." });
  res.status(200).json({ success: true, data: table });
});

exports.createTable = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === "restaurant_owner") data.restaurantId = req.user.restaurantId;
  const table = await Table.create(data);
  res.status(201).json({ success: true, data: table });
});

exports.updateTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!table) return res.status(404).json({ success: false, message: "Table not found." });
  res.status(200).json({ success: true, data: table });
});

exports.updateTableStatus = asyncHandler(async (req, res) => {
  const { status, waiterName, waiterId, reservedFor, reservedAt } = req.body;
  const table = await Table.findByIdAndUpdate(
    req.params.id,
    { status, waiterName, waiterId, reservedFor, reservedAt },
    { new: true }
  );
  if (!table) return res.status(404).json({ success: false, message: "Table not found." });
  res.status(200).json({ success: true, data: table });
});

exports.deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);
  if (!table) return res.status(404).json({ success: false, message: "Table not found." });
  res.status(200).json({ success: true, message: "Table deleted." });
});

// ════════════════════════════════════════════════════════════════
// STAFF
// ════════════════════════════════════════════════════════════════

exports.getStaff = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  else if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
  if (req.query.role)   filter.role   = req.query.role;
  if (req.query.shift)  filter.shift  = req.query.shift;
  if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, "i") }, { email: new RegExp(req.query.search, "i") }];

  const [data, total] = await Promise.all([
    Staff.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Staff.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getStaffMember = asyncHandler(async (req, res) => {
  const member = await Staff.findById(req.params.id);
  if (!member) return res.status(404).json({ success: false, message: "Staff member not found." });
  res.status(200).json({ success: true, data: member });
});

exports.createStaff = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === "restaurant_owner") {
    data.restaurantId = req.user.restaurantId;
    const restaurant  = await Restaurant.findById(req.user.restaurantId).lean();
    data.restaurantName = restaurant?.name;
  }
  if (req.file) data.avatar = req.file.path;
  const member = await Staff.create(data);
  res.status(201).json({ success: true, data: member });
});

exports.updateStaff = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.avatar = req.file.path;
  const member = await Staff.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!member) return res.status(404).json({ success: false, message: "Staff member not found." });
  res.status(200).json({ success: true, data: member });
});

exports.toggleStaffActive = asyncHandler(async (req, res) => {
  const member = await Staff.findById(req.params.id);
  if (!member) return res.status(404).json({ success: false, message: "Staff member not found." });
  member.isActive = !member.isActive;
  await member.save();
  res.status(200).json({ success: true, data: member });
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  const member = await Staff.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ success: false, message: "Staff member not found." });
  res.status(200).json({ success: true, message: "Staff member removed." });
});

// ════════════════════════════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════════════════════════════

exports.getPayments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  else if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.method) filter.method = req.query.method;
  if (req.query.search) {
    filter.$or = [
      { clientName:  new RegExp(req.query.search, "i") },
      { orderNumber: new RegExp(req.query.search, "i") },
    ];
  }
  const [data, total] = await Promise.all([
    Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Payment.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate("orderId");
  if (!payment) return res.status(404).json({ success: false, message: "Payment not found." });
  res.status(200).json({ success: true, data: payment });
});

exports.updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, transactionRef } = req.body;
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status, transactionRef, ...(status === "PAID" ? { paidAt: new Date() } : {}) },
    { new: true }
  );
  if (!payment) return res.status(404).json({ success: false, message: "Payment not found." });
  res.status(200).json({ success: true, data: payment });
});

exports.getPaymentStats = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;

  const stats = await Payment.aggregate([
    { $match: filter },
    {
      $group: {
        _id:   "$status",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({ success: true, data: stats });
});

// ════════════════════════════════════════════════════════════════
// REVIEWS
// ════════════════════════════════════════════════════════════════

exports.getReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  else if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.rating) filter.rating = parseInt(req.query.rating);
  if (req.query.search) {
    filter.$or = [
      { clientName:     new RegExp(req.query.search, "i") },
      { restaurantName: new RegExp(req.query.search, "i") },
    ];
  }

  const [data, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });
  res.status(200).json({ success: true, data: review });
});

exports.createReview = asyncHandler(async (req, res) => {
  const { restaurantId, rating, comment } = req.body;
  const restaurant = await Restaurant.findById(restaurantId).lean();
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

  const review = await Review.create({
    clientId:       req.user._id,
    clientName:     req.user.name,
    restaurantId,
    restaurantName: restaurant.name,
    rating,
    comment,
    status: "PENDING",
  });

  // Update restaurant avg rating (published reviews only)
  const published = await Review.find({ restaurantId, status: "PUBLISHED" });
  if (published.length > 0) {
    const avg = published.reduce((s, r) => s + r.rating, 0) / published.length;
    await Restaurant.findByIdAndUpdate(restaurantId, { rating: Math.round(avg * 10) / 10, totalRatings: published.length });
  }

  res.status(201).json({ success: true, data: review });
});

exports.updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status, moderatedBy: req.user._id, moderatedAt: new Date() },
    { new: true }
  );
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });

  await logAudit({ user: req.user, action: `REVIEW_${status}`, targetModel: "Review", targetId: review._id, details: `Review ${status}`, req });

  res.status(200).json({ success: true, data: review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });
  res.status(200).json({ success: true, message: "Review deleted." });
});

// ════════════════════════════════════════════════════════════════
// RESERVATIONS
// ════════════════════════════════════════════════════════════════

exports.getReservations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  else if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date)   filter.date   = req.query.date;

  const [data, total] = await Promise.all([
    Reservation.find(filter).populate("tableId", "tableNumber capacity").sort({ date: 1, time: 1 }).skip(skip).limit(limit),
    Reservation.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate("tableId");
  if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found." });
  res.status(200).json({ success: true, data: reservation });
});

exports.createReservation = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === "restaurant_owner") data.restaurantId = req.user.restaurantId;

  const reservation = await Reservation.create(data);

  // Reserve the table
  if (data.tableId) {
    await Table.findByIdAndUpdate(data.tableId, {
      status:      "RESERVED",
      reservedFor: data.guestName,
      reservedAt:  data.time,
    });
  }

  res.status(201).json({ success: true, data: reservation });
});

exports.updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status, ...(status === "CONFIRMED" ? { confirmedBy: req.user._id, confirmedAt: new Date() } : {}) },
    { new: true }
  );
  if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found." });

  // If cancelled, free the table
  if (status === "CANCELLED" && reservation.tableId) {
    await Table.findByIdAndUpdate(reservation.tableId, { status: "AVAILABLE", reservedFor: null, reservedAt: null });
  }

  res.status(200).json({ success: true, data: reservation });
});

exports.deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found." });
  res.status(200).json({ success: true, message: "Reservation deleted." });
});

// ════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════════

exports.getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};

  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  else filter.userId = req.user._id;

  if (req.query.type)   filter.type   = req.query.type;
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === "true";

  const [data, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ ...filter, isRead: false }),
  ]);

  res.status(200).json({ ...paginateResponse(data, total, page, limit), unreadCount });
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!notif) return res.status(404).json({ success: false, message: "Notification not found." });
  res.status(200).json({ success: true, data: notif });
});

exports.markAllNotificationsRead = asyncHandler(async (req, res) => {
  const filter = req.user.role === "restaurant_owner"
    ? { restaurantId: req.user.restaurantId }
    : { userId: req.user._id };

  await Notification.updateMany({ ...filter, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: "All notifications marked as read." });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Notification deleted." });
});

// ════════════════════════════════════════════════════════════════
// CUSTOMERS
// ════════════════════════════════════════════════════════════════

exports.getCustomers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;
  if (req.query.search) {
    filter.$or = [
      { name:  new RegExp(req.query.search, "i") },
      { email: new RegExp(req.query.search, "i") },
      { phone: new RegExp(req.query.search, "i") },
    ];
  }
  const [data, total] = await Promise.all([
    Customer.find(filter).sort({ totalOrders: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
  res.status(200).json({ success: true, data: customer });
});

exports.createCustomer = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === "restaurant_owner") data.restaurantId = req.user.restaurantId;
  const customer = await Customer.create(data);
  res.status(201).json({ success: true, data: customer });
});

exports.updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
  res.status(200).json({ success: true, data: customer });
});

exports.deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
  res.status(200).json({ success: true, message: "Customer deleted." });
});

// ════════════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════════════

const Order = require("../models/Order");

exports.getAnalytics = asyncHandler(async (req, res) => {
  const Order = require("../models/Order");
  const filter = {};
  if (req.user.role === "restaurant_owner") filter.restaurantId = req.user.restaurantId;

  const [
    totalOrders,
    totalRevenue,
    ordersByStatus,
    revenueByDay,
    topMenuItems,
    topRestaurants,
    totalClients,
    avgRating,
  ] = await Promise.all([
    Order.countDocuments(filter),
    Order.aggregate([
      { $match: { ...filter, status: "DELIVERED" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { ...filter, status: "DELIVERED" } },
      {
        $group: {
          _id:     { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
    // Top menu items
    Order.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      {
        $group: {
          _id:     "$items.menuItemId",
          name:    { $first: "$items.name" },
          orders:  { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 10 },
    ]),
    // Top restaurants (admin only)
    req.user.role === "admin"
      ? Restaurant.find().sort({ totalSales: -1 }).limit(10).select("name category rating totalSales totalOrders")
      : Promise.resolve([]),
    req.user.role === "admin" ? User.countDocuments({ role: "restaurant_owner" }) : Promise.resolve(0),
    req.user.role === "restaurant_owner"
      ? Review.aggregate([
          { $match: { restaurantId: req.user.restaurantId, status: "PUBLISHED" } },
          { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
        ])
      : Promise.resolve([]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalRevenue:    totalRevenue[0]?.total || 0,
      ordersByStatus:  Object.fromEntries(ordersByStatus.map(s => [s._id, s.count])),
      revenueByDay,
      topMenuItems,
      topRestaurants,
      totalClients,
      avgRating: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 0,
    },
  });
});

// ════════════════════════════════════════════════════════════════
// ADMIN — USER MANAGEMENT
// ════════════════════════════════════════════════════════════════

exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.role)   filter.role   = req.query.role;
  if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, "i") }, { email: new RegExp(req.query.search, "i") }];

  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("restaurantId", "name category");
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.status(200).json({ success: true, data: user });
});

exports.toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  user.isActive = !user.isActive;
  await user.save();
  await logAudit({ user: req.user, action: `USER_${user.isActive ? "ACTIVATED" : "DEACTIVATED"}`, targetModel: "User", targetId: user._id, req });
  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  await logAudit({ user: req.user, action: "DELETE_USER", targetModel: "User", targetId: req.params.id, details: `Deleted ${user.email}`, req });
  res.status(200).json({ success: true, message: "User deleted." });
});

// ════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════

exports.getSettings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "restaurant_owner"
    ? { restaurantId: req.user.restaurantId }
    : { userId: req.user._id };

  let settings = await Settings.findOne(filter);
  if (!settings) settings = await Settings.create({ ...filter });

  res.status(200).json({ success: true, data: settings });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "restaurant_owner"
    ? { restaurantId: req.user.restaurantId }
    : { userId: req.user._id };

  const settings = await Settings.findOneAndUpdate(filter, req.body, { new: true, upsert: true, runValidators: true });
  res.status(200).json({ success: true, data: settings });
});

// ════════════════════════════════════════════════════════════════
// AUDIT LOGS
// ════════════════════════════════════════════════════════════════

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.action) filter.action = new RegExp(req.query.action, "i");

  const [data, total] = await Promise.all([
    AuditLog.find(filter).populate("userId", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(filter),
  ]);
  res.status(200).json(paginateResponse(data, total, page, limit));
});
