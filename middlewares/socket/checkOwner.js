const Video = require("../../model/Video");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

async function checkOwner(socket, next) {
  const { room, isOwner } = socket.handshake.query;

  try {
    if (isOwner === "true") {
      const existingVideoRoom = await Video.findOne({ room });
      if (!existingVideoRoom) {
        await Video.create({ room, ownerSocketId: socket.id });
        socket.ownerSocketId = socket.id;
      }

      if (existingVideoRoom) {
        await existingVideoRoom.update({ ownerSocketId: socket.id });
      }

      socket.isOwner = true;
    }

    if (isOwner === "false") {
      const existingVideoRoom = await Video.findOne({ room });
      socket.ownerSocketId = existingVideoRoom.ownerSocketId;
      socket.isOwner = false;
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

module.exports = checkOwner;
