const { getMeetingList } = require("../service/meeting");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.sendMeetingList = async (req, res, next) => {
  const { lastId } = req.params;

  try {
    const meetingList = await getMeetingList(lastId);

    res.json({
      result: RESPONSE_RESULT.OK,
      meetingList,
    });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
      )
    );
  }
};
