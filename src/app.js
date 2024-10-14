const express = require("express");
const app = express();
const { connectToDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const port = 7777;

//middileWare for express json
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

//handle
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

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
