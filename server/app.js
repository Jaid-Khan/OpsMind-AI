require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const uploadRoutes = require("./routes/uploadRoutes");
const queryRoutes = require("./routes/queryRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OpsMind AI Backend Running");
});

app.use("/api", uploadRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;