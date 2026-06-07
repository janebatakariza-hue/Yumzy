const Restaurant   = require("../models/Restaurant");
const User         = require("../models/User");
const { Notification, AuditLog } = require("../models/index");
const { asyncHandler }           = require("../middleware/errorHandler");
const { paginate, paginateResponse, logAudit, createNotification } = require("../utils/helpers");
const { sendEmail, emailTemplates } = require("../services/email");

// ── GET all restaurants (Admin) ────────────────────────────────────────────
exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const { search, category, isActive, isApproved, isOpen } = req.query;

  const filter = {};
  if (search)     filter.$or = [{ name: new RegExp(search, "i") }, { address: new RegExp(search, "i") }];
  if (category)   filter.category   = category;
  if (isActive  !== undefined) filter.isActive   = isActive  === "true";
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";
  if (isOpen    !== undefined) filter.isOpen     = isOpen    === "true";

  const [data, total] = await Promise.all([
    Restaurant.find(filter).populate("ownerId", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Restaurant.countDocuments(filter),
  ]);

  res.status(200).json(paginateResponse(data, total, page, limit));
});

// ── GET single restaurant ──────────────────────────────────────────────────
exports.getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate("ownerId", "name email phone");
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });
  res.status(200).json({ success: true, data: restaurant });
});

// ── GET my restaurant (owner) ──────────────────────────────────────────────
exports.getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) return res.status(404).json({ success: false, message: "You don't have a restaurant yet." });
  res.status(200).json({ success: true, data: restaurant });
});

// ── CREATE restaurant (Admin or owner registers) ───────────────────────────
exports.createRestaurant = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  // Assign owner
  if (req.user.role === "restaurant_owner") {
    data.ownerId = req.user._id;
  } else if (req.body.ownerId) {
    data.ownerId = req.body.ownerId;
  }

  if (req.files?.logo)      data.logo      = req.files.logo[0].path;
  if (req.files?.coverImage) data.coverImage = req.files.coverImage[0].path;

  // Admin-created restaurants are auto-approved
  if (req.user.role === "admin") {
    data.isApproved = true;
    data.approvedBy = req.user._id;
    data.approvedAt = new Date();
  }

  const restaurant = await Restaurant.create(data);

  // Link owner to restaurant
  if (data.ownerId) {
    await User.findByIdAndUpdate(data.ownerId, { restaurantId: restaurant._id });
  }

  await logAudit({ user: req.user, action: "CREATE_RESTAURANT", targetModel: "Restaurant", targetId: restaurant._id, details: `Created ${restaurant.name}`, req });

  res.status(201).json({ success: true, data: restaurant });
});

// ── UPDATE restaurant ──────────────────────────────────────────────────────
exports.updateRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

  // Owner can only update their own restaurant
  if (req.user.role === "restaurant_owner" && restaurant.ownerId?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  const updates = { ...req.body };
  if (req.files?.logo)      updates.logo      = req.files.logo[0].path;
  if (req.files?.coverImage) updates.coverImage = req.files.coverImage[0].path;

  // Owners can't change approval status
  if (req.user.role === "restaurant_owner") {
    delete updates.isApproved;
    delete updates.isSuspended;
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  await logAudit({ user: req.user, action: "UPDATE_RESTAURANT", targetModel: "Restaurant", targetId: restaurant._id, details: `Updated ${restaurant.name}`, req });

  res.status(200).json({ success: true, data: restaurant });
});

// ── APPROVE restaurant (Admin) ─────────────────────────────────────────────
exports.approveRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { isApproved: true, isActive: true, approvedBy: req.user._id, approvedAt: new Date() },
    { new: true }
  ).populate("ownerId", "name email");

  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

  // Notify owner by email
  if (restaurant.ownerId) {
    sendEmail({ to: restaurant.ownerId.email, ...emailTemplates.restaurantApproved(restaurant.ownerId.name, restaurant.name) }).catch(console.error);
  }

  await logAudit({ user: req.user, action: "APPROVE_RESTAURANT", targetModel: "Restaurant", targetId: restaurant._id, details: `Approved ${restaurant.name}`, req });

  res.status(200).json({ success: true, message: "Restaurant approved.", data: restaurant });
});

// ── SUSPEND restaurant (Admin) ─────────────────────────────────────────────
exports.suspendRestaurant = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { isSuspended: true, isActive: false, suspendedReason: reason },
    { new: true }
  ).populate("ownerId", "name email");

  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

  if (restaurant.ownerId) {
    sendEmail({ to: restaurant.ownerId.email, ...emailTemplates.restaurantSuspended(restaurant.ownerId.name, restaurant.name, reason) }).catch(console.error);
  }

  await logAudit({ user: req.user, action: "SUSPEND_RESTAURANT", targetModel: "Restaurant", targetId: restaurant._id, details: `Suspended: ${reason}`, req });

  res.status(200).json({ success: true, message: "Restaurant suspended.", data: restaurant });
});

// ── TOGGLE open/closed status ──────────────────────────────────────────────
exports.toggleOpen = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

  if (req.user.role === "restaurant_owner" && restaurant.ownerId?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  restaurant.isOpen = !restaurant.isOpen;
  await restaurant.save();

  res.status(200).json({ success: true, data: restaurant, message: `Restaurant is now ${restaurant.isOpen ? "open" : "closed"}.` });
});

// ── DELETE restaurant (Admin) ──────────────────────────────────────────────
exports.deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

  await logAudit({ user: req.user, action: "DELETE_RESTAURANT", targetModel: "Restaurant", targetId: req.params.id, details: `Deleted ${restaurant.name}`, req });

  res.status(200).json({ success: true, message: "Restaurant deleted." });
});
