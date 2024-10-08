const mongoose = require("mongoose");

// create the userschema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

//create the user model
const userModel = mongoose.model("user", userSchema);

//Export the userModel so that we can use at otherFile
module.exports = userModel;
