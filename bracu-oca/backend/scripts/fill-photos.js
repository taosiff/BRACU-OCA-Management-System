const dbClient = require("../config/dbConfig");

// Default image paths served by the frontend (public/images/...)
const DEFAULTS = {
  clubPhoto: "/images/clubs/photography.png",
  advisorPhoto: "/images/advisors/1.jpg",
  panelPhoto: "/images/panel/1.jpg",
  alumniPhoto: "/images/alumni/1.jpg",
  memberPhoto: "/images/members/1.jpg",
};

function withDefault(str, fallback) {
  if (typeof str !== "string") return fallback;
  const trimmed = str.trim();
  if (trimmed.length === 0) return fallback;
  return str;
}

async function ensureClubPhotos(db) {
  const clubs = db.collection("clubs");

  const cursor = clubs.find({});
  while (await cursor.hasNext()) {
    const club = await cursor.next();

    const updated = { ...club };

    // Club main photo
    updated.photo_url = withDefault(club.photo_url, DEFAULTS.clubPhoto);

    // Advisors array
    if (Array.isArray(club.advisors)) {
      updated.advisors = club.advisors.map((a) => ({
        ...a,
        photo: withDefault(a && a.photo, DEFAULTS.advisorPhoto),
      }));
    }

    // Panel array
    if (Array.isArray(club.panel)) {
      updated.panel = club.panel.map((p) => ({
        ...p,
        photo: withDefault(p && p.photo, DEFAULTS.panelPhoto),
      }));
    }

    // Notable alumni array
    if (Array.isArray(club.notableAlumnis)) {
      updated.notableAlumnis = club.notableAlumnis.map((al) => ({
        ...al,
        photo: withDefault(al && al.photo, DEFAULTS.alumniPhoto),
      }));
    }

    // Generic members array (if present in schema)
    if (Array.isArray(club.members)) {
      updated.members = club.members.map((m) => ({
        ...m,
        photo: withDefault(m && m.photo, DEFAULTS.memberPhoto),
      }));
    }

    // Only write back if anything changed
    const needUpdate = JSON.stringify(updated) !== JSON.stringify(club);
    if (needUpdate) {
      await clubs.updateOne({ _id: club._id }, { $set: {
        photo_url: updated.photo_url,
        advisors: updated.advisors,
        panel: updated.panel,
        notableAlumnis: updated.notableAlumnis,
        members: updated.members,
      }});
    }
  }
}

async function run() {
  try {
    await dbClient.connect();
    const db = dbClient.db("BRACU_OCA");
    console.log("Connected. Filling missing photo placeholders...");

    await ensureClubPhotos(db);

    console.log("Done. All missing photo placeholders filled (where applicable).");
  } catch (err) {
    console.error("Error while filling photos:", err);
    process.exitCode = 1;
  } finally {
    await dbClient.close();
  }
}

run();


