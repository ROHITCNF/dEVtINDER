const mongoose = require("mongoose");
const mongoUri =
  "mongodb+srv://rohitcnf:nR7BEjxjDVrTyiBY@cluster0.4seip.mongodb.net/devtinder";

async function connectToDb() {
  await mongoose.connect(mongoUri);
}

module.exports = {
  connectToDb,
};
