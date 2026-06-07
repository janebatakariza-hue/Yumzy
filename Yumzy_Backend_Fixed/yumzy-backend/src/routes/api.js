const express = require("express");
const { body } = require("express-validator");
const router  = express.Router();
const ctrl    = require("../controllers/otherControllers");
const menuCtrl= require("../controllers/menuController");
const orderCtrl=require("../controllers/orderController");
const { protect, adminOnly, ownerOrAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { uploadMenuItem, uploadAvatar } = require("../config/cloudinary");

// ════════════════════════════════════════════════════════
// MENU ITEMS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * tags:
 *   - name: Menu Items
 *     description: Menu item management per restaurant
 *   - name: Menu Categories
 *     description: Menu category management
 *   - name: Orders
 *     description: Order management and status updates
 *   - name: Tables
 *     description: Table management and status tracking
 *   - name: Staff
 *     description: Staff member management
 *   - name: Payments
 *     description: Payment tracking and status
 *   - name: Reviews
 *     description: Customer review moderation
 *   - name: Reservations
 *     description: Table reservation management
 *   - name: Notifications
 *     description: In-app notification management
 *   - name: Customers
 *     description: Customer management per restaurant
 *   - name: Analytics
 *     description: Revenue and performance analytics
 *   - name: Admin Operations
 *     description: Admin-only user and platform management
 *   - name: Settings
 *     description: User and restaurant settings
 *   - name: Audit Logs
 *     description: Platform activity audit trail
 */

/**
 * @swagger
 * /api/menu/items:
 *   get:
 *     tags: [Menu Items]
 *     summary: Get menu items (filter by restaurantId, category, availability)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *         description: Filter by restaurant
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [FOOD, DRINKS, DESSERT, STARTER] }
 *       - in: query
 *         name: isAvailable
 *         schema: { type: boolean }
 *       - in: query
 *         name: isSpecial
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated menu items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/menu/items", protect, menuCtrl.getMenuItems);

/**
 * @swagger
 * /api/menu/items/{id}:
 *   get:
 *     tags: [Menu Items]
 *     summary: Get a single menu item
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Not found
 */
router.get("/menu/items/:id", protect, menuCtrl.getMenuItem);

/**
 * @swagger
 * /api/menu/items:
 *   post:
 *     tags: [Menu Items]
 *     summary: Create a new menu item
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, category, restaurantId]
 *             properties:
 *               name:         { type: string, example: "Tom Yummy" }
 *               description:  { type: string, example: "Spicy Thai noodle soup" }
 *               price:        { type: number, example: 6000 }
 *               category:     { type: string, enum: [FOOD, DRINKS, DESSERT, STARTER] }
 *               restaurantId: { type: string }
 *               isSpecial:    { type: boolean }
 *               image:        { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Menu item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
router.post("/menu/items", protect, ownerOrAdmin, [
  body("name").trim().notEmpty().withMessage("Item name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category").isIn(["FOOD","DRINKS","DESSERT","STARTER"]).withMessage("Invalid category"),
], validate, uploadMenuItem.single("image"), menuCtrl.createMenuItem);

/**
 * @swagger
 * /api/menu/items/{id}:
 *   patch:
 *     tags: [Menu Items]
 *     summary: Update a menu item
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemInput'
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.patch("/menu/items/:id", protect, ownerOrAdmin, uploadMenuItem.single("image"), menuCtrl.updateMenuItem);

/**
 * @swagger
 * /api/menu/items/{id}/toggle-availability:
 *   patch:
 *     tags: [Menu Items]
 *     summary: Toggle item availability (show/hide on menu)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Availability toggled
 */
router.patch("/menu/items/:id/toggle-availability", protect, ownerOrAdmin, menuCtrl.toggleAvailability);

/**
 * @swagger
 * /api/menu/items/{id}/toggle-special:
 *   patch:
 *     tags: [Menu Items]
 *     summary: Toggle item "special" badge
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Special status toggled
 */
router.patch("/menu/items/:id/toggle-special", protect, ownerOrAdmin, menuCtrl.toggleSpecial);

/**
 * @swagger
 * /api/menu/items/{id}:
 *   delete:
 *     tags: [Menu Items]
 *     summary: Delete a menu item
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/menu/items/:id", protect, ownerOrAdmin, menuCtrl.deleteMenuItem);

// ── Categories ────────────────────────────────────────────────
/**
 * @swagger
 * /api/menu/categories:
 *   get:
 *     tags: [Menu Categories]
 *     summary: Get menu categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/menu/categories", protect, menuCtrl.getCategories);

/**
 * @swagger
 * /api/menu/categories:
 *   post:
 *     tags: [Menu Categories]
 *     summary: Create a menu category
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, restaurantId]
 *             properties:
 *               name:         { type: string, example: "Starters" }
 *               description:  { type: string }
 *               restaurantId: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/menu/categories", protect, ownerOrAdmin, menuCtrl.createCategory);

/**
 * @swagger
 * /api/menu/categories/{id}:
 *   patch:
 *     tags: [Menu Categories]
 *     summary: Update a menu category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch("/menu/categories/:id", protect, ownerOrAdmin, menuCtrl.updateCategory);

/**
 * @swagger
 * /api/menu/categories/{id}:
 *   delete:
 *     tags: [Menu Categories]
 *     summary: Delete a menu category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/menu/categories/:id", protect, ownerOrAdmin, menuCtrl.deleteCategory);

// ════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (Admin sees all, owners see their restaurant's)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [NEW, WAITING, DELIVERED, REJECTED] }
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: paymentStatus
 *         schema: { type: string, enum: [PENDING, PAID, FAILED] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date, example: "2025-06-01" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated orders
 */
router.get("/orders", protect, orderCtrl.getOrders);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     tags: [Orders]
 *     summary: Get order statistics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order stats by status and revenue
 */
router.get("/orders/stats", protect, orderCtrl.getOrderStats);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get a single order by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get("/orders/:id", protect, orderCtrl.getOrder);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created, payment record created, table status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post("/orders", protect, [
  body("restaurantId").notEmpty().withMessage("Restaurant ID is required"),
  body("clientName").trim().notEmpty().withMessage("Client name is required"),
  body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
], validate, orderCtrl.createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:          { type: string, enum: [NEW, WAITING, DELIVERED, REJECTED] }
 *               rejectionReason: { type: string, example: "Item not available" }
 *     responses:
 *       200:
 *         description: Status updated (DELIVERED also marks payment paid and frees table)
 */
router.patch("/orders/:id/status", protect, ownerOrAdmin, [
  body("status").isIn(["NEW","WAITING","DELIVERED","REJECTED"]).withMessage("Invalid status"),
], validate, orderCtrl.updateOrderStatus);

// ════════════════════════════════════════════════════════
// TABLES
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/tables:
 *   get:
 *     tags: [Tables]
 *     summary: Get all tables
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [AVAILABLE, OCCUPIED, RESERVED] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated tables
 */
router.get("/tables", protect, ctrl.getTables);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     tags: [Tables]
 *     summary: Get a single table
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Table details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 */
router.get("/tables/:id", protect, ctrl.getTable);

/**
 * @swagger
 * /api/tables:
 *   post:
 *     tags: [Tables]
 *     summary: Create a new table
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tableNumber, capacity, restaurantId]
 *             properties:
 *               tableNumber:  { type: string, example: "T01" }
 *               capacity:     { type: integer, example: 4 }
 *               restaurantId: { type: string }
 *               waiterName:   { type: string }
 *               status:       { type: string, enum: [AVAILABLE, OCCUPIED, RESERVED] }
 *     responses:
 *       201:
 *         description: Table created
 */
router.post("/tables", protect, ownerOrAdmin, [
  body("tableNumber").trim().notEmpty().withMessage("Table number is required"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
], validate, ctrl.createTable);

/**
 * @swagger
 * /api/tables/{id}:
 *   patch:
 *     tags: [Tables]
 *     summary: Update table details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Table updated
 */
router.patch("/tables/:id", protect, ownerOrAdmin, ctrl.updateTable);

/**
 * @swagger
 * /api/tables/{id}/status:
 *   patch:
 *     tags: [Tables]
 *     summary: Update table status (AVAILABLE / OCCUPIED / RESERVED)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:      { type: string, enum: [AVAILABLE, OCCUPIED, RESERVED] }
 *               waiterName:  { type: string }
 *               reservedFor: { type: string }
 *               reservedAt:  { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/tables/:id/status", protect, ownerOrAdmin, ctrl.updateTableStatus);

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     tags: [Tables]
 *     summary: Delete a table
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/tables/:id", protect, ownerOrAdmin, ctrl.deleteTable);

// ════════════════════════════════════════════════════════
// STAFF
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/staff:
 *   get:
 *     tags: [Staff]
 *     summary: Get all staff members
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [WAITER, CHEF, MANAGER, CASHIER] }
 *       - in: query
 *         name: shift
 *         schema: { type: string, enum: [MORNING, AFTERNOON, NIGHT] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated staff list
 */
router.get("/staff", protect, ownerOrAdmin, ctrl.getStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     tags: [Staff]
 *     summary: Get a single staff member
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Staff member details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffMember'
 */
router.get("/staff/:id", protect, ownerOrAdmin, ctrl.getStaffMember);

/**
 * @swagger
 * /api/staff:
 *   post:
 *     tags: [Staff]
 *     summary: Add a staff member
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, email, role, shift, restaurantId]
 *             properties:
 *               name:         { type: string, example: "Paul Nkurunziza" }
 *               email:        { type: string, example: "paul@yumzy.com" }
 *               phone:        { type: string }
 *               role:         { type: string, enum: [WAITER, CHEF, MANAGER, CASHIER] }
 *               shift:        { type: string, enum: [MORNING, AFTERNOON, NIGHT] }
 *               salary:       { type: number, example: 150000 }
 *               restaurantId: { type: string }
 *               avatar:       { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Staff member added
 */
router.post("/staff", protect, ownerOrAdmin, [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("role").isIn(["WAITER","CHEF","MANAGER","CASHIER"]).withMessage("Invalid role"),
  body("shift").isIn(["MORNING","AFTERNOON","NIGHT"]).withMessage("Invalid shift"),
], validate, uploadAvatar.single("avatar"), ctrl.createStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   patch:
 *     tags: [Staff]
 *     summary: Update a staff member
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch("/staff/:id", protect, ownerOrAdmin, uploadAvatar.single("avatar"), ctrl.updateStaff);

/**
 * @swagger
 * /api/staff/{id}/toggle-active:
 *   patch:
 *     tags: [Staff]
 *     summary: Activate / deactivate a staff member
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Active status toggled
 */
router.patch("/staff/:id/toggle-active", protect, ownerOrAdmin, ctrl.toggleStaffActive);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     tags: [Staff]
 *     summary: Remove a staff member
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/staff/:id", protect, ownerOrAdmin, ctrl.deleteStaff);

// ════════════════════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PAID, PENDING, FAILED, REFUNDED] }
 *       - in: query
 *         name: method
 *         schema: { type: string, enum: [CASH, CARD, MOBILE_MONEY] }
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated payments
 */
router.get("/payments", protect, ownerOrAdmin, ctrl.getPayments);

/**
 * @swagger
 * /api/payments/stats:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment statistics grouped by status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payment stats
 */
router.get("/payments/stats", protect, ownerOrAdmin, ctrl.getPaymentStats);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get a single payment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
router.get("/payments/:id", protect, ownerOrAdmin, ctrl.getPayment);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   patch:
 *     tags: [Payments]
 *     summary: Update payment status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:         { type: string, enum: [PAID, PENDING, FAILED, REFUNDED] }
 *               transactionRef: { type: string, example: "TXN-12345" }
 *     responses:
 *       200:
 *         description: Payment status updated
 */
router.patch("/payments/:id/status", protect, ownerOrAdmin, ctrl.updatePaymentStatus);

// ════════════════════════════════════════════════════════
// REVIEWS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PUBLISHED, PENDING, REMOVED] }
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: rating
 *         schema: { type: integer, minimum: 1, maximum: 5 }
 *     responses:
 *       200:
 *         description: Paginated reviews
 */
router.get("/reviews", protect, ownerOrAdmin, ctrl.getReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get a single review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.get("/reviews/:id", protect, ctrl.getReview);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review for a restaurant
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review submitted (status PENDING until moderated)
 */
router.post("/reviews", protect, [
  body("restaurantId").notEmpty().withMessage("Restaurant ID is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
  body("comment").trim().notEmpty().withMessage("Comment is required"),
], validate, ctrl.createReview);

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update review status — approve, publish, or remove (Admin/Owner)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [PUBLISHED, PENDING, REMOVED] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/reviews/:id/status", protect, ownerOrAdmin, ctrl.updateReviewStatus);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/reviews/:id", protect, adminOnly, ctrl.deleteReview);

// ════════════════════════════════════════════════════════
// RESERVATIONS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Get all reservations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED] }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Paginated reservations
 */
router.get("/reservations", protect, ownerOrAdmin, ctrl.getReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get a single reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.get("/reservations/:id", protect, ownerOrAdmin, ctrl.getReservation);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a reservation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, guestName, guestPhone, guestCount, date, time]
 *             properties:
 *               restaurantId: { type: string }
 *               tableId:      { type: string }
 *               guestName:    { type: string, example: "Alice Mutesi" }
 *               guestPhone:   { type: string, example: "+250788000000" }
 *               guestCount:   { type: integer, example: 4 }
 *               date:         { type: string, format: date, example: "2025-06-15" }
 *               time:         { type: string, example: "7:00 PM" }
 *               notes:        { type: string }
 *     responses:
 *       201:
 *         description: Reservation created
 */
router.post("/reservations", protect, ownerOrAdmin, [
  body("guestName").trim().notEmpty().withMessage("Guest name is required"),
  body("guestPhone").trim().notEmpty().withMessage("Guest phone is required"),
  body("guestCount").isInt({ min: 1 }).withMessage("Guest count must be at least 1"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
], validate, ctrl.createReservation);

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   patch:
 *     tags: [Reservations]
 *     summary: Update reservation status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED] }
 *     responses:
 *       200:
 *         description: Status updated (CANCELLED also frees the table)
 */
router.patch("/reservations/:id/status", protect, ownerOrAdmin, ctrl.updateReservationStatus);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     tags: [Reservations]
 *     summary: Delete a reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/reservations/:id", protect, ownerOrAdmin, ctrl.deleteReservation);

// ════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications for current user / restaurant
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [ORDER, PAYMENT, REVIEW, SYSTEM, ALERT] }
 *       - in: query
 *         name: isRead
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Notifications list with unread count
 */
router.get("/notifications", protect, ctrl.getNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Marked as read
 */
router.patch("/notifications/:id/read", protect, ctrl.markNotificationRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark ALL notifications as read
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All marked as read
 */
router.patch("/notifications/read-all", protect, ctrl.markAllNotificationsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/notifications/:id", protect, ctrl.deleteNotification);

// ════════════════════════════════════════════════════════
// CUSTOMERS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get all customers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated customers sorted by total orders
 */
router.get("/customers", protect, ownerOrAdmin, ctrl.getCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get a customer by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
router.get("/customers/:id", protect, ownerOrAdmin, ctrl.getCustomer);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     tags: [Customers]
 *     summary: Add a customer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:         { type: string, example: "Alice Mutesi" }
 *               email:        { type: string }
 *               phone:        { type: string }
 *               restaurantId: { type: string }
 *     responses:
 *       201:
 *         description: Customer created
 */
router.post("/customers", protect, ownerOrAdmin, ctrl.createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   patch:
 *     tags: [Customers]
 *     summary: Update a customer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch("/customers/:id", protect, ownerOrAdmin, ctrl.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Delete a customer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/customers/:id", protect, ownerOrAdmin, ctrl.deleteCustomer);

// ════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/analytics:
 *   get:
 *     tags: [Analytics]
 *     summary: Get platform / restaurant analytics
 *     description: >
 *       Admin sees platform-wide stats. Restaurant owners see only their restaurant's stats.
 *       Returns total orders, revenue by day, top menu items, top restaurants (admin), avg rating.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:      { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:    { type: integer }
 *                     totalRevenue:   { type: number }
 *                     ordersByStatus: { type: object }
 *                     revenueByDay:   { type: array, items: { type: object } }
 *                     topMenuItems:   { type: array, items: { type: object } }
 *                     topRestaurants: { type: array, items: { type: object } }
 */
router.get("/analytics", protect, ownerOrAdmin, ctrl.getAnalytics);

// ════════════════════════════════════════════════════════
// ADMIN — USER MANAGEMENT
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin Operations]
 *     summary: Get all users (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [admin, restaurant_owner] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated users
 */
router.get("/admin/users", protect, adminOnly, ctrl.getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin Operations]
 *     summary: Get a single user (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/admin/users/:id", protect, adminOnly, ctrl.getUser);

/**
 * @swagger
 * /api/admin/users/{id}/toggle-active:
 *   patch:
 *     tags: [Admin Operations]
 *     summary: Activate / deactivate a user account (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Active status toggled
 */
router.patch("/admin/users/:id/toggle-active", protect, adminOnly, ctrl.toggleUserActive);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin Operations]
 *     summary: Delete a user (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/admin/users/:id", protect, adminOnly, ctrl.deleteUser);

// ════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get settings for the current user or restaurant
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings object (created with defaults if not found)
 */
router.get("/settings", protect, ctrl.getSettings);

/**
 * @swagger
 * /api/settings:
 *   patch:
 *     tags: [Settings]
 *     summary: Update settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications: { type: boolean }
 *               smsNotifications:   { type: boolean }
 *               orderUpdates:       { type: boolean }
 *               promoEmails:        { type: boolean }
 *               darkMode:           { type: boolean }
 *               language:           { type: string, example: "en" }
 *               currency:           { type: string, example: "RWF" }
 *               timezone:           { type: string, example: "Africa/Kigali" }
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.patch("/settings", protect, ctrl.updateSettings);

// ════════════════════════════════════════════════════════
// AUDIT LOGS
// ════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags: [Audit Logs]
 *     summary: Get audit logs (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: action
 *         schema: { type: string, example: "APPROVE_RESTAURANT" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated audit logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/audit-logs", protect, adminOnly, ctrl.getAuditLogs);

module.exports = router;
