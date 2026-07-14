const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Routers (MVC)
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const clubRoutes = require("./routes/club.routes");
const messageRoutes = require("./routes/message.routes");
const announcementRoutes = require("./routes/announcement.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// Permissive CORS for local development: reflect request origin
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json());

// const verifyToken = (req, res, next) => {
//   console.log(req.headers.authorization);
//   if (!req.headers.authorization) {
//     return res.status(401).send("Access Denied");
//   }
//   const token = req.headers.authorization.split(" ")[1];
//   if (!token) {
//     return res.status(401).send("Access Denied");
//   }

//   jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send("Access Denied");
//     }

//     req.decoded = decoded;
//     next();
//   });
// };


app.get("/", (req, res) => {
  res.send("Welcome to BRACU OCA Backend");
});

app.get("/health", (req, res) => {
  res.status(200).send("Ok");
});

// Mount routers
app.use(authRoutes);
app.use(eventRoutes);
app.use(clubRoutes);
app.use(messageRoutes);
app.use(announcementRoutes);
app.use(dashboardRoutes);

module.exports = app;