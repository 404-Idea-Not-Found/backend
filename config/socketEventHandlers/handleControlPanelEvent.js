const Meeting = require("../../model/Meeting");

function handleControlPanelEvent(socket) {
  socket.on("paintRequest", async ({ meetingId, username }) => {
    const meeting = await Meeting.findById(meetingId).select("ownerSocketId");

    if (!meeting || !meeting.ownerSocketId) {
      socket.emit("paintRequestFail");
    }

    socket
      .to(meeting.ownerSocketId)
      .emit("paintRequest", { username, requestorSocketId: socket.id });
  });

  socket.on("allowPainter", ({ socketId }) => {
    socket.to(socketId).emit("whiteboardAllowed");
  });

  socket.on("disallowPainter", ({ socketId }) => {
    socket.to(socketId).emit("whiteboardDisallowed");
  });
}

module.exports = handleControlPanelEvent;
