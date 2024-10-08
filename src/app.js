const express = require("express");
const app = express();
const { adminAuth } = require("../middlewares/auth");
// logic of checking if the request is authorised or not
// by a middileware function

app.use("/admin", adminAuth);
app.get("/admin", (req, res, next) => {
  res.send("admin Rewuest handled");
});

app.get("/user", adminAuth, (req, res) => {
  // res.send("User data sent");
  throw new Error("jsbcjs");
});

//Error handling
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something Went wrong");
  }
});
app.listen(3000, () => {
  console.log("Server Listening on 3000 port");
});
