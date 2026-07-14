/*
 Migrates data from a source MongoDB to destination MongoDB (default: local).
 - Env: MONGODB_SOURCE_URI (required), MONGODB_DEST_URI (default local), MONGODB_DB_NAME (default BRACU_OCA)
 - Collections: clubs, events, messages, announcements
*/

const { MongoClient } = require("mongodb");
require("dotenv").config();

const sourceUri = process.env.MONGODB_SOURCE_URI;
const destUri = process.env.MONGODB_DEST_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME || "BRACU_OCA";

if (!sourceUri) {
  console.error("MONGODB_SOURCE_URI is required. Set it and rerun.");
  process.exit(1);
}

async function migrateCollection(sourceDb, destDb, collectionName) {
  const source = sourceDb.collection(collectionName);
  const dest = destDb.collection(collectionName);
  const cursor = source.find({});

  let migratedCount = 0;
  const operations = [];

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    operations.push({
      replaceOne: {
        filter: { _id: doc._id },
        replacement: doc,
        upsert: true,
      },
    });

    if (operations.length >= 1000) {
      const res = await dest.bulkWrite(operations, { ordered: false });
      migratedCount += res.upsertedCount + res.modifiedCount;
      operations.length = 0;
    }
  }

  if (operations.length > 0) {
    const res = await dest.bulkWrite(operations, { ordered: false });
    migratedCount += res.upsertedCount + res.modifiedCount;
  }

  console.log(`Migrated ${migratedCount} documents for ${collectionName}`);
}

async function run() {
  const sourceClient = new MongoClient(sourceUri);
  const destClient = new MongoClient(destUri);

  try {
    await sourceClient.connect();
    await destClient.connect();
    console.log("Connected to both source and destination MongoDB");

    const sourceDb = sourceClient.db(dbName);
    const destDb = destClient.db(dbName);

    const collections = ["clubs", "events", "messages", "announcements"];
    for (const name of collections) {
      await migrateCollection(sourceDb, destDb, name);
    }

    console.log("Migration complete");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await sourceClient.close();
    await destClient.close();
  }
}

run();


