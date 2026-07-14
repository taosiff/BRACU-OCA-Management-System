const express = require("express");
const announcementsController = require("../controllers/announcement.controller");

const router = express.Router();

router.get("/announcements", announcementsController.getAnnouncements);
router.post("/add-announcement", announcementsController.addAnnouncement);
router.delete("/delete-announcement/:id", announcementsController.deleteAnnouncement);

module.exports = router;


