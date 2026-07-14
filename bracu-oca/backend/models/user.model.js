const dbConnect = require("../config/dbConfig");

const usersCollection = dbConnect.db("BRACU_OCA").collection("users");

module.exports = usersCollection;


