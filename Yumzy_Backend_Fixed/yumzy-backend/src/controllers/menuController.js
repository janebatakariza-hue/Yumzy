const { MenuItem, MenuCategory } = require("../models/Menu");
const { asyncHandler }           = require("../middleware/errorHandler");
const { paginate, paginateResponse } = require("../utils/helpers");

// ── MENU ITEMS ─────────────────────────────────────────────────────────────

// GET /api/menu/items?restaurantId=&category=&isAvailable=
exports.getMenuItems = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const { restaurantId, category, isAvailable, search, isSpecial } = req.query;

  const filter = {};
  if (restaurantId)            filter.restaurantId = restaurantId;
  if (category)                filter.category     = category;
  if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
  if (isSpecial   !== undefined) filter.isSpecial   = isSpecial   === "true";
  if (search)                  filter.$or = [{ name: new RegExp(search, "i") }, { description: new RegExp(search, "i") }];

  const [data, total] = await Promise.all([
    MenuItem.find(filter).sort({ category: 1, name: 1 }).skip(skip).limit(limit),
    MenuItem.countDocuments(filter),
  ]);

  res.status(200).json(paginateResponse(data, total, page, limit));
});

// GET /api/menu/items/:id
exports.getMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("restaurantId", "name");
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found." });
  res.status(200).json({ success: true, data: item });
});

// POST /api/menu/items
exports.createMenuItem = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = req.file.path;

  // Owner can only add items to their restaurant
  if (req.user.role === "restaurant_owner") {
    data.restaurantId = req.user.restaurantId?.toString();
  }

  const item = await MenuItem.create(data);
  res.status(201).json({ success: true, data: item });
});

// PATCH /api/menu/items/:id
exports.updateMenuItem = asyncHandler(async (req, res) => {
  const existing = await MenuItem.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Menu item not found." });

  // Ownership check
  if (req.user.role === "restaurant_owner" &&
      existing.restaurantId?.toString() !== req.user.restaurantId?.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  const updates = { ...req.body };
  if (req.file) updates.image = req.file.path;

  const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: item });
});

// PATCH /api/menu/items/:id/toggle-availability
exports.toggleAvailability = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found." });

  item.isAvailable = !item.isAvailable;
  await item.save();

  res.status(200).json({ success: true, data: item, message: `Item is now ${item.isAvailable ? "available" : "unavailable"}.` });
});

// PATCH /api/menu/items/:id/toggle-special
exports.toggleSpecial = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found." });

  item.isSpecial = !item.isSpecial;
  await item.save();

  res.status(200).json({ success: true, data: item });
});

// DELETE /api/menu/items/:id
exports.deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found." });
  res.status(200).json({ success: true, message: "Menu item deleted." });
});

// ── MENU CATEGORIES ────────────────────────────────────────────────────────

// GET /api/menu/categories?restaurantId=
exports.getCategories = asyncHandler(async (req, res) => {
  const { restaurantId } = req.query;
  const filter = {};
  if (restaurantId) filter.restaurantId = restaurantId;

  const categories = await MenuCategory.find(filter).sort({ sortOrder: 1, name: 1 });
  res.status(200).json({ success: true, data: categories });
});

// POST /api/menu/categories
exports.createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === "restaurant_owner") data.restaurantId = req.user.restaurantId;

  const category = await MenuCategory.create(data);
  res.status(201).json({ success: true, data: category });
});

// PATCH /api/menu/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await MenuCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ success: false, message: "Category not found." });
  res.status(200).json({ success: true, data: category });
});

// DELETE /api/menu/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await MenuCategory.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Category not found." });
  res.status(200).json({ success: true, message: "Category deleted." });
});
