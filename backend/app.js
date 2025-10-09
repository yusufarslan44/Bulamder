require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const photoRoutes = require("./routes/photoRoutes");
const eventRoutes = require("./routes/eventRoutes");
const statisticRoutes = require("./routes/statisticRoutes");
const newsRoute = require("./routes/newsRoute");
const authRoute = require("./routes/authRoute");
const pageContentRoutes = require("./routes/pageContentRoutes");

const app = express();

// Middleware
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Routes
app.use("/api/photos", photoRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoute);
app.use("/api/news", newsRoute);
app.use("/api/statistics", statisticRoutes);
app.use("/api/page-contents", pageContentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Çelikhan Köyü API" });
});

// Hata yakalama
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu!" });
});

// Config
const PORT = Number(process.env.PORT) || 5005;
const HOST = "127.0.0.1";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/celikhan";

// DB -> Server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
    app.listen(PORT, '127.0.0.1', () => console.log('API 127.0.0.1:' + PORT));
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  });