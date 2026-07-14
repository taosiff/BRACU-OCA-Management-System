/*
 Seeds minimal data into the local MongoDB instance for BRACU_OCA.
 - Database: BRACU_OCA
 - Collections: clubs, announcements, events
*/

const dbClient = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function upsertClub(collection, club) {
  await collection.updateOne(
    { email: club.email },
    { $set: club },
    { upsert: true }
  );
}

async function run() {
  try {
    await dbClient.connect();
    console.log("Connected to MongoDB for seeding");

    const db = dbClient.db("BRACU_OCA");
    const clubs = db.collection("clubs");
    const users = db.collection("users");
    const announcements = db.collection("announcements");
    const events = db.collection("events");

    // Seed clubs (OCA + a sample Club)
    await upsertClub(clubs, {
      name: "OCA",
      email: "oca@bracu.ac.bd",
      role: "oca",
      description: "Office of Co-curricular Activities",
      photo_url: "",
    });

    await upsertClub(clubs, {
      name: "Photography Club",
      email: "club1@bracu.ac.bd",
      role: "club",
      description: "Capturing moments on campus",
      photo_url: "",
    });

    // Seed users with password hashes
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    await users.updateOne(
      { email: "oca@bracu.ac.bd" },
      { $set: { email: "oca@bracu.ac.bd", role: "oca", name: "OCA Admin", passwordHash: adminPasswordHash } },
      { upsert: true }
    );

    const clubPasswordHash = await bcrypt.hash("club123", 10);
    await users.updateOne(
      { email: "club1@bracu.ac.bd" },
      { $set: { email: "club1@bracu.ac.bd", role: "club", name: "Photography Club", passwordHash: clubPasswordHash } },
      { upsert: true }
    );

    // Seed multiple announcements
    const baseAnnouncements = [
      {
        title: "Welcome to BRACU OCA",
        description: "This is a sample announcement. You can add or delete announcements from the dashboard.",
        date: new Date(),
        posterEmail: "oca@bracu.ac.bd",
      },
      {
        title: "Photography Workshop Registration Open",
        description: "Join our beginner workshop next week.",
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        posterEmail: "club1@bracu.ac.bd",
      }
    ];
    for (const ann of baseAnnouncements) {
      const exists = await announcements.findOne({ title: ann.title });
      if (!exists) {
        await announcements.insertOne(ann);
      }
    }

    // Seed sample events
    const existingAccepted = await events.findOne({ title: "Club Orientation" });
    if (!existingAccepted) {
      await events.insertOne({
        title: "Club Orientation",
        clubMail: "club1@bracu.ac.bd",
        status: "Responded",
        response: "Accepted",
        date: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        budget: 5000,
        roomNumber: "101",
      });
    }

    const existingPending = await events.findOne({ title: "Photography Workshop" });
    if (!existingPending) {
      await events.insertOne({
        title: "Photography Workshop",
        clubMail: "club1@bracu.ac.bd",
        status: "Pending",
        date: new Date(Date.now() + 14 * 24 * 3600 * 1000),
        budget: 8000,
        roomNumber: "202",
      });
    }

    console.log("Seeding complete");
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exitCode = 1;
  } finally {
    await dbClient.close();
  }
}

run();


