const { AppError } = require("../utils/validation");

const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    console.error("Unhandled error:", err);
  } else {
    console.error("Unhandled error:", err.message);
  }

  return res.status(500).json({
    message: isProd ? "Internal server error" : err.message || "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
