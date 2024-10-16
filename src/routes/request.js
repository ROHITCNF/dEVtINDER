const express = require('express')
const requestRouter = express.Router()
const { authValidation } = require('../middlewares/auth')
const Connection = require('../models/connectionRequest')
const { fromToRequestExists, isValidUser } = require('../utills/requestHelpers')
const { sendResponseJson } = require('../constants/response')

// Send connectio  request
requestRouter.post(
  '/request/send/:toUserId/:status',
  authValidation,
  isValidUser,
  async (req, res) => {
    try {
      /*
        Api level validations : 
        1. check if incoming userId exists or not
        2. This Api should only do intrest and ignore [Done]
        3. If already the same status coming then don't perform DB operations [Done]
      */

      const fromUser = req.user
      const toUserId = req.params.toUserId
      const incomingStatus = req.params.status
      const allowedStatus = ['ignored', 'intrested']
      if (!allowedStatus.includes(incomingStatus)) {
        return sendResponseJson(res, 400, 'Invalid Request Found')
      }

      // If their is already existing connection request  A->B or B->A :
      const fromToRequestExist = await fromToRequestExists(
        fromUser._id,
        toUserId
      )
      if (fromToRequestExist) {
        if (fromToRequestExist?.status === incomingStatus) {
          return sendResponseJson(
            res,
            400,
            `${incomingStatus} Request is already their`
          )
        } else {
          //update the existing request
          const updatedData = await Connection.findOneAndUpdate(
            {
              fromUserId: fromToRequestExist.fromUserId,
              toUserId: fromToRequestExist.toUserId
            },
            { status: incomingStatus }
          )

          if (Object.keys(updatedData).length) {
            return sendResponseJson(
              res,
              200,
              `Updated the staus to ${incomingStatus}`
            )
          }
        }
      }

      const toFromRequestExist = await fromToRequestExists(
        toUserId,
        fromUser._id
      )
      if (toFromRequestExist) {
        return res.status(400).json({
          status: 'error',
          message: `Other Person has already sent u the request`
        })
      }
      const connection = new Connection({
        fromUserId: fromUser._id,
        toUserId: toUserId,
        status: incomingStatus
      })
      await connection.save()
      res.json({
        status: 'ok',
        message: `Successfully saved the ${incomingStatus} request`
      })
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: `${error}`
      })
    }
  }
)

module.exports = requestRouter
