const mongoose = require("mongoose");

const { ERROR_MESSAGES } = require("./constants");

function getErrorMessage(error) {
  if (error instanceof mongoose.Error) {
    if (error.message.includes("validation")) {
      return ERROR_MESSAGES.FAILED_TO_VALIDATE_DB_FIELD;
    }

    return ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB;
  }

  if (error.response) {
    return error.response.data.errorMessage;
  }

  return error.message;
}

module.exports = getErrorMessage;
