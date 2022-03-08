const { createMailJob, deleteMailJob } = require("../api/mailJobAPI");
const {
  getMeetingList,
  getMeeting,
  getMyPageMeeting,
  createMeeting,
  addUserReservation,
  removeUserReservation,
  endMeeting,
  deleteMeeting,
} = require("../service/meeting");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");
const getErrorMessage = require("../utils/getErrorMessage");

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

exports.sendMyPageMeeting = async (req, res, next) => {
  const { userId, email } = req.query;

  try {
    const catagorizedMyPageMeeting = await getMyPageMeeting(userId, email);

    res.json({
      resut: RESPONSE_RESULT.OK,
      catagorizedMyPageMeeting,
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
  const { fourOFourToken } = req.userInfo;

  try {
    const createdMeeting = await createMeeting(req.userInfo._id, meetingData);
    await createMailJob(
      createdMeeting._id,
      createdMeeting.startTime,
      fourOFourToken
    );

    res.json({
      result: RESPONSE_RESULT.OK,
      createdMeeting,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    next(new ErrorWithStatus(error, 500, RESPONSE_RESULT.ERROR, errorMessage));
  }
};

exports.reserveMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await addUserReservation(req.userInfo.email, meetingId);

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
    await removeUserReservation(req.userInfo.email, meetingId);

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

exports.terminateMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await endMeeting(meetingId);

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

exports.cancelMeeting = async (req, res, next) => {
  const { meetingId } = req.params;
  const { fourOFourToken } = req.userInfo;

  try {
    const deletedMeeting = await deleteMeeting(meetingId);
    await deleteMailJob(
      meetingId,
      deletedMeeting.title,
      deletedMeeting.reservation,
      fourOFourToken
    );

    res.json({
      result: RESPONSE_RESULT.OK,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    next(new ErrorWithStatus(error, 500, RESPONSE_RESULT.ERROR, errorMessage));
  }
};
