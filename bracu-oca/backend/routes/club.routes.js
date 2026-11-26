const express = require("express");
const clubsController = require("../controllers/club.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

// Public list for login dropdown (only non-sensitive fields: name, email, photo_url)
router.get("/club-list", clubsController.getClubList);

// Protected club routes
router.get("/all-clubs", verifyToken, clubsController.getAllClubs);
router.patch("/clubs-update/:id", verifyToken, clubsController.updateClub);
router.get("/current-user/:email", verifyToken, clubsController.getCurrentUser);

module.exports = router;
