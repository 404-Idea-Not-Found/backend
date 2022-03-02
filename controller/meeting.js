const {
  getMeetingList,
  getMeeting,
  createMeeting,
  addUserReservation,
  removeUserReservation,
} = require("../service/meeting");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.sendMeetingList = async (req, res, next) => {
  const { query, lastId } = req.query;

  try {
    const meetingList = await getMeetingList(query, lastId);

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

exports.sendMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    const meeting = await getMeeting(meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
      meeting,
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

exports.createNewMeeting = async (req, res, next) => {
  const { meetingData } = req.body;

  try {
    const createdMeeting = await createMeeting(req.userInfo._id, meetingData);

    res.json({
      result: RESPONSE_RESULT.OK,
      createdMeeting,
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

exports.reserveMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await addUserReservation(req.userInfo._id, meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
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

exports.cancelReservation = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await removeUserReservation(req.userInfo._id, meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
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
