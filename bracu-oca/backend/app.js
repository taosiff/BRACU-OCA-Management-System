const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { checkDbHealth } = require("./config/dbConfig");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const sanitizeInputs = require("./middlewares/sanitize");

// Routers (MVC)
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const clubRoutes = require("./routes/club.routes");
const messageRoutes = require("./routes/message.routes");
const announcementRoutes = require("./routes/announcement.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();
app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, health checks) and configured origins
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production" && allowedOrigins.length === 0) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(sanitizeInputs);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

app.use(apiLimiter);
app.use("/auth", authLimiter);

app.get("/", (req, res) => {
  res.json({ name: "BRACU OCA Backend", status: "running" });
});

app.get("/health", async (req, res) => {
  const dbOk = await checkDbHealth();
  if (!dbOk) {
    return res.status(503).json({ status: "degraded", db: "disconnected" });
  }
  return res.status(200).json({ status: "ok", db: "connected" });
});

// Mount routers
app.use(authRoutes);
app.use(eventRoutes);
app.use(clubRoutes);
app.use(messageRoutes);
app.use(announcementRoutes);
app.use(dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
