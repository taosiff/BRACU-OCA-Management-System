const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Auth Routes
router.post("/auth/login", authController.login);
router.post("/auth/change-password", authController.changePassword);

module.exports = router;


