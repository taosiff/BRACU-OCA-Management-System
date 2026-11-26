const clubCollection = require("../models/club.model");
const eventsCollection = require("../models/event.model");
const userCollection = require("../models/user.model");

const getDashboardInfo = async (email) => {
  const club = await clubCollection.findOne({ email });
  if (club) return club;
  return await userCollection.findOne(
    { email },
    { projection: { passwordHash: 0 } }
  );
};

const getUpcomingEvents = async () => {
  return await eventsCollection
    .find({ response: "Accepted" })
    .sort({ date: 1 })
    .toArray();
};

module.exports = {
  getDashboardInfo,
  getUpcomingEvents,
};
