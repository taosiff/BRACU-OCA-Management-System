const { ObjectId } = require("mongodb");

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function parseObjectId(id, label = "ID") {
  if (!id || !ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${label}`);
  }
  return new ObjectId(id);
}

function sanitizeString(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

module.exports = {
  AppError,
  parseObjectId,
  sanitizeString,
  isValidEmail,
};
