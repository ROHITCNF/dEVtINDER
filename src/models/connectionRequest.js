const mongoose = require("mongoose");
const User = require("./user");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // It is refernce two the User collection of the database
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // when u do this querry then this will become very fast
const connectionRequestModel = new mongoose.model(
  "connection",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
