const mongoose = require("mongoose");

// create the userschema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      validate(val) {
        if (!["M", "F", "T"].includes(val)) {
          throw new Error("Gender data is invalid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/v2/D4D03AQE6oFjtlUmJiA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1675496167356?e=1733961600&v=beta&t=3LseytawFjPpkTtwh5Kv3wMRFM57bb5GdqWw2Gpdlro",
    },
    about: {
      type: String,
      default: "This is a default about page of User",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

//create the user model
const userModel = mongoose.model("user", userSchema);

//Export the userModel so that we can use at otherFile
module.exports = userModel;
