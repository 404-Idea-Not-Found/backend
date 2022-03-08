/* eslint-disable no-console */
function handleWebRtcEvent(socket) {
  socket.on("requestVideo", (signal) => {
    console.log("reqest video", socket.ownerSocketId);
    socket.to(socket.ownerSocketId).emit("requestVideo", {
      signal,
      from: socket.id,
    });
  });

  socket.on("acceptCall", ({ signal, caller }) => {
    console.log("acceptCall", caller);
    socket.to(caller).emit("callAccepted", signal);
  });
}

module.exports = handleWebRtcEvent;
