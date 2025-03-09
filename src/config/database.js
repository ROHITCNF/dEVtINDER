require("dotenv").config();
const mongoose = require("mongoose");
const mongoUri =
  process.env.DB_URI;

async function connectToDb() {
  await mongoose.connect(mongoUri);
}

module.exports = {
  connectToDb,
};
