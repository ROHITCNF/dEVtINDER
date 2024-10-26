const express = require("express");
const requestRouter = express.Router();
const { authValidation } = require("../middlewares/auth");
const Connection = require("../models/connectionRequest");
const {
  fromToRequestExists,
  isValidUser,
} = require("../utills/requestHelpers");
const { sendResponseJson } = require("../constants/response");

// Send connection  request
requestRouter.post(
  "/request/send/:toUserId/:status",
  authValidation,
  isValidUser,
  async (req, res) => {
    try {
      /*
        Api level validations : 
        1. check if incoming userId exists or not [Done]
        2. This Api should only do intrest and ignore [Done]
        3. If already the same status coming then don't perform DB operations [Done]
        4. if from and send is same then directly rejects [done]
      */

      const fromUser = req.user;
      const toUserId = req.params.toUserId;
      const incomingStatus = req.params.status;
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(incomingStatus)) {
        return sendResponseJson(res, 400, "Invalid Request Found");
      }

      // If their is already existing connection request  A->B or B->A :
      const fromToRequestExist = await fromToRequestExists(
        fromUser._id,
        toUserId
      );
      if (fromToRequestExist) {
        if (fromToRequestExist?.status === incomingStatus) {
          return sendResponseJson(
            res,
            400,
            `${incomingStatus} Request is already their`
          );
        } else {
          //update the existing request
          const updatedData = await Connection.findOneAndUpdate(
            {
              fromUserId: fromToRequestExist.fromUserId,
              toUserId: fromToRequestExist.toUserId,
            },
            { status: incomingStatus }
          );

          if (Object.keys(updatedData).length) {
            return sendResponseJson(
              res,
              200,
              `Updated the staus to ${incomingStatus}`
            );
          }
        }
      }

      const toFromRequestExist = await fromToRequestExists(
        toUserId,
        fromUser._id
      );
      if (toFromRequestExist) {
        return sendResponseJson(
          res,
          400,
          "Other Person has already sent u the request"
        );
      }
      const connection = new Connection({
        fromUserId: fromUser._id,
        toUserId: toUserId,
        status: incomingStatus,
      });
      await connection.save();
      return sendResponseJson(
        res,
        200,
        `Successfully saved the ${incomingStatus} request`
      );
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: `${error}`,
      });
    }
  }
);

// Get the List of Your approval Api

// Approve or reject Api
requestRouter.post(
  "/request/review/:toUserId/:status",
  authValidation,
  isValidUser,
  async (req, res) => {
    /*
       Api level validations :  
      1. Auth Validation .
      2. Is [toUserId] is validUser
      3. B is accepting / rejecting  A ,  means their is already request of A->B is present in DB.
      4. incoming Status must be intrested then only u can accept or reject 
    */
  }
);

module.exports = requestRouter;
