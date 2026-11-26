const messageService = require("../services/message.service");

const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(req.params.email);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const result = await messageService.sendMessage(req.body || {}, req.decoded);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
