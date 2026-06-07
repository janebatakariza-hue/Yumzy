const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:       "Yumzy API",
      version:     "1.0.0",
      description: "Yumzy Restaurant Management Platform — Complete REST API Documentation",
      contact: {
        name:  "Yumzy Team",
        email: "dev@yumzy.com",
      },
    },
    servers: [
      { url: "http://localhost:5000", description: "Development Server" },
      { url: "https://api.yumzy.com", description: "Production Server" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type:         "http",
          scheme:       "bearer",
          bearerFormat: "JWT",
          description:  "Enter your JWT token. Example: Bearer eyJhbGci...",
        },
      },
      schemas: {
        // ── Auth ───────────────────────────────────────────
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email:    { type: "string", format: "email", example: "admin@yumzy.com" },
            password: { type: "string", minLength: 6,    example: "password123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name:     { type: "string", example: "Jane Batakariza" },
            email:    { type: "string", format: "email", example: "jane@yumzy.com" },
            password: { type: "string", minLength: 6, example: "password123" },
            phone:    { type: "string", example: "+250788000000" },
            role:     { type: "string", enum: ["admin", "restaurant_owner"], example: "restaurant_owner" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success:      { type: "boolean", example: true },
            token:        { type: "string",  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            refreshToken: { type: "string",  example: "eyJhbGci..." },
            user: {
              type: "object",
              properties: {
                _id:   { type: "string" },
                name:  { type: "string" },
                email: { type: "string" },
                role:  { type: "string" },
              },
            },
          },
        },
        // ── User ───────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            _id:       { type: "string" },
            name:      { type: "string",  example: "Alice Mutesi" },
            email:     { type: "string",  example: "alice@yumzy.com" },
            phone:     { type: "string",  example: "+250788000001" },
            role:      { type: "string",  enum: ["admin", "restaurant_owner"] },
            isActive:  { type: "boolean", example: true },
            avatar:    { type: "string",  example: "https://res.cloudinary.com/..." },
            createdAt: { type: "string",  format: "date-time" },
          },
        },
        // ── Restaurant ─────────────────────────────────────
        Restaurant: {
          type: "object",
          properties: {
            _id:            { type: "string" },
            name:           { type: "string",  example: "Soy Restaurant" },
            category:       { type: "string",  enum: ["RESTAURANT","HOTEL","PUB","CAFE"] },
            address:        { type: "string",  example: "Kiyovu, Kigali" },
            phone:          { type: "string",  example: "+250788000001" },
            email:          { type: "string",  example: "soy@gmail.com" },
            representative: { type: "string",  example: "John Mutesi" },
            logo:           { type: "string",  example: "https://res.cloudinary.com/..." },
            coverImage:     { type: "string",  example: "https://res.cloudinary.com/..." },
            rating:         { type: "number",  example: 4.2 },
            totalSales:     { type: "number",  example: 12000000 },
            isActive:       { type: "boolean", example: true },
            isOpen:         { type: "boolean", example: true },
            isApproved:     { type: "boolean", example: true },
            ownerId:        { type: "string" },
            createdAt:      { type: "string",  format: "date-time" },
          },
        },
        RestaurantInput: {
          type: "object",
          required: ["name", "category", "address", "email", "phone"],
          properties: {
            name:           { type: "string", example: "Soy Restaurant" },
            category:       { type: "string", enum: ["RESTAURANT","HOTEL","PUB","CAFE"] },
            address:        { type: "string", example: "Kiyovu, Kigali" },
            phone:          { type: "string", example: "+250788000001" },
            email:          { type: "string", example: "soy@gmail.com" },
            representative: { type: "string", example: "John Mutesi" },
          },
        },
        // ── MenuItem ───────────────────────────────────────
        MenuItem: {
          type: "object",
          properties: {
            _id:          { type: "string" },
            name:         { type: "string",  example: "Tom Yummy" },
            description:  { type: "string",  example: "Spicy Thai noodle soup" },
            price:        { type: "number",  example: 6000 },
            category:     { type: "string",  enum: ["FOOD","DRINKS","DESSERT","STARTER"] },
            image:        { type: "string",  example: "https://res.cloudinary.com/..." },
            restaurantId: { type: "string" },
            isAvailable:  { type: "boolean", example: true },
            isSpecial:    { type: "boolean", example: false },
            createdAt:    { type: "string",  format: "date-time" },
          },
        },
        MenuItemInput: {
          type: "object",
          required: ["name", "price", "category", "restaurantId"],
          properties: {
            name:         { type: "string",  example: "Tom Yummy" },
            description:  { type: "string",  example: "Spicy Thai noodle soup" },
            price:        { type: "number",  example: 6000 },
            category:     { type: "string",  enum: ["FOOD","DRINKS","DESSERT","STARTER"] },
            restaurantId: { type: "string" },
            isSpecial:    { type: "boolean", example: false },
          },
        },
        // ── Order ──────────────────────────────────────────
        Order: {
          type: "object",
          properties: {
            _id:           { type: "string" },
            orderNumber:   { type: "string", example: "ORD-001" },
            clientName:    { type: "string", example: "Alice Mutesi" },
            clientPhone:   { type: "string", example: "+250788000000" },
            restaurantId:  { type: "string" },
            tableId:       { type: "string" },
            tableNumber:   { type: "string", example: "T01" },
            items:         { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
            totalAmount:   { type: "number", example: 18000 },
            status:        { type: "string", enum: ["NEW","WAITING","DELIVERED","REJECTED"] },
            paymentStatus: { type: "string", enum: ["PENDING","PAID","FAILED"] },
            paymentMethod: { type: "string", enum: ["CASH","CARD","MOBILE_MONEY"] },
            createdAt:     { type: "string", format: "date-time" },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            menuItemId: { type: "string" },
            name:       { type: "string",  example: "Tom Yummy" },
            qty:        { type: "integer", example: 2 },
            price:      { type: "number",  example: 6000 },
          },
        },
        OrderInput: {
          type: "object",
          required: ["restaurantId", "tableId", "items"],
          properties: {
            restaurantId:  { type: "string" },
            tableId:       { type: "string" },
            clientName:    { type: "string", example: "Alice Mutesi" },
            clientPhone:   { type: "string", example: "+250788000000" },
            items:         { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
            paymentMethod: { type: "string", enum: ["CASH","CARD","MOBILE_MONEY"] },
          },
        },
        // ── Table ──────────────────────────────────────────
        Table: {
          type: "object",
          properties: {
            _id:          { type: "string" },
            tableNumber:  { type: "string",  example: "T01" },
            capacity:     { type: "integer", example: 4 },
            status:       { type: "string",  enum: ["AVAILABLE","OCCUPIED","RESERVED"] },
            restaurantId: { type: "string" },
            waiterId:     { type: "string" },
            waiterName:   { type: "string",  example: "Sarah" },
            currentBill:  { type: "number",  example: 8000 },
            reservedFor:  { type: "string",  example: "John Doe" },
            reservedAt:   { type: "string",  example: "7:00 PM" },
          },
        },
        // ── Staff ──────────────────────────────────────────
        StaffMember: {
          type: "object",
          properties: {
            _id:            { type: "string" },
            name:           { type: "string",  example: "Paul Nkurunziza" },
            email:          { type: "string",  example: "paul@yumzy.com" },
            phone:          { type: "string",  example: "+250788000002" },
            role:           { type: "string",  enum: ["WAITER","CHEF","MANAGER","CASHIER"] },
            shift:          { type: "string",  enum: ["MORNING","AFTERNOON","NIGHT"] },
            restaurantId:   { type: "string" },
            restaurantName: { type: "string",  example: "Soy Restaurant" },
            salary:         { type: "number",  example: 150000 },
            isActive:       { type: "boolean", example: true },
            joinedAt:       { type: "string",  format: "date-time" },
          },
        },
        // ── Payment ────────────────────────────────────────
        Payment: {
          type: "object",
          properties: {
            _id:            { type: "string" },
            orderId:        { type: "string" },
            orderNumber:    { type: "string",  example: "ORD-001" },
            clientName:     { type: "string",  example: "Alice Mutesi" },
            restaurantId:   { type: "string" },
            restaurantName: { type: "string",  example: "Soy Restaurant" },
            amount:         { type: "number",  example: 18000 },
            method:         { type: "string",  enum: ["CASH","CARD","MOBILE_MONEY"] },
            status:         { type: "string",  enum: ["PAID","PENDING","FAILED","REFUNDED"] },
            createdAt:      { type: "string",  format: "date-time" },
          },
        },
        // ── Review ─────────────────────────────────────────
        Review: {
          type: "object",
          properties: {
            _id:            { type: "string" },
            clientId:       { type: "string" },
            clientName:     { type: "string",  example: "Alice Mutesi" },
            restaurantId:   { type: "string" },
            restaurantName: { type: "string",  example: "Soy Restaurant" },
            rating:         { type: "integer", minimum: 1, maximum: 5, example: 4 },
            comment:        { type: "string",  example: "Excellent service!" },
            status:         { type: "string",  enum: ["PUBLISHED","PENDING","REMOVED"] },
            createdAt:      { type: "string",  format: "date-time" },
          },
        },
        ReviewInput: {
          type: "object",
          required: ["restaurantId", "rating", "comment"],
          properties: {
            restaurantId: { type: "string" },
            rating:       { type: "integer", minimum: 1, maximum: 5, example: 4 },
            comment:      { type: "string", example: "Excellent service!" },
          },
        },
        // ── Reservation ────────────────────────────────────
        Reservation: {
          type: "object",
          properties: {
            _id:          { type: "string" },
            restaurantId: { type: "string" },
            tableId:      { type: "string" },
            guestName:    { type: "string",  example: "Alice Mutesi" },
            guestPhone:   { type: "string",  example: "+250788000000" },
            guestCount:   { type: "integer", example: 4 },
            date:         { type: "string",  format: "date", example: "2025-06-15" },
            time:         { type: "string",  example: "7:00 PM" },
            status:       { type: "string",  enum: ["PENDING","CONFIRMED","CANCELLED","COMPLETED"] },
            notes:        { type: "string",  example: "Birthday dinner" },
            createdAt:    { type: "string",  format: "date-time" },
          },
        },
        // ── Notification ───────────────────────────────────
        Notification: {
          type: "object",
          properties: {
            _id:          { type: "string" },
            userId:       { type: "string" },
            restaurantId: { type: "string" },
            title:        { type: "string",  example: "New Order Received" },
            message:      { type: "string",  example: "Table T01 placed an order" },
            type:         { type: "string",  enum: ["ORDER","PAYMENT","REVIEW","SYSTEM","ALERT"] },
            isRead:       { type: "boolean", example: false },
            createdAt:    { type: "string",  format: "date-time" },
          },
        },
        // ── Customer ───────────────────────────────────────
        Customer: {
          type: "object",
          properties: {
            _id:            { type: "string" },
            name:           { type: "string",  example: "Alice Mutesi" },
            email:          { type: "string",  example: "alice@email.com" },
            phone:          { type: "string",  example: "+250788000000" },
            restaurantId:   { type: "string" },
            totalOrders:    { type: "integer", example: 12 },
            totalSpent:     { type: "number",  example: 216000 },
            lastVisit:      { type: "string",  format: "date-time" },
            createdAt:      { type: "string",  format: "date-time" },
          },
        },
        // ── AuditLog ───────────────────────────────────────
        AuditLog: {
          type: "object",
          properties: {
            _id:       { type: "string" },
            userId:    { type: "string" },
            userName:  { type: "string",  example: "Jane Batakariza" },
            action:    { type: "string",  example: "APPROVE_RESTAURANT" },
            target:    { type: "string",  example: "Restaurant:64a..." },
            details:   { type: "string",  example: "Approved Soy Restaurant" },
            ipAddress: { type: "string",  example: "196.168.1.100" },
            createdAt: { type: "string",  format: "date-time" },
          },
        },
        // ── Error ──────────────────────────────────────────
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string",  example: "An error occurred" },
            errors:  { type: "array", items: { type: "object" } },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string",  example: "Operation successful" },
            data:    { type: "object" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success:    { type: "boolean", example: true },
            data:       { type: "array", items: {} },
            pagination: {
              type: "object",
              properties: {
                page:       { type: "integer", example: 1 },
                limit:      { type: "integer", example: 20 },
                total:      { type: "integer", example: 100 },
                totalPages: { type: "integer", example: 5 },
              },
            },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
