const announcementsService = require("../services/announcement.service");

const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await announcementsService.getAnnouncements();
    res.status(200).json(announcements);
  } catch (error) {
    next(error);
  }
};

const addAnnouncement = async (req, res, next) => {
  try {
    const announcement = await announcementsService.addAnnouncement(req.body || {}, req.decoded);
    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    await announcementsService.deleteAnnouncement(req.params.id, req.decoded);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
};
