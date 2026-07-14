/*
 Adds or updates two clubs with images and people arrays.
 - Photography Club (updates existing if present)
 - Robotics Club (creates if not present)
 Uses local images placed under frontend/public/images.
*/

const dbClient = require("../config/dbConfig");
require("dotenv").config();

async function upsertClub(collection, match, clubData) {
  await collection.updateOne(match, { $set: clubData }, { upsert: true });
}

async function run() {
  try {
    await dbClient.connect();
    console.log("Connected to MongoDB for club insert");

    const db = dbClient.db("BRACU_OCA");
    const clubs = db.collection("clubs");

    const commonAdvisors = [
      { name: "Fardin Zubair Nafis", photo: "/images/advisors/1.jpg", role: "Advisor" },
      { name: "Messi", photo: "/images/advisors/1.jpg", role: "Advisor" },
    ];

    const barcelonaPanel = [
      { name: "Lionel Messi", photo: "/images/members/1.jpg", role: "Captain" },
      { name: "Xavi Hernandez", photo: "/images/members/1.jpg", role: "Midfielder" },
      { name: "Andres Iniesta", photo: "/images/members/1.jpg", role: "Midfielder" },
      { name: "Sergio Busquets", photo: "/images/members/1.jpg", role: "Midfielder" },
      { name: "Gerard Pique", photo: "/images/members/1.jpg", role: "Defender" },
      { name: "Dani Alves", photo: "/images/members/1.jpg", role: "Defender" },
      { name: "Jordi Alba", photo: "/images/members/1.jpg", role: "Defender" },
      { name: "Luis Suarez", photo: "/images/members/1.jpg", role: "Forward" },
      { name: "Neymar Jr", photo: "/images/members/1.jpg", role: "Forward" },
      { name: "Marc-Andre ter Stegen", photo: "/images/members/1.jpg", role: "Goalkeeper" },
    ];

    const commonAlumni = [
      { name: "Fardin Zubair Nafis", photo: "/images/alumni/1.jpg", role: "Alumni" },
      { name: "Messi", photo: "/images/alumni/1.jpg", role: "Alumni" },
    ];

    // Photography Club (update existing)
    await upsertClub(
      clubs,
      { email: "club1@bracu.ac.bd" },
      {
        name: "Photography Club",
        fullName: "BRACU Photography Club",
        email: "club1@bracu.ac.bd",
        role: "club",
        description: "Capturing moments on campus",
        photo_url: "/images/clubs/photography.png",
        advisors: commonAdvisors,
        panel: barcelonaPanel,
        notableAlumnis: commonAlumni,
        totalMembers: 25,
      }
    );

    // Robotics Club (create or update)
    await upsertClub(
      clubs,
      { email: "robotics@bracu.ac.bd" },
      {
        name: "Robotics Club",
        fullName: "BRACU Robotics Club",
        email: "robotics@bracu.ac.bd",
        role: "club",
        description: "Building and programming robots for competitions and innovation.",
        photo_url: "/images/clubs/robotics.png",
        advisors: commonAdvisors,
        panel: barcelonaPanel,
        notableAlumnis: commonAlumni,
        totalMembers: 30,
      }
    );

    console.log("Club upserts complete");
  } catch (err) {
    console.error("Error during club inserts:", err);
    process.exitCode = 1;
  } finally {
    await dbClient.close();
  }
}

run();

