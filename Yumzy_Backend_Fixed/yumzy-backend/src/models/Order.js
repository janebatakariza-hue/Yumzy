const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  name:       { type: String, required: true },
  qty:        { type: Number, required: true, min: 1 },
  price:      { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber:    { type: String, unique: true }, // e.g. ORD-20250601-0001
    restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    restaurantName: { type: String },
    tableId:        { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    tableNumber:    { type: String },
    customerId:     { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    clientName:     { type: String, required: true },
    clientPhone:    { type: String },
    items:          { type: [orderItemSchema], required: true },
    totalAmount:    { type: Number, required: true },
    status:         { type: String, enum: ["NEW","WAITING","DELIVERED","REJECTED"], default: "NEW" },
    paymentStatus:  { type: String, enum: ["PENDING","PAID","FAILED"],              default: "PENDING" },
    paymentMethod:  { type: String, enum: ["CASH","CARD","MOBILE_MONEY"],           default: "CASH" },
    notes:          { type: String },
    rejectionReason:{ type: String },
    servedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    deliveredAt:    { type: Date },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date    = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count   = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${date}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
