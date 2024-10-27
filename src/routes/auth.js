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

authRouter.get("/gatekeeperAuth", authValidation, async (req, res) => {
  try {
    sendResponseJson(res, 200, "User Verfied Successfully");
  } catch (error) {
    console.log(error);
    sendResponseJson(res, 401, error);
  }
});

app.post("/signup", validateSignupData, async (req, res) => {
  //Validaion of data is mandatory
  try {
    const payloadData = req?.body;
    // Encrypt the password
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new instance of  userModel with above data
    const user = new User({
      firstName: payloadData?.firstName,
      lastName: payloadData?.lastName,
      emailId: payloadData?.emailId,
      password: hashedPassword,
      gender: payloadData?.gender,
      age: payloadData?.age,
    });
    await user.save();
    sendResponseJson(res, 200, "Successfully saved the data in teh DB");
  } catch (error) {
    console.log(error);
    sendResponseJson(res, 400, error);
  }
});

app.post("/login", validateLoginData, async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // get the hashed password from the DB and Decrypt it
    const userObj = await User.findOne({ emailId: emailId });
    if (!userObj) {
      return sendResponseJson(res, 400, "Invalid credentials");
    }
    const isCorrectPassword = await userObj.validateUserPassword(password);
    if (isCorrectPassword) {
      const token = await userObj.getJWT(); // More modular code
      res.cookie("token", token);
      return sendResponseJson(res, 200, "logged In Successfully", userObj);
    } else {
      return sendResponseJson(res, 400, "Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    return sendResponseJson(res, 400, error);
  }
});

app.post("/logout", async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  sendResponseJson(res, 200, "User LoggedOut Successfully");
});

module.exports = authRouter;
