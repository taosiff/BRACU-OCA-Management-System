const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const dbConnect = require("./config/dbConfig");
const { checkDbHealth, ensureIndexes } = require("./config/dbConfig");
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
      // Allow same-origin / non-browser requests and configured origins
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production" && allowedOrigins.length === 0) {
        return callback(null, true);
      }
      // In Vercel single-domain deployment, same-origin requests may have no CORS issues,
      // and if CORS_ORIGIN is not set in production, allow same-host Vercel previews
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(sanitizeInputs);

// Ensure MongoDB connection is established in serverless environments (e.g., Vercel)
let dbInitPromise = null;
app.use(async (_req, _res, next) => {
  try {
    if (!dbInitPromise) {
      dbInitPromise = (async () => {
        await dbConnect.connect();
        await ensureIndexes();
      })().catch((err) => {
        dbInitPromise = null;
        throw err;
      });
    }
    await dbInitPromise;
    next();
  } catch (err) {
    next(err);
  }
});

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
app.use(["/auth", "/api/auth"], authLimiter);

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.json({ name: "BRACU OCA Backend", status: "running" });
});

apiRouter.get("/health", async (req, res) => {
  const dbOk = await checkDbHealth();
  if (!dbOk) {
    return res.status(503).json({ status: "degraded", db: "disconnected" });
  }
  return res.status(200).json({ status: "ok", db: "connected" });
});

apiRouter.use(authRoutes);
apiRouter.use(eventRoutes);
apiRouter.use(clubRoutes);
apiRouter.use(messageRoutes);
apiRouter.use(announcementRoutes);
apiRouter.use(dashboardRoutes);

// Mount at both /api (Vercel Services rewrite) and / (local dev / direct)
app.use("/api", apiRouter);
app.use("/", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
