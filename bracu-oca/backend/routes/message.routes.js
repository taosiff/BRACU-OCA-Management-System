const express = require("express");
const messagesController = require("../controllers/message.controller");

const router = express.Router();

router.get("/messages/:email", messagesController.getMessages);
router.post("/send-message", messagesController.sendMessage);

module.exports = router;


