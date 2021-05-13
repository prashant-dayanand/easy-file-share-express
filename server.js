const express = require("express");
const app = express();
const path = require("path"); // Path Module for getting Relative Path
const ejs = require("ejs"); //Template Engine
const cors = require('cors');

//Routes Require
const downloadRoutes = require('./routes/download')
const filesRoute = require("./routes/files");
const showRoute = require("./routes/show");

//Port Implementation
const PORT = process.env.PORT || 3230;

//Global App Middleware
app.use(express.static("public"));
app.use(express.json());

//Template Engine Implementation
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS,
};

app.use(cors(corsOptions))

//Database Connection
const connectDB = require("./config/db");
connectDB();

//Routes Middleware
app.use(filesRoute);
app.use(showRoute);
app.use(downloadRoutes)

//Server Listening
app.listen(PORT, () => {
  console.log("Server Running on Port", PORT);
});
