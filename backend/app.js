require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Routes
const photoRoutes = require("./routes/photoRoutes");
const eventRoutes = require("./routes/eventRoutes");
const statisticRoutes = require("./routes/statisticRoutes");
const newsRoute = require("./routes/newsRoute");
const authRoute = require("./routes/authRoute");
const pageContentRoutes = require("./routes/pageContentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middleware
app.set("trust proxy", true);
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Çelikhan Köyü API" });
});

// Hata yakalama
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu!" });
});

// Config
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || "0.0.0.0";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/celikhan";

// DB -> Server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
    app.listen(PORT, HOST, () => console.log(`API ${HOST}:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  });
