const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendResponseJson } = require("../constants/response");

const SECRET_KEY = process.env.JWT_SECRET || "rohit@cnf12345"; 
const adminAuth = (req, res, next) => {
  console.log("Admin Auth is getting checked");
  const unauth = true;
  if (!unauth) {
    res.status(401).send("Unauth Request");
  } else {
    next();
  }
};

const verifyUser = async (req) => {
  const { token } = req.cookies;
  if (!token) throw new Error("No token provided");

  const decodedMessage = jwt.verify(token, SECRET_KEY);
  const userObj = await User.findOne({ _id: decodedMessage._id });

  if (!userObj) throw new Error("User not authenticated");

  return userObj;
};

const authValidation = async (req, res, next) => {
  try {
    req.user = await verifyUser(req); // Attach user object to request
    next();
  } catch (error) {
    console.error(error);
    sendResponseJson(res, 401, "User Not Authenticated: " + error.message);
  }
};

module.exports = { adminAuth, authValidation };
