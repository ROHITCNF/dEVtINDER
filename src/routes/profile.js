const express = require("express");
const profileRouter = express.Router();
const { authValidation } = require("../middlewares/auth");
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
  // To do for the profile edit logic
});

module.exports = profileRouter;
