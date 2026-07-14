const express = require("express");
const eventsController = require("../controllers/event.controller");

const router = express.Router();

router.post("/new-event", eventsController.createEvent);
router.get("/pending-events/:email", eventsController.getPendingEvents);
router.get("/all-pending-events", eventsController.getAllPendingEvents);
router.get("/responded-events/:email", eventsController.getRespondedEvents);
router.get("/accepted-events", eventsController.getAcceptedEvents);
router.get("/events/:id", eventsController.getEventById);
router.put("/events/:id", eventsController.updateEvent);
router.delete("/event-planner/:eventId", eventsController.deleteEvent);
router.get("/total-budget", eventsController.getTotalBudget);
router.get("/all-events", eventsController.getAllEvents);
router.post("/check-room-availability", eventsController.checkRoomAvailability);

module.exports = router;


