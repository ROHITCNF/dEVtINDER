const express = require("express");
const profileRouter = express.Router();
const { authValidation } = require("../middlewares/auth");

profileRouter.get("/profile/view", authValidation, async (req, res) => {
  try {
    const user = req?.user;
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error Occured : " + error);
  }
});

profileRouter.patch("/profile/edit", authValidation, async (req, res) => {
  // To do for the profile edit logic
});

module.exports = profileRouter;
