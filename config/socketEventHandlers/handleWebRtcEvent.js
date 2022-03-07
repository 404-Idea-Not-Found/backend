/* eslint-disable no-console */
function handleWebRtcEvent(socket) {
  socket.on("requestVideo", (signal) => {
    socket.to(socket.ownerSocketId).emit("requestVideo", {
      signal,
      from: socket.id,
    });
  });

  socket.on("acceptCall", ({ signal, caller }) => {
    socket.to(caller).emit("callAccepted", signal);
  });
}

module.exports = handleWebRtcEvent;
