const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  mongoose.connect(process.env.DB_URL, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then(() => {
    console.log('Database Connected')
  }).catch((err) => {
    console.log(err)
  });
}

module.exports = connectDB;
