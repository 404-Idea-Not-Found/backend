const Meeting = require("../../model/Meeting");
const User = require("../../model/User");

/* eslint-disable no-console */
function handleConnection(socket) {
  socket.join(socket.meetingId);
  console.log(
    `Socket ID ${socket.id} connected and joined room ${socket.meetingId}`
  );
  socket.on("disconnect", async () => {
    if (socket.isOwner) {
      await Meeting.findByIdAndUpdate(socket.meetingId, {
        ownerSocketId: null,
      });
    }

    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { currentSocketId: null });
    }

    socket.to(socket.ownerSocketId).emit("participantDisconnected", socket.id);

    console.log(`Socket ID ${socket.id} disconnected!!!`);
  });
}

module.exports = handleConnection;
