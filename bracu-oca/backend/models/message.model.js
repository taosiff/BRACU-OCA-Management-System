const { getDb } = require("../config/dbConfig");

module.exports = getDb().collection("messages");
