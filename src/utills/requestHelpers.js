const Connection = require('../models/connectionRequest')
const User = require('../models/user')
const { sendResponseJson } = require('../constants/response')
const fromToRequestExists = async (from, to) => {
  const request = await Connection.findOne({
    fromUserId: from,
    toUserId: to
  })
  return request
}
const fromToRequestExistsWithSameStatus = async (from, to, incomingStatus) => {
  const request = await Connection.findOne({
    fromUserId: from,
    toUserId: to
  })

  if (request && request?.status === incomingStatus) return true

  return false
}
const isValidUser = async (req, res, next) => {
  try {
    const userId = req.params.toUserId
    await User.exists({ _id: userId })

    if (parseInt(userId) === parseInt(req?.user._id)) {
      return sendResponseJson(res, 400, `Can't send request to youself`)
    }
    next()
  } catch (error) {
    console.log('User validity function error ', error)
    return sendResponseJson(res, 400, `Couldn't send the Request to this user.`)
  }
}

module.exports = {
  fromToRequestExists,
  isValidUser
}
