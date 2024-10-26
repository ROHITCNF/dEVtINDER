const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { authValidation } = require("../middlewares/auth");
const Connection = require("../models/connectionRequest");
const { sendResponseJson } = require("../constants/response");

//Pending request Api
userRouter.get("/user/requests/recieved", authValidation, async (req, res) => {
  const loggedInUser = req?.user;
  const connectionRequests = await Connection.find({
    toUserId: loggedInUser._id,
    status: "intrested",
  }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);
});

//All the connections of a particular user To do
userRouter.get("/user/connections", authValidation, async (req, res) => {
  try {
    // All the connection of user a
    // A can be is fromUserID || toUserId
    // And the status must be accepted

    const loggedInUser = req?.user;
    const connectionRequests = await Connection.find({
      $and: [
        {
          $or: [
            { fromUserId: loggedInUser._id.toString() },
            {
              toUserId: loggedInUser._id.toString(),
            },
          ],
        },
        {
          status: "accepted",
        },
      ],
    });
    // Now we got the multiple connections now  add all from and to in a set and make listof unique sets
    const uniqueConnectionsOfUser = new Set();
    connectionRequests.forEach((req) => {
      uniqueConnectionsOfUser.add(req.fromUserId.toString());
      uniqueConnectionsOfUser.add(req.toUserId.toString());
    });

    // Now we have list of unique Ids + user itself
    // so send the response off all the users which is present in the Set - user itself
    const userConnectionsToShow = await User.find({
      $and: [
        { _id: { $in: Array.from(uniqueConnectionsOfUser) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    });
    sendResponseJson(
      res,
      200,
      "Succesfull Got the User Connections",
      userConnectionsToShow
    );
  } catch (error) {
    console.log(error);
    sendResponseJson(res, 400, error);
  }
});

userRouter.get("/user/feed", authValidation, async (req, res) => {
  // Pagination is their But sanitize it
  try {
    const loggedInUser = req?.user;
    const page = parseInt(req?.query.page);
    let limit = parseInt(req?.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    /*
     Users should not see :-
     1. His own card.
     2. to all the users 
        -> user has sent request (i.e A->B or b->A)
        -> Connected Users
        -> user has ignored someone
        -> someone has ignored user
   */
    const connectionRequests = await Connection.find({
      $or: [
        { fromUserId: loggedInUser._id.toString() },
        {
          toUserId: loggedInUser._id.toString(),
        },
      ],
    }).select("fromUserId toUserId");

    // Now we got the multiple connections now  add all from and to in a set and make listof unique sets
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // Now we have list of id_s which should not be shown
    //Now loop over the User colloection and finall all the ID
    const usersToShow = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);

    sendResponseJson(res, 200, "Got the data", usersToShow);
  } catch (error) {
    console.log(error);

    sendResponseJson(res, 400, error);
  }
});

module.exports = userRouter;
