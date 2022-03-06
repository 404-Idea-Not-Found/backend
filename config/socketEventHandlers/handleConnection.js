const Meeting = require("../../model/Meeting");
const User = require("../../model/User");

/* eslint-disable no-console */
function handleConnection(socket) {
  socket.join(socket.meetingId);
  console.log(
    `✅Socket ID ${socket.id} connected and joined room ${socket.meetingId}✅`
  );
  socket.on("disconnect", async () => {
    try {
      if (socket.isOwner) {
        console.log("커밋하기전에 이거 꼭 살려야함.");
        // await Meeting.findByIdAndUpdate(socket.meetingId, {
        //   ownerSocketId: null,
        //   isLive: false,
        //   isEnd: true,
        // });

        console.log("커밋하기전에 이거 꼭 지워야함.");
        await Meeting.findByIdAndUpdate(socket.meetingId, {
          ownerSocketId: null,
          isLive: false,
        });

        console.log("커밋하기전에 이거 꼭 살려야함.");
        // socket.broadcast.to(socket.meetingId).emit("ownerDisconnected");
        // return;
      }

      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { currentSocketId: null });
      }

      socket
        .to(socket.ownerSocketId)
        .emit("participantDisconnected", socket.id);

      console.log(`❌Socket ID ${socket.id} disconnected!!!❌`);
    } catch (error) {
      console.log(
        "Socket failed to gracefully disconnect. Some socket related DB fields might be outdated"
      );
    }
  });
}

module.exports = handleConnection;
