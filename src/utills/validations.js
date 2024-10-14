const validator = require("validator");

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
    if (!validateEmail(emailId)) {
      throw new Error("Invalid Email id");
    }
    next();
  } catch (error) {
    throw new Error("error");
  }
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

module.exports = {
  validateSignupData,
  validateLoginData,
};
