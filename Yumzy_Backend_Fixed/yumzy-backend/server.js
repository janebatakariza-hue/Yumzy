require("dotenv").config();
const app       = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("");
    console.log("╔══════════════════════════════════════════════╗");
    console.log("║     🍜  Yumzy Backend is running!            ║");
    console.log(`║     🚀  http://localhost:${PORT}                  ║`);
    console.log(`║     📚  http://localhost:${PORT}/api/docs         ║`);
    console.log(`║     💚  http://localhost:${PORT}/overview           ║`);
    console.log("╚══════════════════════════════════════════════╝");
    console.log("");
  });
};

start().catch((err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
