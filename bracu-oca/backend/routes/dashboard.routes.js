const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { verifyToken, requireSelfOrOca } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/dashboard-info/:email", verifyToken, requireSelfOrOca("email"), dashboardController.getDashboardInfo);
router.get("/dashboard-events", verifyToken, dashboardController.getUpcomingEvents);

module.exports = router;
