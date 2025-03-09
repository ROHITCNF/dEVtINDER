const express = require("express");
const User = require("../models/user");
const profileRouter = express.Router();
const { authValidation ,authValidationWithoutUpdatingTheRequest } = require("../middlewares/auth");
const { sendResponseJson } = require("../constants/response");

profileRouter.get("/profile/view", authValidation, async (req, res) => {
  try {
    const user = req?.user;
    sendResponseJson(res, 200, "UserProfile Get Successfully", user);
  } catch (error) {
    console.log(error);
    sendResponseJson(res, 400, "Error Occured : " + error);
  }
});

profileRouter.patch("/profile/edit", authValidation, async (req, res) => {
  try {
    const { firstName, lastName, age, imgUrl, about, skills, password, email, gender,} = req.body;
    const { _id } = req.user; // Current logged-in user

    // Ensure email and gender are NOT updated
    if (email || gender) {
      return sendResponseJson(res, 400, "Cannot update email or gender");
    }

    // Create an updatedData object dynamically
    const updatedData = { firstName, lastName, age, imgUrl, about, skills};

    // Remove undefined values to avoid unnecessary updates
    Object.keys(updatedData).forEach((key) => updatedData[key] === undefined && delete updatedData[key]);

    // Update the user and return the new data
    const updatedUser = await User.findByIdAndUpdate(_id, updatedData, { new: true });

    if (!updatedUser) {
      return sendResponseJson(res, 404, "User not found");
    }

    sendResponseJson(res, 200, "UserProfile Updated Successfully", updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    sendResponseJson(res, 500, "UserProfile Update Failed", error.message);
  }
});


module.exports = profileRouter;
