const mongoose = require("mongoose");

// ── Menu Category ──────────────────────────────────────────────────────────
const menuCategorySchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    description:  { type: String },
    icon:         { type: String },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    isActive:     { type: Boolean, default: true },
    sortOrder:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── Menu Item ──────────────────────────────────────────────────────────────
const menuItemSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    description:  { type: String },
    price:        { type: Number, required: true, min: 0 },
    category:     { type: String, enum: ["FOOD","DRINKS","DESSERT","STARTER"], required: true },
    categoryId:   { type: mongoose.Schema.Types.ObjectId, ref: "MenuCategory" },
    image:        { type: String }, // Cloudinary URL
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    isAvailable:  { type: Boolean, default: true },
    isSpecial:    { type: Boolean, default: false },
    totalOrders:  { type: Number, default: 0 },
    tags:         [{ type: String }], // ["spicy", "vegan", "gluten-free"]
    preparationTime: { type: Number, default: 15 }, // minutes
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ name: "text", description: "text" });

const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);
const MenuItem     = mongoose.model("MenuItem",     menuItemSchema);

module.exports = { MenuCategory, MenuItem };
