const express = require("express");
const eventsController = require("../controllers/event.controller");
const { verifyToken, requireRole, requireSelfOrOca } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/new-event", verifyToken, requireRole("oca", "club"), eventsController.createEvent);
router.get("/pending-events/:email", verifyToken, requireSelfOrOca("email"), eventsController.getPendingEvents);
router.get("/all-pending-events", verifyToken, requireRole("oca"), eventsController.getAllPendingEvents);
router.get("/responded-events/:email", verifyToken, requireSelfOrOca("email"), eventsController.getRespondedEvents);
router.get("/accepted-events", verifyToken, eventsController.getAcceptedEvents);
router.get("/events/:id", verifyToken, eventsController.getEventById);
router.put("/events/:id", verifyToken, requireRole("oca"), eventsController.updateEvent);
router.delete("/event-planner/:eventId", verifyToken, eventsController.deleteEvent);
router.get("/total-budget", verifyToken, eventsController.getTotalBudget);
router.get("/all-events", verifyToken, eventsController.getAllEvents);
router.post("/check-room-availability", verifyToken, eventsController.checkRoomAvailability);

module.exports = router;
