const eventService = require("../services/event.service");

const createEvent = async (req, res, next) => {
  try {
    const newEvent = await eventService.createEvent(req.body || {}, req.decoded);
    if (newEvent.acknowledged) {
      res.status(201).json({ message: "Event created successfully", insertedId: newEvent.insertedId });
    } else {
      res.status(400).json({ message: "Event creation failed" });
    }
  } catch (error) {
    next(error);
  }
};

const getPendingEvents = async (req, res, next) => {
  try {
    const events = await eventService.getPendingEvents(req.params.email);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getAllPendingEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllPendingEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getRespondedEvents = async (req, res, next) => {
  try {
    const events = await eventService.getRespondedEvents(req.params.email);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getAcceptedEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAcceptedEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const result = await eventService.updateEvent(req.params.id, req.body || {});
    if (result.matchedCount === 1) {
      res.status(200).json({ message: "Event updated successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.eventId, req.decoded);
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    next(error);
  }
};

const getTotalBudget = async (req, res, next) => {
  try {
    const totalBudget = await eventService.getTotalBudget();
    res.json({ totalBudget });
  } catch (error) {
    next(error);
  }
};

const checkRoomAvailability = async (req, res, next) => {
  try {
    const { date, roomNumber } = req.body || {};
    if (!date || !roomNumber) {
      return res.status(400).json({ message: "date and roomNumber are required" });
    }
    const isAvailable = await eventService.checkRoomAvailability(date, roomNumber);
    res.status(200).json({ available: isAvailable });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getPendingEvents,
  getAllPendingEvents,
  getRespondedEvents,
  getAcceptedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getTotalBudget,
  checkRoomAvailability,
  getAllEvents,
};
