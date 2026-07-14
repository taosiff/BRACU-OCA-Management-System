const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/dashboard-info/:email", dashboardController.getDashboardInfo);
router.get("/dashboard-events", dashboardController.getUpcomingEvents);

module.exports = router;


