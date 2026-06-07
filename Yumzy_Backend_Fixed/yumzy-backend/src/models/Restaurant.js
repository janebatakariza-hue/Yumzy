const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    category:       { type: String, enum: ["RESTAURANT","HOTEL","PUB","CAFE"], required: true },
    address:        { type: String, required: true, trim: true },
    phone:          { type: String, required: true, trim: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    representative: { type: String, trim: true },
    description:    { type: String },
    logo:           { type: String }, // Cloudinary URL
    coverImage:     { type: String }, // Cloudinary URL
    rating:         { type: Number, default: 0, min: 0, max: 5 },
    totalRatings:   { type: Number, default: 0 },
    totalSales:     { type: Number, default: 0 },
    totalOrders:    { type: Number, default: 0 },
    isActive:       { type: Boolean, default: true },
    isOpen:         { type: Boolean, default: false },
    isApproved:     { type: Boolean, default: false },
    isSuspended:    { type: Boolean, default: false },
    suspendedReason:{ type: String },
    ownerId:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt:     { type: Date },
    openingHours: {
      monday:    { open: String, close: String },
      tuesday:   { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday:  { open: String, close: String },
      friday:    { open: String, close: String },
      saturday:  { open: String, close: String },
      sunday:    { open: String, close: String },
    },
    location: {
      type:        { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ name: "text", address: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
