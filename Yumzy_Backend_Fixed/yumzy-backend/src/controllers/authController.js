const crypto = require("crypto");
const User   = require("../models/User");
const { generateToken, generateRefreshToken, logAudit } = require("../utils/helpers");
const { sendEmail, emailTemplates } = require("../services/email");
const { asyncHandler } = require("../middleware/errorHandler");

// ── Register ───────────────────────────────────────────────────────────────
// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Only admins can create admin accounts
  if (role === "admin" && (!req.user || req.user.role !== "admin")) {
    return res.status(403).json({ success: false, message: "Only admins can create admin accounts." });
  }

  const user = await User.create({ name, email, password, phone, role: role || "restaurant_owner" });

  // Send welcome email (non-blocking)
  sendEmail({ to: email, ...emailTemplates.welcomeAdmin(name) }).catch(console.error);

  const token        = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({ success: true, token, refreshToken, user });
});

// ── Login ──────────────────────────────────────────────────────────────────
// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: "Your account has been deactivated." });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  await logAudit({ user, action: "LOGIN", details: "User logged in", req });

  const token        = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({ success: true, token, refreshToken, user });
});

// ── Logout ─────────────────────────────────────────────────────────────────
// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  await logAudit({ user: req.user, action: "LOGOUT", details: "User logged out", req });
  res.status(200).json({ success: true, message: "Logged out successfully." });
});

// ── Get Me ─────────────────────────────────────────────────────────────────
// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("restaurantId", "name category isApproved");
  res.status(200).json({ success: true, data: user });
});

// ── Update Profile ─────────────────────────────────────────────────────────
// PATCH /api/auth/me
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone"];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (req.file) updates.avatar = req.file.path;

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});

// ── Change Password ────────────────────────────────────────────────────────
// PATCH /api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ success: false, message: "Current password is incorrect." });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully." });
});

// ── Forgot Password ────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Don't reveal if user exists
    return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
  }

  const token  = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken  = hashed;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.ADMIN_PORTAL_URL}/reset-password/${token}`;

  try {
    await sendEmail({ to: user.email, ...emailTemplates.passwordReset(user.name, resetUrl) });
    res.status(200).json({ success: true, message: "Password reset email sent." });
  } catch (err) {
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, message: "Email could not be sent." });
  }
});

// ── Reset Password ─────────────────────────────────────────────────────────
// POST /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:  hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
  }

  user.password            = req.body.password;
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ success: true, message: "Password reset successful.", token });
});

// ── Refresh Token ──────────────────────────────────────────────────────────
// POST /api/auth/refresh-token
exports.refreshToken = asyncHandler(async (req, res) => {
  const jwt = require("jsonwebtoken");
  try {
    const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Invalid refresh token." });

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token });
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
  }
});
