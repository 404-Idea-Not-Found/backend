const Meeting = require("../../model/Meeting");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorWithStatus");

function handleChatEvent(socket) {
  socket.on("chatSubmitted", async (chat) => {
    try {
      await Meeting.findByIdAndUpdate(socket.meetingId, {
        $push: { chatList: chat },
      });

      socket.broadcast.to(socket.meetingId).emit("chatReceived", chat);
    } catch (error) {
      socket.emit(
        "DBError",
        new ErrorWithStatus(
          error,
          500,
          RESPONSE_RESULT.ERROR,
          ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        ).toPlainSocketErrorObject()
      );
    }
  });
}

module.exports = handleChatEvent;
