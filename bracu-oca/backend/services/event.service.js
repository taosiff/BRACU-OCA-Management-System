const eventsCollection = require("../models/event.model");
const { AppError, parseObjectId, sanitizeString } = require("../utils/validation");

const checkRoomAvailability = async (date, roomNumber) => {
  const cleanRoom = sanitizeString(String(roomNumber || ""), 50);
  if (!date || !cleanRoom) return true;

  const existing = await eventsCollection.findOne({
    date,
    roomNumber: cleanRoom,
    response: { $ne: "Rejected" },
  });
  return existing === null;
};

const createEvent = async (data, requester) => {
  const title = sanitizeString(data.title, 200);
  if (!title) {
    throw new AppError(400, "Event title is required");
  }
  if (!data.date) {
    throw new AppError(400, "Event date is required");
  }

  const parsedDate = new Date(data.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, "Invalid event date");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsedDate < today) {
    throw new AppError(400, "Event date cannot be in the past");
  }

  const needsRoom = Boolean(data.needsRoom);
  const roomNumber = needsRoom ? sanitizeString(String(data.roomNumber || ""), 50) : "";

  if (needsRoom && !roomNumber) {
    throw new AppError(400, "Room number is required when room is requested");
  }

  if (roomNumber) {
    const available = await checkRoomAvailability(data.date, roomNumber);
    if (!available) {
      throw new AppError(409, "This room is already booked for the selected date");
    }
  }

  const rawBudget = Number(data.budget);
  const budget = data.needsBudget && Number.isFinite(rawBudget) && rawBudget >= 0 ? rawBudget : 0;

  const rawPasses = Number(data.guestPassesCount);
  const guestPassesCount =
    data.needsGuestPasses && Number.isFinite(rawPasses) && rawPasses >= 0 ? Math.floor(rawPasses) : 0;

  const clubMail =
    requester.role === "oca" && data.clubMail
      ? sanitizeString(data.clubMail, 160).toLowerCase()
      : requester.email;

  const eventDoc = {
    title,
    description: sanitizeString(data.description, 3000),
    date: data.date,
    needsRoom,
    roomNumber,
    needsBudget: Boolean(data.needsBudget),
    budget,
    budgetDetails: data.needsBudget ? sanitizeString(data.budgetDetails, 2000) : "",
    needsGuestPasses: Boolean(data.needsGuestPasses),
    guestPassesCount,
    additionalRequirements: sanitizeString(data.additionalRequirements, 2000),
    advisorEmail: sanitizeString(data.advisorEmail, 160),
    clubMail,
    status: "Pending",
    response: "",
    feedback: "",
    requestDate: new Date(),
    createdAt: new Date(),
  };

  return await eventsCollection.insertOne(eventDoc);
};

const getPendingEvents = async (email) => {
  return await eventsCollection
    .find({ clubMail: email, status: "Pending" })
    .sort({ date: -1 })
    .toArray();
};

const getAllPendingEvents = async () => {
  return await eventsCollection
    .find({ status: "Pending" })
    .sort({ date: -1 })
    .toArray();
};

const getRespondedEvents = async (email) => {
  return await eventsCollection
    .find({ clubMail: email, status: "Responded" })
    .sort({ date: -1 })
    .toArray();
};

const getAcceptedEvents = async () => {
  return await eventsCollection
    .find({
      status: "Responded",
      response: "Accepted",
    })
    .sort({ date: 1 })
    .toArray();
};

const getEventById = async (id) => {
  const objectId = parseObjectId(id, "event ID");
  const event = await eventsCollection.findOne({ _id: objectId });
  if (!event) {
    throw new AppError(404, "Event not found");
  }
  return event;
};

const updateEvent = async (id, data) => {
  const objectId = parseObjectId(id, "event ID");
  const existing = await eventsCollection.findOne({ _id: objectId });
  if (!existing) {
    throw new AppError(404, "Event not found");
  }

  const updateFields = { updatedAt: new Date() };
  if (data.status !== undefined) {
    if (!["Pending", "Responded"].includes(data.status)) {
      throw new AppError(400, "Invalid event status");
    }
    updateFields.status = data.status;
  }
  if (data.response !== undefined) {
    if (!["", "Accepted", "Rejected"].includes(data.response)) {
      throw new AppError(400, "Invalid event response");
    }
    updateFields.response = data.response;
  }
  if (data.feedback !== undefined) {
    updateFields.feedback = sanitizeString(data.feedback, 2000);
  }
  if (data.response === "Rejected" && !updateFields.feedback && !existing.feedback) {
    throw new AppError(400, "Feedback is required when rejecting an event");
  }

  return await eventsCollection.updateOne(
    { _id: objectId },
    { $set: updateFields }
  );
};

const deleteEvent = async (id, requester) => {
  const objectId = parseObjectId(id, "event ID");
  const existing = await eventsCollection.findOne({ _id: objectId });
  if (!existing) {
    throw new AppError(404, "Event not found");
  }

  const isOwner = existing.clubMail === requester.email;
  if (requester.role !== "oca" && (!isOwner || existing.status !== "Pending")) {
    throw new AppError(403, "Forbidden: You can only delete your own pending events");
  }

  return await eventsCollection.deleteOne({ _id: objectId });
};

const getTotalBudget = async () => {
  const result = await eventsCollection
    .aggregate([
      { $match: { status: "Responded", response: "Accepted" } },
      { $group: { _id: null, total: { $sum: "$budget" } } },
    ])
    .toArray();

  return result[0]?.total || 0;
};

const getAllEvents = async () => {
  return await eventsCollection.find().sort({ date: -1 }).toArray();
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
