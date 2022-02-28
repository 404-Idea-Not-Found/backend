const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../model/User");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

const verify404Token = async (req, res, next) => {
  const { fourOFourToken } = req.cookies;

  if (!fourOFourToken) {
    next(
      new ErrorWithStatus(
        null,
        400,
        RESPONSE_RESULT.NO_TOKEN,
        ERROR_MESSAGES.FAILED_TO_GET_404_TOKEN
      )
    );
  }

  try {
    const { id } = await jwt.verify(fourOFourToken, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      next(
        new ErrorWithStatus(
          null,
          404,
          RESPONSE_RESULT.NO_USER,
          ERROR_MESSAGES.FAILED_TO_GET_USER
        )
      );
    }

    req.userInfo = user;

    next();
  } catch (error) {
    const isMongooseError = error instanceof mongoose.Error;
    let errorMessage = ERROR_MESSAGES.FAILED_TO_VERIFY_TOKEN;
    let statusCode = 400;

    if (isMongooseError) {
      errorMessage = ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB;
      statusCode = 500;
    }

    next(
      new ErrorWithStatus(
        error,
        statusCode,
        RESPONSE_RESULT.ERROR,
        errorMessage
      )
    );
  }
};

module.exports = verify404Token;
