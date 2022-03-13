module.exports = function getStatusCode(error) {
  if (error.message.includes("validation")) {
    return 400;
  }

  if (error.message.includes("Cast")) {
    return 400;
  }

  return 500;
};
