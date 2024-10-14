const express = require("express");
const profileRouter = express.Router();
const { adminAuth, authValidation } = require("../middlewares/auth");

module.exports = profileRouter;
