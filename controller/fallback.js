const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");

exports.sendFallback = (req, res, next) => {
  res.status(404).json({
    result: RESPONSE_RESULT.ERROR,
    reason: ERROR_MESSAGES.FAILED_TO_ROUTE_REQUEST,
  });
};
