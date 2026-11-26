const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "BRACU_OCA";

const dbConnect = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 10000,
});

function getDb() {
  return dbConnect.db(dbName);
}

async function checkDbHealth() {
  try {
    await getDb().command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

async function ensureIndexes() {
  const db = getDb();
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("clubs").createIndex({ email: 1 }, { unique: true }),
    db.collection("events").createIndex({ clubMail: 1, status: 1 }),
    db.collection("events").createIndex({ status: 1, response: 1, date: 1 }),
    db.collection("events").createIndex({ date: 1, roomNumber: 1 }),
    db.collection("announcements").createIndex({ date: -1 }),
    db.collection("messages").createIndex({ senderEmail: 1, receiverEmail: 1, createdAt: 1 }),
  ]);
}

module.exports = dbConnect;
module.exports.getDb = getDb;
module.exports.checkDbHealth = checkDbHealth;
module.exports.ensureIndexes = ensureIndexes;
