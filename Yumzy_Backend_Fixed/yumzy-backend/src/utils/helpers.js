const jwt         = require("jsonwebtoken");
const { AuditLog } = require("../models/index");

// ── JWT ───────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" });

// ── Pagination helper ─────────────────────────────────────────────────────
const paginate = (query = {}) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

const paginateResponse = (data, total, page, limit) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});

// ── Audit logging ─────────────────────────────────────────────────────────
const logAudit = async ({ user, action, targetModel, targetId, details, req }) => {
  try {
    await AuditLog.create({
      userId:      user?._id,
      userName:    user?.name,
      userRole:    user?.role,
      action,
      targetModel,
      targetId,
      details,
      ipAddress: req?.ip || req?.headers?.["x-forwarded-for"],
      userAgent:   req?.headers?.["user-agent"],
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

// ── Notification helper ───────────────────────────────────────────────────
const createNotification = async (Notification, data) => {
  try {
    await Notification.create(data);
  } catch (err) {
    console.error("Notification creation error:", err.message);
  }
};

module.exports = { generateToken, generateRefreshToken, paginate, paginateResponse, logAudit, createNotification };
