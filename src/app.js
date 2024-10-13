const express = require("express");
const app = express();
const { connectToDb } = require("./config/database");
const User = require("./models/user");
const {
  validateSignupData,
  validateLoginData,
} = require("./utills/validations");
const { adminAuth, authValidation } = require("./middlewares/auth");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = 7777;
//middileWare for express json
app.use(express.json());
app.use(cookieParser());

// To Do : Offload User realated functions to USER_SCHEMA

//signup Api
app.post("/signup", async (req, res) => {
  //Validaion of data is mandatory
  try {
    validateSignupData(req);
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

//login Api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req);
    // get the hashed password from the DB and Decrypt it
    const userObj = await User.findOne({ emailId: emailId });
    if (!userObj) {
      throw new Error("Incorrect Credentials");
    }
    const isCorrectPassword = await userObj.validateUserPassword(password);
    if (isCorrectPassword) {
      const token = await userObj.getJWT(); // More modular code
      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      res.send("Incorrect Credentials");
    }
  } catch (error) {
    console.log(error);
    res.send("Some error occured" + error);
  }
});

//GET user by a particular api
app.get("/user", authValidation, async (req, res) => {
  try {
    console.log("Going for the Authentication");
    console.log("Auth Done");
    const email = req?.body?.emailId;
    const userObj = await User.findOne({ emailId: email });
    if (userObj) {
      res.send(userObj);
    } else {
      res.send("User Not found");
    }
  } catch (error) {
    console.log(error);
    res.send("Some error occured" + error);
  }
});

//Feed Api (GET APi)
app.get("/feed", authValidation, async (req, res) => {
  try {
    console.log("Going for the Authentication");
    console.log("Auth Done");
    const userObj = await User.find({});
    if (userObj.length) {
      res.send(userObj);
    } else {
      res.send("No user found");
    }
  } catch (error) {
    console.log(error);
    res.send(`Some error occured : ${error}`);
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  try {
    const userId = req?.body?.userId;
    const user = await User.findByIdAndDelete(userId);
    user && res.send("User deleted Sucessfully");
    !user && res.send("Couldn't find the user");
  } catch (error) {
    res.send("Some error occured" + error);
  }
});

//update the user
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req?.params.userId;
    const data = req?.body;

    const allowedUpdates = ["photoUrl", "about", "skills"];
    const updatedDataObject = Object.keys(data).every((key) => {
      return allowedUpdates.includes(key);
    });

    // updatedDataObject :- false then return  as a response
    if (!updatedDataObject) {
      res.send("Update Not allowed");
      return;
    }

    const updatedData = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    updatedData && res.send(`User data Updated Sucessfully : ${updatedData}`);
  } catch (error) {
    console.log(error);
    res.send(`Some error occured : ${error}`);
  }
});

// send connection  user
app.post("/sendConnection", authValidation, async (req, res) => {
  res.send("Request Sent Successfully");
});

connectToDb()
  .then(() => {
    console.log("DB Connection Successful");
    listenToServer();
  })
  .catch((err) => {
    console.log("DB Connection errror", err);
  });

function listenToServer() {
  app.listen(port, () => {
    console.log(`Server Listening on ${port} port`);
  });
}
