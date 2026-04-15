const env = require("dotenv").config()
const express = require("express");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
const queryRoutes = require("./routes/queryRoutes");
app.use(express.json());
app.get("/", (req, res)=>{
    res.send("This Home Page")
})

app.use("/api", uploadRoutes);
app.use("/api/query", queryRoutes);

module.exports = app;