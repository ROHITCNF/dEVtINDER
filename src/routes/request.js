const express = require("express");
const requestRouter = express.Router();
const { authValidation } = require("../middlewares/auth");

requestRouter.post("/sendConnection", authValidation, async (req, res) => {
  res.send("Request Sent Successfully");
});

module.exports = requestRouter;
