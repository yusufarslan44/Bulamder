require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const photoRoutes = require("./routes/photoRoutes");
const eventRoutes = require("./routes/eventRoutes");
const statisticRoutes = require("./routes/statisticRoutes");
const newsRoute = require("./routes/newsRoute");
const authRoute = require("./routes/authRoute");
// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/photos", photoRoutes);
app.use("/api/events", eventRoutes);
app.use('/api/v1/auth', authRoute)
app.use("/api/news", newsRoute);
app.use("/api/statistics", statisticRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Çelikhan Köyü API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu!" });
});

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/celikhan";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  });
