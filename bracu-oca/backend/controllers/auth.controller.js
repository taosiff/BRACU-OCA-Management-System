const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/user.model");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_Secret || "devsecret", { expiresIn: "7d" });
    res.json({ token, email: user.email, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "email, currentPassword, newPassword are required" });
    }
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash || "");
    if (!ok) return res.status(401).json({ message: "Current password incorrect" });
    const newHash = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ email }, { $set: { passwordHash: newHash } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login, changePassword };


