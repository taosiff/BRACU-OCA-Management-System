/*
 * Complete BRAC University OCA Database Seeder
 * - Generates unique SVG logos under frontend/public/images/logos/
 * - Seeds OCA + 26 authentic BRAC University clubs (with advisors, panel, alumni, users)
 * - Seeds realistic events (Accepted, Pending, Rejected), announcements, and messages
 */

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const dbClient = require("../config/dbConfig");
const { getDb, ensureIndexes } = require("../config/dbConfig");
require("dotenv").config();

const LOGOS_DIR = path.resolve(__dirname, "../../frontend/public/images/logos");

const CLUBS = [
  {
    code: "BUCC",
    fullName: "BRAC University Computer Club",
    category: "Academic",
    department: "CSE",
    email: "bucc@bracu.ac.bd",
    color: "#1D4ED8",
    accent: "#60A5FA",
    totalMembers: 420,
    description:
      "Fostering programming culture, hackathons, competitive coding, and software engineering excellence at BRAC University.",
    advisors: [
      { name: "Dr. Md. Ashraful Alam", role: "Faculty Advisor", email: "ashraful@bracu.ac.bd" },
      { name: "Annajiat Alim Rasel", role: "Co-Advisor", email: "annajiat@bracu.ac.bd" },
    ],
  },
  {
    code: "ROBU",
    fullName: "Robotics Club of BRAC University",
    category: "Academic",
    department: "EEE / CSE",
    email: "robu@bracu.ac.bd",
    color: "#0F766E",
    accent: "#2DD4BF",
    totalMembers: 310,
    description:
      "Designing autonomous robots, rovers, drones, and embedded systems for national and international robotics competitions.",
    advisors: [
      { name: "Dr. Md. Khalilur Rhaman", role: "Faculty Advisor", email: "khalilur@bracu.ac.bd" },
      { name: "Raihanul Islam", role: "Co-Advisor", email: "raihanul@bracu.ac.bd" },
    ],
  },
  {
    code: "BUEEC",
    fullName: "BRAC University Electrical and Electronic Club",
    category: "Academic",
    department: "EEE",
    email: "bueec@bracu.ac.bd",
    color: "#0369A1",
    accent: "#38BDF8",
    totalMembers: 245,
    description:
      "Advancing circuit design, power systems, VLSI, and hardware innovation through hands-on workshops and industrial tours.",
    advisors: [
      { name: "Dr. Shahidul Islam Khan", role: "Faculty Advisor", email: "shahidul@bracu.ac.bd" },
    ],
  },
  {
    code: "IEEE",
    fullName: "IEEE BRAC University Student Branch",
    category: "Academic",
    department: "Engineering",
    email: "ieee@bracu.ac.bd",
    color: "#1E40AF",
    accent: "#93C5FD",
    totalMembers: 290,
    description:
      "Connecting BRACU engineering students with IEEE global technical societies, research symposiums, and PES chapters.",
    advisors: [
      { name: "Dr. A. K. M. Abdul Malek Azad", role: "Branch Counselor", email: "azad@bracu.ac.bd" },
    ],
  },
  {
    code: "BIZBEE",
    fullName: "BRAC University Business Club",
    category: "Academic",
    department: "BBS",
    email: "bizbee@bracu.ac.bd",
    color: "#B45309",
    accent: "#FBBF24",
    totalMembers: 380,
    description:
      "Hosting national business case competitions, corporate leadership talks, and career readiness bootcamps.",
    advisors: [
      { name: "Dr. Salehuddin Ahmed", role: "Faculty Advisor", email: "salehuddin@bracu.ac.bd" },
    ],
  },
  {
    code: "BUBeF",
    fullName: "BRAC University Business & Economics Forum",
    category: "Academic",
    department: "BBS / ESS",
    email: "bubef@bracu.ac.bd",
    color: "#9A3412",
    accent: "#FB923C",
    totalMembers: 210,
    description:
      "Bridging economic policy, macroeconomic research, and corporate strategy through seminars and policy dialogues.",
    advisors: [
      { name: "Dr. Wasiqur Rahman Khan", role: "Faculty Advisor", email: "wasiqur@bracu.ac.bd" },
    ],
  },
  {
    code: "BUFIN",
    fullName: "BRAC University Finance and Accounting Club",
    category: "Academic",
    department: "BBS",
    email: "bufin@bracu.ac.bd",
    color: "#065F46",
    accent: "#34D399",
    totalMembers: 195,
    description:
      "Developing financial modeling, equity research, and corporate valuation skills among aspiring finance leaders.",
    advisors: [
      { name: "Dr. Riyashad Ahmed", role: "Faculty Advisor", email: "riyashad@bracu.ac.bd" },
    ],
  },
  {
    code: "BUPS",
    fullName: "BRAC University Pharma Society",
    category: "Academic",
    department: "Pharmacy",
    email: "bups@bracu.ac.bd",
    color: "#047857",
    accent: "#6EE7B7",
    totalMembers: 175,
    description:
      "Promoting pharmaceutical research, public health awareness, and clinical pharmacy outreach.",
    advisors: [
      { name: "Dr. Eva Rahman Kabir", role: "Faculty Advisor", email: "eva@bracu.ac.bd" },
    ],
  },
  {
    code: "BUNSC",
    fullName: "BRAC University Natural Sciences Club",
    category: "Academic",
    department: "MNS",
    email: "bunsc@bracu.ac.bd",
    color: "#15803D",
    accent: "#86EFAC",
    totalMembers: 165,
    description:
      "Exploring physics, biotechnology, microbiology, and environmental sciences through science fairs and lab showcases.",
    advisors: [
      { name: "Dr. Mahboob Hossain", role: "Faculty Advisor", email: "mahboob@bracu.ac.bd" },
    ],
  },
  {
    code: "BULS",
    fullName: "BRAC University Law Society",
    category: "Academic",
    department: "School of Law",
    email: "buls@bracu.ac.bd",
    color: "#4338CA",
    accent: "#818CF8",
    totalMembers: 160,
    description:
      "Cultivating moot court advocacy, legal research, human rights awareness, and constitutional discourse.",
    advisors: [
      { name: "Dr. K. Shamsuddin Mahmood", role: "Faculty Advisor", email: "shamsuddin@bracu.ac.bd" },
    ],
  },
  {
    code: "BUAPS",
    fullName: "BRAC University Art & Photography Society",
    category: "Non-Academic",
    department: "Arts & Media",
    email: "buaps@bracu.ac.bd",
    color: "#BE185D",
    accent: "#F472B6",
    totalMembers: 340,
    description:
      "Capturing campus life and nurturing visual storytelling through annual exhibitions, photowalks, and fine arts.",
    advisors: [
      { name: "Rubaiyat Hossain", role: "Faculty Advisor", email: "rubaiyat@bracu.ac.bd" },
    ],
  },
  {
    code: "BUCuC",
    fullName: "BRAC University Cultural Club",
    category: "Non-Academic",
    department: "Culture",
    email: "bucuc@bracu.ac.bd",
    color: "#7C3AED",
    accent: "#C4B5FD",
    totalMembers: 390,
    description:
      "Celebrating music, dance, and Bangladeshi heritage through flagship concerts, Pahela Baishakh, and The Stage.",
    advisors: [
      { name: "Sharmind Neelotpol", role: "Faculty Advisor", email: "sharmind@bracu.ac.bd" },
    ],
  },
  {
    code: "BUDC",
    fullName: "BRAC University Debating Club",
    category: "Non-Academic",
    department: "Debate",
    email: "budc@bracu.ac.bd",
    color: "#1E293B",
    accent: "#94A3B8",
    totalMembers: 220,
    description:
      "Training parliamentary debaters for national and international tournaments including WUDC and UADC.",
    advisors: [
      { name: "Sabrina Syed", role: "Faculty Advisor", email: "sabrina@bracu.ac.bd" },
    ],
  },
  {
    code: "BUDTF",
    fullName: "BRAC University Drama and Theater Forum",
    category: "Non-Academic",
    department: "Performing Arts",
    email: "budtf@bracu.ac.bd",
    color: "#9F1239",
    accent: "#FB7185",
    totalMembers: 185,
    description:
      "Producing original stage plays, street theater, and dramatic workshops across Dhaka.",
    advisors: [
      { name: "Ruhul Amin", role: "Faculty Advisor", email: "ruhul@bracu.ac.bd" },
    ],
  },
  {
    code: "BUEDF",
    fullName: "BRAC University Entrepreneurship Development Forum",
    category: "Non-Academic",
    department: "Entrepreneurship",
    email: "buedf@bracu.ac.bd",
    color: "#EA580C",
    accent: "#FDBA74",
    totalMembers: 270,
    description:
      "Empowering student founders with startup pitch nights, incubation mentorship, and venture-building workshops.",
    advisors: [
      { name: "Shamim Ehsanul Haque", role: "Faculty Advisor", email: "shamim@bracu.ac.bd" },
    ],
  },
  {
    code: "BUFC",
    fullName: "BRAC University Film Club",
    category: "Non-Academic",
    department: "Cinema & Media",
    email: "bufc@bracu.ac.bd",
    color: "#334155",
    accent: "#64748B",
    totalMembers: 230,
    description:
      "Curating film screenings, short-film festivals, cinematography labs, and directorial critique sessions.",
    advisors: [
      { name: "Din M. Sumon Rahman", role: "Faculty Advisor", email: "sumon@bracu.ac.bd" },
    ],
  },
  {
    code: "BUCSC",
    fullName: "BRAC University Community Service Club",
    category: "Non-Academic",
    department: "Social Welfare",
    email: "bucsc@bracu.ac.bd",
    color: "#0D9488",
    accent: "#5EEAD4",
    totalMembers: 350,
    description:
      "Leading winter clothing drives, blood donation camps, rural literacy programs, and community relief efforts.",
    advisors: [
      { name: "Tahmina Begum", role: "Faculty Advisor", email: "tahmina@bracu.ac.bd" },
    ],
  },
  {
    code: "BUAC",
    fullName: "BRAC University Adventure Club",
    category: "Non-Academic",
    department: "Outdoor & Sports",
    email: "buac@bracu.ac.bd",
    color: "#166534",
    accent: "#4ADE80",
    totalMembers: 280,
    description:
      "Organizing trekking expeditions, camping trips, eco-tourism, and outdoor survival training across Bangladesh.",
    advisors: [
      { name: "Farhanul Islam", role: "Faculty Advisor", email: "farhanul@bracu.ac.bd" },
    ],
  },
  {
    code: "BURT",
    fullName: "BRAC University Response Team",
    category: "Non-Academic",
    department: "Emergency & Relief",
    email: "burt@bracu.ac.bd",
    color: "#DC2626",
    accent: "#FCA5A5",
    totalMembers: 190,
    description:
      "Training student first-responders in disaster preparedness, first aid, and campus safety coordination.",
    advisors: [
      { name: "Md. Tariqul Islam", role: "Faculty Advisor", email: "tariqul@bracu.ac.bd" },
    ],
  },
  {
    code: "BULDF",
    fullName: "BRAC University Leadership Development Forum",
    category: "Non-Academic",
    department: "Leadership",
    email: "buldf@bracu.ac.bd",
    color: "#4F46E5",
    accent: "#A5B4FC",
    totalMembers: 205,
    description:
      "Building ethical leadership, public speaking, and organizational management skills for student changemakers.",
    advisors: [
      { name: "Nadia Rahman", role: "Faculty Advisor", email: "nadia@bracu.ac.bd" },
    ],
  },
  {
    code: "BUCHC",
    fullName: "BRAC University Chess Club",
    category: "Non-Academic",
    department: "Mind Sports",
    email: "buchc@bracu.ac.bd",
    color: "#1F2937",
    accent: "#D1D5DB",
    totalMembers: 140,
    description:
      "Hosting rated blitz and rapid chess tournaments, strategy clinics, and inter-university championships.",
    advisors: [
      { name: "Dr. Syed Hasibul Hasan", role: "Faculty Advisor", email: "hasibul@bracu.ac.bd" },
    ],
  },
  {
    code: "BUCLC",
    fullName: "BRAC University Communication & Language Club",
    category: "Non-Academic",
    department: "Languages",
    email: "buclc@bracu.ac.bd",
    color: "#0284C7",
    accent: "#7DD3FC",
    totalMembers: 215,
    description:
      "Enhancing multilingual fluency, MUN diplomacy, creative writing, and public communication.",
    advisors: [
      { name: "Asifa Sultana", role: "Faculty Advisor", email: "asifa@bracu.ac.bd" },
    ],
  },
  {
    code: "BUReD",
    fullName: "BRAC University Research for Development Club",
    category: "Non-Academic",
    department: "Research",
    email: "bured@bracu.ac.bd",
    color: "#6D28D9",
    accent: "#DDD6FE",
    totalMembers: 155,
    description:
      "Promoting undergraduate interdisciplinary research, SDG policy papers, and academic publication workshops.",
    advisors: [
      { name: "Dr. Seuty Sabur", role: "Faculty Advisor", email: "seuty@bracu.ac.bd" },
    ],
  },
  {
    code: "PCBU",
    fullName: "Peace Café BRAC University",
    category: "Non-Academic",
    department: "Peace & Tolerance",
    email: "pcbu@bracu.ac.bd",
    color: "#059669",
    accent: "#A7F3D0",
    totalMembers: 180,
    description:
      "Fostering social cohesion, youth peacebuilding, inclusivity, and constructive community dialogue.",
    advisors: [
      { name: "Samia Huq", role: "Faculty Advisor", email: "samia@bracu.ac.bd" },
    ],
  },
  {
    code: "BUMC",
    fullName: "BRAC University Multicultural Club",
    category: "Non-Academic",
    department: "Global Culture",
    email: "bumc@bracu.ac.bd",
    color: "#D97706",
    accent: "#FDE68A",
    totalMembers: 165,
    description:
      "Connecting international and local students through cultural exchange nights and global heritage showcases.",
    advisors: [
      { name: "Israt Jahan", role: "Faculty Advisor", email: "israt@bracu.ac.bd" },
    ],
  },
  {
    code: "MONON",
    fullName: "MONON Club",
    category: "Non-Academic",
    department: "Literature & Culture",
    email: "monon@bracu.ac.bd",
    color: "#7E22CE",
    accent: "#E9D5FF",
    totalMembers: 240,
    description:
      "Celebrating Bengali literature, recitation, music, and cultural heritage on campus.",
    advisors: [
      { name: "Dr. Maswood Akhter", role: "Faculty Advisor", email: "maswood@bracu.ac.bd" },
    ],
  },
];

function createSvgLogo(code, fullName, bgColor, accentColor) {
  const fontSize = code.length <= 4 ? 54 : code.length <= 5 ? 44 : 36;
  const initials = code.toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="g-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="48" fill="url(#g-${initials})" />
  <circle cx="120" cy="108" r="76" fill="none" stroke="${accentColor}" stroke-width="4" opacity="0.55" />
  <text x="120" y="122" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="${fontSize}" fill="#FFFFFF" letter-spacing="2">${initials}</text>
  <rect x="44" y="164" width="152" height="28" rx="14" fill="${accentColor}" opacity="0.22" />
  <text x="120" y="183" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="13" fill="#F8FAFC" letter-spacing="1.5">BRAC UNIVERSITY</text>
</svg>
`;
}

function generateAllLogos() {
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
  }

  // OCA Logo
  fs.writeFileSync(
    path.join(LOGOS_DIR, "oca.svg"),
    createSvgLogo("OCA", "Office of Co-curricular Activities", "#1E3A8A", "#60A5FA"),
    "utf8"
  );

  for (const club of CLUBS) {
    const slug = club.code.toLowerCase();
    fs.writeFileSync(
      path.join(LOGOS_DIR, `${slug}.svg`),
      createSvgLogo(club.code, club.fullName, club.color, club.accent),
      "utf8"
    );
  }
  console.log(`Generated ${CLUBS.length + 1} SVG logos in ${LOGOS_DIR}`);
}

function buildPanel(code) {
  return [
    { name: `${code} President`, role: "President", photo: "/images/panel/1.jpg" },
    { name: `${code} Vice President`, role: "Vice President", photo: "/images/members/1.jpg" },
    { name: `${code} General Secretary`, role: "General Secretary", photo: "/images/panel/1.jpg" },
    { name: `${code} Treasurer`, role: "Treasurer", photo: "/images/members/1.jpg" },
    { name: `${code} Event Director`, role: "Director of Events", photo: "/images/panel/1.jpg" },
    { name: `${code} PR Lead`, role: "Head of PR & Media", photo: "/images/members/1.jpg" },
  ];
}

function buildAlumni(code) {
  return [
    {
      name: `Tariqul Hasan`,
      role: "Former President",
      currentPosition: `Software Engineer • ${code} Alumni`,
      photo: "/images/alumni/1.jpg",
    },
    {
      name: `Nusrat Jahan`,
      role: "Former General Secretary",
      currentPosition: `Product Manager • ${code} Alumni`,
      photo: "/images/alumni/1.jpg",
    },
  ];
}

function futureDateISO(daysFromNow) {
  const d = new Date(Date.now() + daysFromNow * 24 * 3600 * 1000);
  return d.toISOString().split("T")[0];
}

async function run() {
  try {
    generateAllLogos();

    await dbClient.connect();
    console.log("Connected to MongoDB for complete BRACU seeding");

    const db = getDb();
    await ensureIndexes();

    const clubs = db.collection("clubs");
    const users = db.collection("users");
    const announcements = db.collection("announcements");
    const events = db.collection("events");
    const messages = db.collection("messages");

    // 1. Upsert OCA Admin
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    await clubs.updateOne(
      { email: "oca@bracu.ac.bd" },
      {
        $set: {
          name: "OCA",
          fullName: "Office of Co-curricular Activities (OCA)",
          category: "Administration",
          department: "Student Affairs",
          email: "oca@bracu.ac.bd",
          role: "oca",
          description:
            "Central governing body for all student clubs, co-curricular events, budgets, and campus venues at BRAC University.",
          photo_url: "/images/logos/oca.svg",
          totalMembers: 15,
          advisors: [],
          panel: [],
          notableAlumnis: [],
        },
      },
      { upsert: true }
    );

    await users.updateOne(
      { email: "oca@bracu.ac.bd" },
      {
        $set: {
          email: "oca@bracu.ac.bd",
          role: "oca",
          name: "OCA Admin",
          passwordHash: adminPasswordHash,
        },
      },
      { upsert: true }
    );

    // 2. Upsert all 26 BRAC University clubs + user accounts
    const clubPasswordHash = await bcrypt.hash("club123", 10);

    for (const c of CLUBS) {
      const slug = c.code.toLowerCase();
      const logoUrl = `/images/logos/${slug}.svg`;

      await clubs.updateOne(
        { email: c.email },
        {
          $set: {
            name: c.code,
            fullName: c.fullName,
            category: c.category,
            department: c.department,
            email: c.email,
            role: "club",
            description: c.description,
            photo_url: logoUrl,
            totalMembers: c.totalMembers,
            advisors: c.advisors.map((a) => ({
              ...a,
              photo: "/images/advisors/1.jpg",
            })),
            panel: buildPanel(c.code),
            notableAlumnis: buildAlumni(c.code),
          },
        },
        { upsert: true }
      );

      await users.updateOne(
        { email: c.email },
        {
          $set: {
            email: c.email,
            role: "club",
            name: c.fullName,
            passwordHash: clubPasswordHash,
          },
        },
        { upsert: true }
      );
    }

    // Remove legacy demo club1 if present so the directory is 100% real BRACU clubs
    await clubs.deleteOne({ email: "club1@bracu.ac.bd" });
    await users.deleteOne({ email: "club1@bracu.ac.bd" });

    // 3. Seed realistic BRACU events
    const seedEvents = [
      {
        title: "BRACU Intra-University Hackathon 2026",
        clubMail: "bucc@bracu.ac.bd",
        description: "24-hour coding & AI innovation sprint open to all BRAC University undergraduates.",
        date: futureDateISO(5),
        needsRoom: true,
        roomNumber: "UB20101 (Auditorium)",
        needsBudget: true,
        budget: 45000,
        budgetDetails: "Prizes, cloud credits, refreshments, and judging logistics",
        needsGuestPasses: true,
        guestPassesCount: 15,
        additionalRequirements: "High-speed Wi-Fi and overnight power backup",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved. Coordinate overnight security with Campus Operations.",
      },
      {
        title: "National Robo Carnival & Line Follower",
        clubMail: "robu@bracu.ac.bd",
        description: "Inter-university autonomous rover and line-following robot showcase.",
        date: futureDateISO(9),
        needsRoom: true,
        roomNumber: "Multipurpose Hall",
        needsBudget: true,
        budget: 60000,
        budgetDetails: "Arena fabrication, trophies, and power distribution",
        needsGuestPasses: true,
        guestPassesCount: 40,
        additionalRequirements: "3-phase power line and 12 tables",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved with full venue clearance.",
      },
      {
        title: "BizMaestros Case Competition Seminar",
        clubMail: "bizbee@bracu.ac.bd",
        description: "Corporate strategy workshop and case-solving bootcamp led by FMCG executives.",
        date: futureDateISO(12),
        needsRoom: true,
        roomNumber: "UB30203",
        needsBudget: true,
        budget: 18000,
        budgetDetails: "Guest speaker honorarium and snacks",
        needsGuestPasses: true,
        guestPassesCount: 6,
        additionalRequirements: "Wireless microphones and projector",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved. Submit guest car plate numbers 48 hours prior.",
      },
      {
        title: "Through the Lens: Annual Photo Exhibition",
        clubMail: "buaps@bracu.ac.bd",
        description: "Three-day campus photography and fine arts gallery showcasing student works.",
        date: futureDateISO(15),
        needsRoom: true,
        roomNumber: "Exhibition Gallery",
        needsBudget: true,
        budget: 25000,
        budgetDetails: "Photo framing, display boards, and lighting",
        needsGuestPasses: true,
        guestPassesCount: 10,
        additionalRequirements: "Display easels and spotlight rigging",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved. Great initiative!",
      },
      {
        title: "The Stage: Cultural Night & Folk Fest",
        clubMail: "bucuc@bracu.ac.bd",
        description: "Evening of traditional and contemporary music, dance, and cultural performances.",
        date: futureDateISO(20),
        needsRoom: true,
        roomNumber: "BRACU Auditorium",
        needsBudget: true,
        budget: 55000,
        budgetDetails: "Sound system, stage lighting, and costume logistics",
        needsGuestPasses: true,
        guestPassesCount: 25,
        additionalRequirements: "Sound check slot from 10 AM",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved. Sound levels must comply with campus guidelines.",
      },
      {
        title: "BRACU Winter Blood Donation Drive",
        clubMail: "bucsc@bracu.ac.bd",
        description: "Campus-wide voluntary blood donation camp in partnership with Quantum Foundation.",
        date: futureDateISO(7),
        needsRoom: true,
        roomNumber: "Indoor Games Room",
        needsBudget: true,
        budget: 12000,
        budgetDetails: "Donor juice, glucose, and medical disposal bags",
        needsGuestPasses: true,
        guestPassesCount: 8,
        additionalRequirements: "Medical waste bin and 6 stretchers",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved. Medical center notified.",
      },
      {
        title: "Inter-Departmental Parliamentary Debate",
        clubMail: "budc@bracu.ac.bd",
        description: "British Parliamentary debate championship for novice and varsity teams.",
        date: futureDateISO(18),
        needsRoom: true,
        roomNumber: "UB40301",
        needsBudget: true,
        budget: 15000,
        budgetDetails: "Adjudicator honorarium and certificates",
        needsGuestPasses: false,
        guestPassesCount: 0,
        additionalRequirements: "4 breakout classrooms",
        status: "Responded",
        response: "Accepted",
        feedback: "Approved.",
      },
      {
        title: "Startup Founders Pitch Night",
        clubMail: "buedf@bracu.ac.bd",
        description: "Early-stage student startups pitch to angel investors and alumni mentors.",
        date: futureDateISO(10),
        needsRoom: true,
        roomNumber: "UB20101 (Auditorium)",
        needsBudget: true,
        budget: 22000,
        budgetDetails: "Stage branding and investor dinner",
        needsGuestPasses: true,
        guestPassesCount: 12,
        additionalRequirements: "Podium and clicker",
        status: "Pending",
        response: "",
        feedback: "",
      },
      {
        title: "IEEE Power & Energy Symposium",
        clubMail: "ieee@bracu.ac.bd",
        description: "Technical seminar on renewable microgrids and smart energy systems in Bangladesh.",
        date: futureDateISO(14),
        needsRoom: true,
        roomNumber: "UB50402",
        needsBudget: true,
        budget: 16000,
        budgetDetails: "Speaker plaques and refreshments",
        needsGuestPasses: true,
        guestPassesCount: 5,
        additionalRequirements: "AV setup",
        status: "Pending",
        response: "",
        feedback: "",
      },
      {
        title: "BRACU Moot Court Workshop",
        clubMail: "buls@bracu.ac.bd",
        description: "Hands-on memorial drafting and oral advocacy session for law students.",
        date: futureDateISO(16),
        needsRoom: true,
        roomNumber: "Moot Court Room",
        needsBudget: true,
        budget: 9500,
        budgetDetails: "Printing and refreshments",
        needsGuestPasses: true,
        guestPassesCount: 3,
        additionalRequirements: "None",
        status: "Pending",
        response: "",
        feedback: "",
      },
      {
        title: "Bandarban Trekking Orientation",
        clubMail: "buac@bracu.ac.bd",
        description: "Safety briefing, gear checklist, and fitness prep for upcoming winter expedition.",
        date: futureDateISO(11),
        needsRoom: true,
        roomNumber: "UB30105",
        needsBudget: false,
        budget: 0,
        budgetDetails: "",
        needsGuestPasses: false,
        guestPassesCount: 0,
        additionalRequirements: "Projector for route maps",
        status: "Pending",
        response: "",
        feedback: "",
      },
      {
        title: "Short Film Screening & Director Q&A",
        clubMail: "bufc@bracu.ac.bd",
        description: "Screening of award-winning Bangladeshi independent short films.",
        date: futureDateISO(22),
        needsRoom: true,
        roomNumber: "BRACU Auditorium",
        needsBudget: true,
        budget: 14000,
        budgetDetails: "Screening rights and guest refreshments",
        needsGuestPasses: true,
        guestPassesCount: 4,
        additionalRequirements: "Surround sound check",
        status: "Pending",
        response: "",
        feedback: "",
      },
      {
        title: "Rapid Chess Open Championship",
        clubMail: "buchc@bracu.ac.bd",
        description: "7-round Swiss system rapid chess tournament open to all students.",
        date: futureDateISO(8),
        needsRoom: true,
        roomNumber: "Indoor Games Room",
        needsBudget: true,
        budget: 8500,
        budgetDetails: "Chess clocks rental and medals",
        needsGuestPasses: false,
        guestPassesCount: 0,
        additionalRequirements: "20 tables and 40 chairs",
        status: "Responded",
        response: "Rejected",
        feedback: "Indoor Games Room is already reserved on that date. Please resubmit for next week.",
      },
    ];

    for (const ev of seedEvents) {
      await events.updateOne(
        { title: ev.title, clubMail: ev.clubMail },
        {
          $set: {
            ...ev,
            requestDate: new Date(),
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    // 4. Seed realistic announcements
    const seedAnnouncements = [
      {
        title: "Spring/Fall Club Fair 2026 — Booth Registration Open",
        description:
          "All active clubs must submit their booth layout and volunteer roster to OCA by Friday 5:00 PM. Electricity and banner stand requests should be included in your event proposal.",
        date: new Date(),
        posterEmail: "oca@bracu.ac.bd",
        posterName: "OCA Admin",
      },
      {
        title: "Updated Event Budget & Reimbursement Guidelines",
        description:
          "Please attach itemized vendor quotations for any event budget exceeding ৳15,000. Post-event receipts must be submitted within 7 working days.",
        date: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        posterEmail: "oca@bracu.ac.bd",
        posterName: "OCA Admin",
      },
      {
        title: "BUCC Intra-University Hackathon Registrations Live",
        description:
          "Form teams of 3–4 members and register before seats fill up! Mentorship sessions start next Tuesday.",
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        posterEmail: "bucc@bracu.ac.bd",
        posterName: "BRAC University Computer Club",
      },
      {
        title: "ROBU National Robo Carnival Volunteer Call",
        description:
          "Looking for enthusiastic volunteers for arena management, registration desk, and technical support.",
        date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        posterEmail: "robu@bracu.ac.bd",
        posterName: "Robotics Club of BRAC University",
      },
      {
        title: "BUAPS Annual Photo Exhibition — Call for Submissions",
        description:
          "Submit up to 3 high-resolution photographs under Street, Nature, or Campus Life categories.",
        date: new Date(Date.now() - 4 * 24 * 3600 * 1000),
        posterEmail: "buaps@bracu.ac.bd",
        posterName: "BRAC University Art & Photography Society",
      },
    ];

    for (const ann of seedAnnouncements) {
      await announcements.updateOne(
        { title: ann.title },
        { $set: ann },
        { upsert: true }
      );
    }

    // 5. Seed realistic OCA <-> Club chat threads
    const seedMessages = [
      {
        senderEmail: "bucc@bracu.ac.bd",
        receiverEmail: "oca@bracu.ac.bd",
        content: "Assalamu Alaikum! We submitted the proposal for the Intra-University Hackathon. Could we confirm overnight lab access?",
        date: futureDateISO(-1),
        time: "10:15 AM",
        createdAt: new Date(Date.now() - 3600 * 1000 * 5),
      },
      {
        senderEmail: "oca@bracu.ac.bd",
        receiverEmail: "bucc@bracu.ac.bd",
        content: "Walaikum Assalam! Yes, your hackathon has been approved. Please share the student ID list for overnight security clearance.",
        date: futureDateISO(-1),
        time: "11:02 AM",
        createdAt: new Date(Date.now() - 3600 * 1000 * 4),
      },
      {
        senderEmail: "robu@bracu.ac.bd",
        receiverEmail: "oca@bracu.ac.bd",
        content: "Hello OCA, we need 3-phase power extension approval for the National Robo Carnival arena in the Multipurpose Hall.",
        date: futureDateISO(0),
        time: "09:30 AM",
        createdAt: new Date(Date.now() - 3600 * 1000 * 3),
      },
      {
        senderEmail: "oca@bracu.ac.bd",
        receiverEmail: "robu@bracu.ac.bd",
        content: "Noted! Maintenance has been informed and will set up the distribution board the evening before.",
        date: futureDateISO(0),
        time: "10:05 AM",
        createdAt: new Date(Date.now() - 3600 * 1000 * 2),
      },
      {
        senderEmail: "buaps@bracu.ac.bd",
        receiverEmail: "oca@bracu.ac.bd",
        content: "Hi! Can we book 15 extra display easels for Through the Lens Exhibition?",
        date: futureDateISO(0),
        time: "11:40 AM",
        createdAt: new Date(Date.now() - 3600 * 1000 * 1),
      },
    ];

    for (const msg of seedMessages) {
      await messages.updateOne(
        {
          senderEmail: msg.senderEmail,
          receiverEmail: msg.receiverEmail,
          content: msg.content,
        },
        { $set: msg },
        { upsert: true }
      );
    }

    console.log("Complete BRAC University OCA seeding finished!");
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exitCode = 1;
  } finally {
    await dbClient.close();
  }
}

run();
