const sendResponseJson = (responsePointer, status, message, data = []) => {
  const stat = status === 200 ? "ok" : "error";
  responsePointer.status(status).json({
    status: stat,
    message: message,
    data: data,
    code: status,
  });
};
module.exports = { sendResponseJson };
