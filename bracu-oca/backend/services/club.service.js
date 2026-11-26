const clubCollection = require("../models/club.model");
const userCollection = require("../models/user.model");
const { AppError, parseObjectId, sanitizeString } = require("../utils/validation");

const getClubList = async () => {
  return await clubCollection
    .find({}, { projection: { name: 1, email: 1, _id: 1, photo_url: 1 } })
    .sort({ name: 1 })
    .toArray();
};

const getAllClubs = async () => {
  return await clubCollection.find({}).sort({ name: 1 }).toArray();
};

const sanitizePersonList = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      name: sanitizeString(item.name, 120),
      role: sanitizeString(item.role, 120),
      email: sanitizeString(item.email || item.advisorEmail, 160),
      photo: sanitizeString(item.photo, 500),
      currentPosition: sanitizeString(item.currentPosition, 200),
    }));
};

const updateClub = async (id, data, requester) => {
  const objectId = parseObjectId(id, "club ID");
  const existing = await clubCollection.findOne({ _id: objectId });
  if (!existing) {
    throw new AppError(404, "Club not found");
  }

  if (requester.role !== "oca" && existing.email !== requester.email) {
    throw new AppError(403, "Forbidden: You can only update your own club profile");
  }

  const updateFields = { updatedAt: new Date() };
  if (typeof data.name === "string" && data.name.trim()) {
    updateFields.name = sanitizeString(data.name, 120);
  }
  if (typeof data.fullName === "string") {
    updateFields.fullName = sanitizeString(data.fullName, 200);
  }
  if (typeof data.description === "string") {
    updateFields.description = sanitizeString(data.description, 3000);
  }
  if (typeof data.photo_url === "string") {
    updateFields.photo_url = sanitizeString(data.photo_url, 500);
  }
  if (data.totalMembers !== undefined) {
    const members = Number(data.totalMembers);
    updateFields.totalMembers = Number.isFinite(members) && members >= 0 ? Math.floor(members) : 0;
  }
  if (Array.isArray(data.advisors)) {
    updateFields.advisors = sanitizePersonList(data.advisors);
  }
  if (Array.isArray(data.panel)) {
    updateFields.panel = sanitizePersonList(data.panel);
  }
  if (Array.isArray(data.notableAlumnis)) {
    updateFields.notableAlumnis = sanitizePersonList(data.notableAlumnis);
  }

  const result = await clubCollection.findOneAndUpdate(
    { _id: objectId },
    { $set: updateFields },
    { returnDocument: "after" }
  );
  return result;
};

const getCurrentUser = async (email) => {
  const cleanEmail = sanitizeString(email, 160).toLowerCase();
  const club = await clubCollection.findOne({ email: cleanEmail });
  if (club) return club;
  return await userCollection.findOne(
    { email: cleanEmail },
    { projection: { passwordHash: 0 } }
  );
};

module.exports = {
  getClubList,
  getAllClubs,
  updateClub,
  getCurrentUser,
};
