const express = require("express");
const announcementsController = require("../controllers/announcement.controller");
const { verifyToken, requireRole } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/announcements", verifyToken, announcementsController.getAnnouncements);
router.post("/add-announcement", verifyToken, requireRole("oca", "club"), announcementsController.addAnnouncement);
router.delete("/delete-announcement/:id", verifyToken, requireRole("oca", "club"), announcementsController.deleteAnnouncement);

module.exports = router;
