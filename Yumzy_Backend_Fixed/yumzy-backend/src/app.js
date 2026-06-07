require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const rateLimit    = require("express-rate-limit");
const swaggerUi    = require("swagger-ui-express");
const swaggerSpec  = require("./config/swagger");

const authRoutes   = require("./routes/auth");
const apiRoutes    = require("./routes/api");
const restRoutes   = require("./routes/restaurants");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // disabled for Swagger UI
app.use(cors({
  origin: [
    process.env.ADMIN_PORTAL_URL  || "http://localhost:5173",
    process.env.CLIENT_PORTAL_URL || "http://localhost:5174",
    "http://localhost:3000",
  ],
  credentials: true,
}));

// ── Rate limiting ──────────────────────────────────────────────────────────
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { success: false, message: "Too many auth requests, please try again later." },
}));

app.use("/api", rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 200,
  message: { success: false, message: "Too many requests, please try again later." },
}));

// ── Body parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Logger ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ── Swagger UI ─────────────────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Yumzy API Docs",
  customfavIcon:   "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true, // keeps JWT after page refresh
    displayRequestDuration: true,
    docExpansion: "list",
    filter: true,
    showExtensions: true,
  },
  customCss: `
    .swagger-ui .topbar { background: #1a3d1a; }
    .swagger-ui .topbar .link { color: #fff; }
    .swagger-ui .info h2 { color: #1a3d1a; }
  `,
}));

// Raw Swagger JSON (for Postman import etc.)
app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/restaurants", restRoutes);
app.use("/api",             apiRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.status(200).json({ success: true, message: "Yumzy API is running 🍜", version: "1.0.0" })
);

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
