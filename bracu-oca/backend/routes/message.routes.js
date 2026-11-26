const express = require("express");
const messagesController = require("../controllers/message.controller");
const { verifyToken, requireRole, requireSelfOrOca } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/messages/:email", verifyToken, requireSelfOrOca("email"), messagesController.getMessages);
router.post("/send-message", verifyToken, requireRole("oca", "club"), messagesController.sendMessage);

module.exports = router;
