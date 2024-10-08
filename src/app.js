const express = require("express");
const app = express();
const { connectToDb } = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  try {
    const userObj = {
      firstName: "Rohit",
      lastName: "S",
      emailId: "Rohitcnf@gmail.com",
      password: "rohiT@12345",
      age: 24,
      gender: "M",
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

connectToDb()
  .then(() => {
    console.log("DB Connection Successful");
    listenToServer();
  })
  .catch((err) => {
    console.log("DB Connection errror", err);
  });

function listenToServer() {
  app.listen(3000, () => {
    console.log("Server Listening on 3000 port");
  });
}
