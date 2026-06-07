const mongoose = require("mongoose");

// ── Table ──────────────────────────────────────────────────────────────────
const tableSchema = new mongoose.Schema(
  {
    tableNumber:  { type: String, required: true },
    capacity:     { type: Number, required: true, min: 1 },
    status:       { type: String, enum: ["AVAILABLE","OCCUPIED","RESERVED"], default: "AVAILABLE" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    waiterId:     { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    waiterName:   { type: String },
    currentBill:  { type: Number, default: 0 },
    currentOrderId:{ type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    reservedFor:  { type: String },
    reservedAt:   { type: String },
    qrCode:       { type: String },
  },
  { timestamps: true }
);
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

// ── Staff ──────────────────────────────────────────────────────────────────
const staffSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    phone:          { type: String },
    role:           { type: String, enum: ["WAITER","CHEF","MANAGER","CASHIER"], required: true },
    shift:          { type: String, enum: ["MORNING","AFTERNOON","NIGHT"],       required: true },
    restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant",   required: true },
    restaurantName: { type: String },
    salary:         { type: Number, default: 0 },
    isActive:       { type: Boolean, default: true },
    avatar:         { type: String },
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joinedAt:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── Payment ────────────────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema(
  {
    orderId:        { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    orderNumber:    { type: String },
    restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    restaurantName: { type: String },
    clientName:     { type: String },
    customerId:     { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    amount:         { type: Number, required: true },
    method:         { type: String, enum: ["CASH","CARD","MOBILE_MONEY"], required: true },
    status:         { type: String, enum: ["PAID","PENDING","FAILED","REFUNDED"], default: "PENDING" },
    transactionRef: { type: String },
    paidAt:         { type: Date },
  },
  { timestamps: true }
);

// ── Review ─────────────────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema(
  {
    clientId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clientName:     { type: String, required: true },
    clientAvatar:   { type: String },
    restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    restaurantName: { type: String },
    rating:         { type: Number, required: true, min: 1, max: 5 },
    comment:        { type: String, required: true },
    status:         { type: String, enum: ["PUBLISHED","PENDING","REMOVED"], default: "PENDING" },
    moderatedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moderatedAt:    { type: Date },
  },
  { timestamps: true }
);

// ── Reservation ────────────────────────────────────────────────────────────
const reservationSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableId:      { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    customerId:   { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    guestName:    { type: String, required: true },
    guestPhone:   { type: String, required: true },
    guestEmail:   { type: String },
    guestCount:   { type: Number, required: true, min: 1 },
    date:         { type: String, required: true },
    time:         { type: String, required: true },
    status:       { type: String, enum: ["PENDING","CONFIRMED","CANCELLED","COMPLETED"], default: "PENDING" },
    notes:        { type: String },
    confirmedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    confirmedAt:  { type: Date },
  },
  { timestamps: true }
);

// ── Notification ───────────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    title:        { type: String, required: true },
    message:      { type: String, required: true },
    type:         { type: String, enum: ["ORDER","PAYMENT","REVIEW","SYSTEM","ALERT"], required: true },
    isRead:       { type: Boolean, default: false },
    link:         { type: String },
    metadata:     { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
notificationSchema.index({ userId: 1, isRead: 1 });

// ── Customer ───────────────────────────────────────────────────────────────
const customerSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, lowercase: true, trim: true },
    phone:        { type: String },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    totalOrders:  { type: Number, default: 0 },
    totalSpent:   { type: Number, default: 0 },
    lastVisit:    { type: Date },
    notes:        { type: String },
  },
  { timestamps: true }
);

// ── AuditLog ───────────────────────────────────────────────────────────────
const auditLogSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName:     { type: String },
    userRole:     { type: String },
    action:       { type: String, required: true }, // e.g. "APPROVE_RESTAURANT"
    targetModel:  { type: String },                 // e.g. "Restaurant"
    targetId:     { type: mongoose.Schema.Types.ObjectId },
    details:      { type: String },
    ipAddress:    { type: String },
    userAgent:    { type: String },
  },
  { timestamps: true }
);
auditLogSchema.index({ createdAt: -1 });

// ── Settings ───────────────────────────────────────────────────────────────
const settingsSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Notification prefs
    emailNotifications: { type: Boolean, default: true },
    smsNotifications:   { type: Boolean, default: true },
    orderUpdates:       { type: Boolean, default: true },
    promoEmails:        { type: Boolean, default: false },
    // Appearance
    darkMode:   { type: Boolean, default: false },
    language:   { type: String,  default: "en" },
    currency:   { type: String,  default: "RWF" },
    timezone:   { type: String,  default: "Africa/Kigali" },
    // Platform settings (admin only)
    maintenanceMode:       { type: Boolean, default: false },
    allowNewRegistrations: { type: Boolean, default: true },
    requireApproval:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = {
  Table:        mongoose.model("Table",        tableSchema),
  Staff:        mongoose.model("Staff",        staffSchema),
  Payment:      mongoose.model("Payment",      paymentSchema),
  Review:       mongoose.model("Review",       reviewSchema),
  Reservation:  mongoose.model("Reservation",  reservationSchema),
  Notification: mongoose.model("Notification", notificationSchema),
  Customer:     mongoose.model("Customer",     customerSchema),
  AuditLog:     mongoose.model("AuditLog",     auditLogSchema),
  Settings:     mongoose.model("Settings",     settingsSchema),
};
