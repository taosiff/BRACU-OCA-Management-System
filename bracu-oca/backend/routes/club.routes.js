const express = require("express");
const clubsController = require("../controllers/club.controller");

const router = express.Router();

router.get("/club-list", clubsController.getClubList);
router.get("/all-clubs", clubsController.getAllClubs);
router.patch("/clubs-update/:id", clubsController.updateClub);
router.get("/current-user/:email", clubsController.getCurrentUser);

module.exports = router;


