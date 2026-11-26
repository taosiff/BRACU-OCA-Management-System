const clubService = require("../services/club.service");

const getClubList = async (req, res, next) => {
  try {
    const clubs = await clubService.getClubList();
    res.json(clubs);
  } catch (error) {
    next(error);
  }
};

const getAllClubs = async (req, res, next) => {
  try {
    const clubs = await clubService.getAllClubs();
    res.json(clubs);
  } catch (error) {
    next(error);
  }
};

const updateClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedClub = await clubService.updateClub(id, req.body || {}, req.decoded);
    res.status(200).json(updatedClub);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await clubService.getCurrentUser(email);
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClubList,
  getAllClubs,
  updateClub,
  getCurrentUser,
};
