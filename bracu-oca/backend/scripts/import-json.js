/*
 Import JSON exports (from MongoDB Compass) into the local BRACU_OCA database.
 - Place files in ./dump/: clubs.json, events.json, messages.json, announcements.json
 - Supports JSON array or JSON Lines. Handles _id.$oid and date.$date.
 - Env: MONGODB_DEST_URI (default mongodb://127.0.0.1:27017), MONGODB_DB_NAME (default BRACU_OCA)
*/

const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const destUri = process.env.MONGODB_DEST_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME || "BRACU_OCA";
const dumpDir = path.resolve(__dirname, "../dump");

function ensureObjectId(value) {
  if (value && typeof value === "object" && value.$oid) {
    return new ObjectId(value.$oid);
  }
  return value;
}

function ensureDate(value) {
  if (value && typeof value === "object" && value.$date) {
    return new Date(value.$date);
  }
  return value;
}

function normalizeDocument(doc) {
  if (doc._id) doc._id = ensureObjectId(doc._id);
  if (doc.date) doc.date = ensureDate(doc.date);
  return doc;
}

function readJsonDocuments(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (text.length === 0) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(normalizeDocument);
    // Some tools export as an object with { documents: [...] }
    if (parsed && Array.isArray(parsed.documents)) return parsed.documents.map(normalizeDocument);
    // Single document fallback
    return [normalizeDocument(parsed)];
  } catch (e) {
    // Try JSON Lines format
    const lines = text.split(/\r?\n/).filter(Boolean);
    const docs = lines.map((line) => normalizeDocument(JSON.parse(line)));
    return docs;
  }
}

async function importCollection(db, collectionName, fileName) {
  const filePath = path.join(dumpDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`Skip ${collectionName}: ${fileName} not found`);
    return;
  }
  const docs = readJsonDocuments(filePath);
  if (docs.length === 0) {
    console.log(`Skip ${collectionName}: no documents in ${fileName}`);
    return;
  }
  const collection = db.collection(collectionName);
  const operations = docs.map((doc) => ({
    replaceOne: {
      filter: { _id: doc._id ?? new ObjectId() },
      replacement: doc,
      upsert: true,
    },
  }));
  const res = await collection.bulkWrite(operations, { ordered: false });
  const count = (res.upsertedCount || 0) + (res.modifiedCount || 0);
  console.log(`Imported ${count} docs into ${collectionName}`);
}

async function run() {
  if (!fs.existsSync(dumpDir)) {
    console.error(`Dump directory not found: ${dumpDir}`);
    process.exit(1);
  }

  const client = new MongoClient(destUri);
  try {
    await client.connect();
    console.log(`Connected to ${destUri}`);
    const db = client.db(dbName);

    await importCollection(db, "clubs", "clubs.json");
    await importCollection(db, "events", "events.json");
    await importCollection(db, "messages", "messages.json");
    await importCollection(db, "announcements", "announcements.json");

    console.log("Import complete");
  } catch (err) {
    console.error("Import failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();


