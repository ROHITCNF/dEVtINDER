const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  // firstname validation

  //lastname validation

  //emailId validation

  //password validation
};

const validateLoginData = (req) => {
  try {
    const { emailId } = req.body;
    if (!validateEmail(emailId)) {
      throw new Error("Invalid Email id");
    }
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
