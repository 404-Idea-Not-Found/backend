const { default: mongoose } = require("mongoose");

const Meeting = require("../../model/Meeting");
const User = require("../../model/User");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

async function checkDB(socket, next) {
  const { room, isOwner, userId } = socket.handshake.query;

  try {
    const meeting = await Meeting.findById(room);

    socket.meetingId = room;
    socket.ownerSocketId = meeting.ownerSocketId;

    if (isOwner === "true") {
      await meeting.update({ ownerSocketId: socket.id, isLive: true });
      socket.isOwner = true;
      socket.ownerSocketId = socket.id;
    }

    if (mongoose.isValidObjectId(userId)) {
      await User.findByIdAndUpdate(userId, { currentSocketId: socket.id });
      socket.userId = userId;
    }

    next();
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
      ).toPlainSocketErrorObject()
    );
  }
}

module.exports = checkDB;
