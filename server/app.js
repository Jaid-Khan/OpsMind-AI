require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const uploadRoutes = require("./routes/uploadRoutes");
const queryRoutes = require("./routes/queryRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OpsMind AI Backend Running");
});

app.use("/api/query", queryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes); 

// ✅ ALWAYS LAST
app.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === "Only PDF files allowed") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: err.message });
});

module.exports = app;