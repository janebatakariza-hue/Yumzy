const express = require("express");
const { body } = require("express-validator");
const router  = express.Router();
const ctrl    = require("../controllers/restaurantController");
const { protect, adminOnly, ownerOrAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management (CRUD, approve, suspend)
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get all restaurants (Admin) or filtered list
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [RESTAURANT, HOTEL, PUB, CAFE] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: isApproved
 *         schema: { type: boolean }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", protect, ctrl.getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/my:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get logged-in owner's restaurant
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Owner's restaurant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: No restaurant found for this owner
 */
router.get("/my", protect, ctrl.getMyRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get a single restaurant by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 */
router.get("/:id", protect, ctrl.getRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Create a new restaurant
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, category, address, email, phone]
 *             properties:
 *               name:           { type: string, example: "Soy Restaurant" }
 *               category:       { type: string, enum: [RESTAURANT, HOTEL, PUB, CAFE] }
 *               address:        { type: string, example: "Kiyovu, Kigali" }
 *               phone:          { type: string, example: "+250788000001" }
 *               email:          { type: string, example: "soy@gmail.com" }
 *               representative: { type: string, example: "John Mutesi" }
 *               logo:           { type: string, format: binary }
 *               coverImage:     { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Restaurant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.post("/", protect, ownerOrAdmin, [
  body("name").trim().notEmpty().withMessage("Restaurant name is required"),
  body("category").isIn(["RESTAURANT","HOTEL","PUB","CAFE"]).withMessage("Invalid category"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
], validate, ctrl.createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Update a restaurant
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
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.patch("/:id", protect, ownerOrAdmin, ctrl.updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}/approve:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Approve a restaurant (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant approved and owner notified by email
 *       403:
 *         description: Admin only
 */
router.patch("/:id/approve", protect, adminOnly, ctrl.approveRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}/suspend:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Suspend a restaurant (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string, example: "Policy violation" }
 *     responses:
 *       200:
 *         description: Restaurant suspended and owner notified
 */
router.patch("/:id/suspend", protect, adminOnly, ctrl.suspendRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}/toggle-open:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Toggle restaurant open/closed status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch("/:id/toggle-open", protect, ownerOrAdmin, ctrl.toggleOpen);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     tags: [Restaurants]
 *     summary: Delete a restaurant (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant deleted
 *       403:
 *         description: Admin only
 */
router.delete("/:id", protect, adminOnly, ctrl.deleteRestaurant);

module.exports = router;
