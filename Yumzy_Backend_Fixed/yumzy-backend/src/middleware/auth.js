const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── Protect route (must be logged in) ─────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// ── Restrict to specific roles ─────────────────────────────────────────────
const authorize = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(" or ")}`,
      });
    }
    next();
  };

// ── Admin only ─────────────────────────────────────────────────────────────
const adminOnly = authorize("admin");

// ── Restaurant owner only (or admin) ──────────────────────────────────────
const ownerOrAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (req.user.role === "restaurant_owner") return next();
  return res.status(403).json({ success: false, message: "Access denied." });
};

module.exports = { protect, authorize, adminOnly, ownerOrAdmin };
