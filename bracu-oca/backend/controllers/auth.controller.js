const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/user.model");
const { getJwtSecret } = require("../middlewares/verifyToken");
const { isValidEmail, sanitizeString } = require("../utils/validation");

const login = async (req, res, next) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role, name: user.name },
      getJwtSecret(),
      { expiresIn: "7d" }
    );
    res.json({ token, email: user.email, role: user.role, name: user.name });
  } catch (err) {
    next(err);
  }
};

const registerVisitor = async (req, res, next) => {
  try {
    const name = sanitizeString(req.body?.name, 100);
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const studentId = sanitizeString(req.body?.studentId, 30);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({
      name,
      email,
      studentId,
      role: "visitor",
      passwordHash,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { email, role: "visitor", name },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, email, role: "visitor", name });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const email = req.decoded?.email;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash || "");
    if (!ok) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ email }, { $set: { passwordHash: newHash, updatedAt: new Date() } });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({
    email: req.decoded.email,
    role: req.decoded.role,
    name: req.decoded.name,
  });
};

module.exports = { login, registerVisitor, changePassword, getMe };
