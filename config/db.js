const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  mongoose.connect(process.env.DB_URL, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("Database Connected...");
    })
    .catch((err) => console.log("Connection Failed."));
}

module.exports = connectDB;
