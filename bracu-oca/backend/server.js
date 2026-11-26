const app = require("./app");
const dbConnect = require("./config/dbConfig");
const { ensureIndexes } = require("./config/dbConfig");
const { getJwtSecret } = require("./middlewares/verifyToken");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    if (process.env.NODE_ENV === "production") {
      if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is required in production");
      }
      getJwtSecret();
    }

    await dbConnect.connect();
    console.log("Connected to MongoDB");

    await ensureIndexes();
    console.log("MongoDB indexes ensured");

    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await dbConnect.close();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
