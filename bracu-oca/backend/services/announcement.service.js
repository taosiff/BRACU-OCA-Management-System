const announcementCollection = require("../models/announcement.model");
const { AppError, parseObjectId, sanitizeString } = require("../utils/validation");

const getAnnouncements = async () => {
  return await announcementCollection.find().sort({ date: -1 }).toArray();
};

const addAnnouncement = async (data, requester) => {
  const title = sanitizeString(data.title, 200);
  const description = sanitizeString(data.description, 4000);
  if (!title || !description) {
    throw new AppError(400, "Title and description are required");
  }

  const doc = {
    title,
    description,
    date: new Date(),
    posterEmail: requester.email,
    posterName: requester.name || requester.email,
  };
  return await announcementCollection.insertOne(doc);
};

const deleteAnnouncement = async (id, requester) => {
  const objectId = parseObjectId(id, "announcement ID");
  const existing = await announcementCollection.findOne({ _id: objectId });
  if (!existing) {
    throw new AppError(404, "Announcement not found");
  }
  if (requester.role !== "oca" && existing.posterEmail !== requester.email) {
    throw new AppError(403, "Forbidden: You can only delete your own announcements");
  }
  return await announcementCollection.findOneAndDelete({ _id: objectId });
};

module.exports = {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
};
