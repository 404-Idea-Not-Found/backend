const Meeting = require("../../model/Meeting");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

function handleControlPanelEvent(socket) {
  socket.on("paintRequest", async ({ meetingId, username }) => {
    try {
      const meeting = await Meeting.findById(meetingId).select("ownerSocketId");

      if (!meeting || !meeting.ownerSocketId) {
        socket.emit("paintRequestFail");
        return;
      }

      socket
        .to(meeting.ownerSocketId)
        .emit("paintRequest", { username, requestorSocketId: socket.id });
    } catch (error) {
      socket.emit(
        "DBError",
        new ErrorWithStatus(
          error,
          500,
          RESPONSE_RESULT.ERROR,
          ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        )
      );
    }
  });

  socket.on("allowPainter", ({ socketId }) => {
    socket.to(socketId).emit("whiteboardAllowed");
  });

  socket.on("disallowPainter", ({ socketId }) => {
    socket.to(socketId).emit("whiteboardDisallowed");
  });
}

module.exports = handleControlPanelEvent;
