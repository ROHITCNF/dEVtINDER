const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
  console.log("Admin Auth is getting checked");
  const unauth = true;
  if (!unauth) {
    res.status(401).send("Unauth Request");
  } else {
    next();
  }
};

const authValidation = async (req, res, next) => {
  // This function will validate if the cookie coming here is valid or not
  try {
    const { token } = req.cookies;
    const decodedMessage = await jwt.verify(token, "rohit@cnf12345");
    const { _id } = decodedMessage;
    const userObj = await User.findOne({ _id: _id });
    if (!userObj) {
      throw new Error("User Not Authenticated ");
    }
    req.user = userObj; // Attaching the userObject with the req so that next function will be having Correct UserData
    next();
  } catch (error) {
    console.log(error);
    res.send("User Not Authenticated " + error);
  }
};

module.exports = { adminAuth, authValidation };
