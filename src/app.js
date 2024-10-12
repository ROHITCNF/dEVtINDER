const express = require("express");
const app = express();
const { connectToDb } = require("./config/database");
const User = require("./models/user");

const port = 7777;
//middileWare for express json
app.use(express.json());

//signup Api
app.post("/signup", async (req, res) => {
  try {
    const payloadData = req?.body;
    const userObj = {
      firstName: payloadData?.firstName,
      lastName: payloadData?.lastName,
      emailId: payloadData?.emailId,
      password: payloadData?.password,
      age: payloadData?.age,
      gender: payloadData?.gender,
    };
    // Create a new instance of  userModel with above data

    const user = new User(userObj);
    console.log("created new instance of User Model");
    await user.save();
    console.log("Saved the data in the DB");
    res.send("Successfully saved the data in teh DB");
  } catch (error) {
    res.send(`Some error occured : ${error}`);
  }
});

//GET user by a particular api
app.get("/user", async (req, res) => {
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
    res.send("Some error occured");
  }
});

//Feed Api (GET APi)
app.get("/feed", async (req, res) => {
  try {
    const userObj = await User.find({});
    if (userObj.length) {
      res.send(userObj);
    } else {
      res.send("No user found");
    }
  } catch (error) {
    console.log(error);
    res.send("Some error occured");
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
    console.log(error);
    res.send("Some error occured");
  }
});

//update the user
app.patch("/user", async (req, res) => {
  try {
    const userId = req?.body.userId;
    const data = req?.body;
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
