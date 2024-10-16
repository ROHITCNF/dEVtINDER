const sendResponseJson = (responsePointer, status, message) => {
  const stat = status === 200 ? "ok" : "error";
  responsePointer.status(status).json({
    status: stat,
    message: message,
  });
};
module.exports = { sendResponseJson };
