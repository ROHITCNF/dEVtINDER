const validator = require("validator");
const { sendResponseJson } = require("../constants/response");
const validateSignupData = (req, res, next) => {
  const { firstName, lastName, emailId, password } = req.body;

  // firstname validation

  //lastname validation

  //emailId validation

  //password validation
  next();
};

const validateLoginData = (req, res, next) => {
  try {
    const { emailId } = req.body;
    console.log(emailId);

    if (!validateEmail(emailId)) {
      sendResponseJson(res, 400, "Invalid credentials");
    }
    next();
  } catch (error) {
    console.log("Inside Validate login Catch block");
    sendResponseJson(res, 400, "Invalid credentials");
  }
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

module.exports = {
  validateSignupData,
  validateLoginData,
};
