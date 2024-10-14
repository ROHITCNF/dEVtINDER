const express = require("express");
const userRouter = express.Router();
const app = userRouter;
const User = require("../models/user");
const { authValidation } = require("../middlewares/auth");

app.get("/user", authValidation, async (req, res) => {
  try {
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
module.exports = userRouter;
