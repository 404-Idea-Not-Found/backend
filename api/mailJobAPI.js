const axios = require("axios");

const Meeting = require("../model/Meeting");
const getErrorMessage = require("../utils/getErrorMessage");

axios.defaults.baseURL = process.env.EMAIL_SERVER_URL;

exports.createMailJob = async (meetingId, startTime, fourOFourToken) => {
  try {
    await axios.post(
      "/mail-job/new-mail-job",
      {
        meetingId,
        startTime,
      },
      {
        headers: {
          Authorization: `Bearer ${fourOFourToken}`,
        },
      }
    );
  } catch (error) {
    await Meeting.findByIdAndDelete(meetingId);

    const errorMessage = getErrorMessage(error);

    throw new Error(errorMessage);
  }
};

exports.deleteMailJob = async (
  meetingId,
  deletedMeetingTitle,
  deletedMeetingReservation,
  fourOFourToken
) => {
  try {
    await axios.post(
      `/mail-job/deletion/${meetingId}`,
      {
        meetingId,
        deletedMeetingTitle,
        deletedMeetingReservation,
      },
      {
        headers: {
          Authorization: `Bearer ${fourOFourToken}`,
        },
      }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    throw new Error(errorMessage);
  }
};
