# 🍜 Yumzy Backend — Express.js REST API

Restaurant Management Platform API with full Swagger documentation.

---

## 📋 Table of Contents

1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [MongoDB Setup](#mongodb-setup)
4. [Running the Server](#running-the-server)
5. [Testing APIs with Swagger](#testing-apis-with-swagger)
6. [Folder Structure](#folder-structure)
7. [API Documentation](#api-documentation)
8. [Authentication & Roles](#authentication--roles)
9. [Frontend Integration](#frontend-integration)

---

## 1. Installation

```bash
# Clone / unzip the project
cd yumzy-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Then edit .env with your values
```

---

## 2. Environment Variables

Edit `.env` with these values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/yumzy` |
| `JWT_SECRET` | JWT signing secret (keep private!) | `supersecretkey123` |
| `JWT_EXPIRES_IN` | JWT expiry | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `anothersecret456` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123...` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP email | `you@gmail.com` |
| `EMAIL_PASS` | SMTP app password | `yourapppassword` |
| `ADMIN_PORTAL_URL` | Admin portal URL (for CORS & emails) | `http://localhost:5173` |
| `CLIENT_PORTAL_URL` | Client portal URL | `http://localhost:5174` |

---

## 3. MongoDB Setup

**Option A — Local MongoDB:**
```bash
# Install MongoDB locally (https://www.mongodb.com/try/download/community)
# Then start it:
mongod --dbpath /data/db
```

**Option B — MongoDB Atlas (recommended for production):**
1. Create a free account at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and paste it in your `.env` as `MONGO_URI`

---

## 4. Running the Server

```bash
# Development (with auto-restart on file changes)
npm run dev

# Production
npm start
```

Server starts at: **http://localhost:5000**

Swagger Docs at: **http://localhost:5000/api/docs**

Health check: **http://localhost:5000/health**

---

## 5. Testing APIs with Swagger 🧪

### Step 1 — Start the backend
```bash
npm run dev
```

### Step 2 — Open Swagger UI
Open your browser and go to:
```
http://localhost:5000/api/docs
```

You'll see a beautiful, interactive API documentation page with all endpoints listed.

### Step 3 — Authenticate
1. First, call `POST /api/auth/login` with:
   ```json
   {
     "email": "admin@yumzy.com",
     "password": "password123"
   }
   ```
2. Copy the `token` from the response.
3. Click the green **Authorize** 🔓 button at the top-right of Swagger UI.
4. In the popup, type:
   ```
   Bearer eyJhbGci...your_token_here...
   ```
5. Click **Authorize** then **Close**.

### Step 4 — Test endpoints
Now all protected endpoints will automatically include your JWT token.
Click any endpoint → **Try it out** → fill in parameters → **Execute**.

### Step 5 — Using JWT tokens in Swagger
- The `BearerAuth` scheme is pre-configured for all protected routes.
- Swagger remembers your token across page refreshes (`persistAuthorization: true`).
- If your token expires (after 7 days), log in again and update the Authorize button.

### Import into Postman
You can also import the full API spec into Postman:
```
http://localhost:5000/api/docs.json
```
In Postman: **Import** → **Link** → paste the URL above.

---

## 6. Folder Structure

```
yumzy-backend/
├── server.js                 # Entry point
├── package.json
├── .env.example              # Environment variables template
├── README.md
└── src/
    ├── app.js                # Express app setup, middleware, routes
    ├── config/
    │   ├── db.js             # MongoDB connection
    │   ├── cloudinary.js     # Cloudinary + Multer setup
    │   └── swagger.js        # Swagger/OpenAPI spec
    ├── controllers/
    │   ├── authController.js       # Auth logic
    │   ├── restaurantController.js # Restaurant CRUD + approve/suspend
    │   ├── menuController.js       # Menu items & categories
    │   ├── orderController.js      # Orders, status updates
    │   └── otherControllers.js     # Tables, staff, payments, reviews,
    │                               # reservations, notifications, customers,
    │                               # analytics, admin users, settings, audit logs
    ├── routes/
    │   ├── auth.js           # /api/auth/* routes
    │   ├── restaurants.js    # /api/restaurants/* routes
    │   └── api.js            # All other /api/* routes
    ├── models/
    │   ├── User.js           # User (admin / restaurant_owner)
    │   ├── Restaurant.js     # Restaurant
    │   ├── Menu.js           # MenuItem + MenuCategory
    │   ├── Order.js          # Order
    │   └── index.js          # Table, Staff, Payment, Review,
    │                         # Reservation, Notification, Customer,
    │                         # AuditLog, Settings
    ├── middleware/
    │   ├── auth.js           # protect, authorize, adminOnly, ownerOrAdmin
    │   ├── errorHandler.js   # Global error handler + asyncHandler
    │   └── validate.js       # express-validator error formatter
    ├── services/
    │   └── email.js          # Nodemailer + email templates
    └── utils/
        └── helpers.js        # JWT, pagination, audit logging, notifications
```

---

## 7. API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/logout` | Logout | Protected |
| GET | `/auth/me` | Get current user | Protected |
| PATCH | `/auth/me` | Update profile + avatar | Protected |
| PATCH | `/auth/change-password` | Change password | Protected |
| POST | `/auth/forgot-password` | Send reset email | Public |
| POST | `/auth/reset-password/:token` | Reset password | Public |
| POST | `/auth/refresh-token` | Get new access token | Public |

### Restaurant Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/restaurants` | List all restaurants | Admin/Owner |
| GET | `/restaurants/my` | Get owner's restaurant | Owner |
| GET | `/restaurants/:id` | Get one restaurant | Protected |
| POST | `/restaurants` | Create restaurant | Protected |
| PATCH | `/restaurants/:id` | Update restaurant | Owner/Admin |
| PATCH | `/restaurants/:id/approve` | Approve restaurant | Admin |
| PATCH | `/restaurants/:id/suspend` | Suspend restaurant | Admin |
| PATCH | `/restaurants/:id/toggle-open` | Toggle open/closed | Owner/Admin |
| DELETE | `/restaurants/:id` | Delete restaurant | Admin |

### Menu Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/menu/items` | Get menu items (filter by restaurant, category) |
| GET | `/menu/items/:id` | Get one item |
| POST | `/menu/items` | Create item (with image upload) |
| PATCH | `/menu/items/:id` | Update item |
| PATCH | `/menu/items/:id/toggle-availability` | Show/hide item |
| PATCH | `/menu/items/:id/toggle-special` | Toggle Special badge |
| DELETE | `/menu/items/:id` | Delete item |
| GET | `/menu/categories` | List categories |
| POST | `/menu/categories` | Create category |
| PATCH | `/menu/categories/:id` | Update category |
| DELETE | `/menu/categories/:id` | Delete category |

### Order Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/orders` | List orders (admin: all, owner: own restaurant) |
| GET | `/orders/stats` | Order stats by status + revenue |
| GET | `/orders/:id` | Get one order |
| POST | `/orders` | Create order (auto-creates payment, updates table) |
| PATCH | `/orders/:id/status` | Update status (DELIVERED frees table + marks paid) |

### Other Resources (see Swagger for full details)
- **Tables** — CRUD + status updates (`/tables`)
- **Staff** — CRUD + toggle active (`/staff`)
- **Payments** — List + status updates (`/payments`)
- **Reviews** — Submit, moderate, publish/remove (`/reviews`)
- **Reservations** — Book tables, confirm/cancel (`/reservations`)
- **Notifications** — List, mark read, delete (`/notifications`)
- **Customers** — CRUD per restaurant (`/customers`)
- **Analytics** — Revenue, orders, top items (`/analytics`)
- **Admin: Users** — List, toggle, delete (`/admin/users`)
- **Settings** — Get/update preferences (`/settings`)
- **Audit Logs** — Admin audit trail (`/audit-logs`)

---

## 8. Authentication & Roles

### Roles
| Role | Description |
|---|---|
| `admin` | Platform-wide access. Approves/suspends restaurants, manages users, sees all data. |
| `restaurant_owner` | Can only access and manage data belonging to their own restaurant. |

### How JWT Works
1. Login → receive `token` (7 days) + `refreshToken` (30 days)
2. Send token in every protected request header:
   ```
   Authorization: Bearer <token>
   ```
3. When token expires, use `POST /api/auth/refresh-token` with your `refreshToken`

---

## 9. Frontend Integration

### Admin Portal (`admin_portal`)
```
VITE_API_URL=http://localhost:5000/api
```

**Key integration points (currently using mock data — replace with API calls):**

```typescript
// src/data/restaurants.ts → replace with:
// TODO: GET /api/restaurants

// Clients page → replace with:
// TODO: GET /api/admin/users?role=restaurant_owner

// Orders → replace with:
// TODO: GET /api/orders
// TODO: PATCH /api/orders/:id/status

// Payments → replace with:
// TODO: GET /api/payments

// Reviews → replace with:
// TODO: GET /api/reviews
// TODO: PATCH /api/reviews/:id/status

// Staff → replace with:
// TODO: GET /api/staff

// Tables → replace with:
// TODO: GET /api/tables

// Menus → replace with:
// TODO: GET /api/menu/items

// Analytics → replace with:
// TODO: GET /api/analytics

// Notifications → replace with:
// TODO: GET /api/notifications

// Authentication:
// TODO: POST /api/auth/login  (currently navigates directly without auth)
// TODO: POST /api/auth/logout
```

### Client Portal (`client_portal`)
```
VITE_API_URL=http://localhost:5000/api
```

```typescript
// AuthPage login button → replace with:
// TODO: POST /api/auth/login

// Overview / Restaurants → replace with:
// TODO: GET /api/restaurants

// MenuPage → replace with:
// TODO: GET /api/menu/items?restaurantId=<id>

// MyOrders → replace with:
// TODO: GET /api/orders
// TODO: POST /api/orders

// MyTables → replace with:
// TODO: GET /api/tables?restaurantId=<id>

// Favourite → replace with:
// TODO: GET /api/restaurants?isFavourite=true  (add favourites feature)

// Clients (My Customers) → replace with:
// TODO: GET /api/customers

// Settings → replace with:
// TODO: GET /api/settings
// TODO: PATCH /api/settings

// MyProfile → replace with:
// TODO: GET /api/auth/me
// TODO: PATCH /api/auth/me
```

### Recommended API Client Setup (React + fetch)
```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("yumzy_token");
  const res   = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
};
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Web server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer + Cloudinary | File uploads |
| Nodemailer | Email sending |
| Swagger UI | API documentation & testing |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-validator | Request validation |

---

Made with ❤️ for **Yumzy** 🍜
