const express = require("express");
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.registerVisitor);
router.post("/auth/change-password", verifyToken, authController.changePassword);
router.get("/auth/me", verifyToken, authController.getMe);

module.exports = router;
