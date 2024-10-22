//  AUTH_ROUTER - SignUp - Login - Logout;

const express = require("express");
const authRouter = express.Router();
const app = authRouter;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  validateSignupData,
  validateLoginData,
} = require("../utills/validations");

const { authValidation } = require("../middlewares/auth");
const { sendResponseJson } = require("../constants/response");

app.post("/signup", validateSignupData, async (req, res) => {
  //Validaion of data is mandatory
  try {
    const payloadData = req?.body;
    // Encrypt the password
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`hashedPassword : ${hashedPassword}`);

    // Create a new instance of  userModel with above data
    const user = new User({
      firstName: payloadData?.firstName,
      lastName: payloadData?.lastName,
      emailId: payloadData?.emailId,
      password: hashedPassword,
      gender: payloadData?.gender,
    });
    console.log("created new instance of User Model");
    await user.save();
    console.log("Saved the data in the DB");
    res.send("Successfully saved the data in teh DB");
  } catch (error) {
    res.send(`Some error occured : ${error}`);
  }
});

app.post("/login", validateLoginData, async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // get the hashed password from the DB and Decrypt it
    const userObj = await User.findOne({ emailId: emailId });
    if (!userObj) {
      sendResponseJson(res, 400, "Invalid credentials");
    }
    const isCorrectPassword = await userObj.validateUserPassword(password);
    if (isCorrectPassword) {
      const token = await userObj.getJWT(); // More modular code
      res.cookie("token", token);
      sendResponseJson(res, 200, "logged In Successfully", userObj);
    } else {
      sendResponseJson(res, 400, "Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    sendResponseJson(res, 400, error);
  }
});

app.post("/logout", authValidation, async (req, res) => {
  // Method 1 :- setThe max age to 0 in the token cookie
  res.cookie("token", "", { expires: new Date(date.now()) });
  res.send("User LoggedOut Successfully");
});

module.exports = authRouter;
