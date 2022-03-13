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
const { RESPONSE_RESULT } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorWithStatus");
const getErrorMessage = require("../utils/getErrorMessage");
const getStatusCode = require("../utils/getStatusCode");

exports.sendMeetingList = async (req, res, next) => {
  const { query, lastId } = req.query;

  try {
    const meetingList = await getMeetingList(query, lastId);

    res.json({
      result: RESPONSE_RESULT.OK,
      meetingList,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const statusCode = getStatusCode(error);

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

exports.sendMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    const meeting = await getMeeting(meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
      meeting,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const statusCode = getStatusCode(error);

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

exports.sendMyPageMeeting = async (req, res, next) => {
  const { userId, email } = req.query;

  try {
    const catagorizedMyPageMeeting = await getMyPageMeeting(userId, email);

    res.json({
      resut: RESPONSE_RESULT.OK,
      catagorizedMyPageMeeting,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const statusCode = getStatusCode(error);

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
    const statusCode = getStatusCode(error);

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

exports.reserveMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await addUserReservation(req.userInfo.email, meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const statusCode = getStatusCode(error);

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

exports.cancelReservation = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await removeUserReservation(req.userInfo.email, meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const statusCode = getStatusCode(error);

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

exports.terminateMeeting = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    await endMeeting(meetingId);

    res.json({
      result: RESPONSE_RESULT.OK,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const statusCode = getStatusCode(error);

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
    const statusCode = getStatusCode(error);

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
