const messageCollection = require("../models/message.model");
const { AppError, isValidEmail, sanitizeString } = require("../utils/validation");

const getMessages = async (clubMail) => {
  const email = sanitizeString(clubMail, 160).toLowerCase();
  return await messageCollection
    .find({
      $or: [
        { receiverEmail: email, senderEmail: "oca@bracu.ac.bd" },
        { senderEmail: email, receiverEmail: "oca@bracu.ac.bd" },
      ],
    })
    .sort({ createdAt: 1, date: 1, time: 1 })
    .toArray();
};

const sendMessage = async (messageInfo, requester) => {
  const content = sanitizeString(messageInfo.content, 2000);
  if (!content) {
    throw new AppError(400, "Message content cannot be empty");
  }

  const receiverEmail =
    requester.role === "oca"
      ? sanitizeString(messageInfo.receiverEmail, 160).toLowerCase()
      : "oca@bracu.ac.bd";

  if (!isValidEmail(receiverEmail)) {
    throw new AppError(400, "Valid receiverEmail is required");
  }

  const now = new Date();
  const doc = {
    senderEmail: requester.email,
    receiverEmail,
    content,
    date: sanitizeString(messageInfo.date, 30) || now.toISOString().split("T")[0],
    time:
      sanitizeString(messageInfo.time, 30) ||
      now.toLocaleTimeString("en-US", { hour12: true }),
    createdAt: now,
  };

  return await messageCollection.insertOne(doc);
};

module.exports = {
  getMessages,
  sendMessage,
};
