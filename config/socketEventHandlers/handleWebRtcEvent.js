/* eslint-disable no-console */
function handleWebRtcEvent(socket) {
  socket.on("requestOwnerVideo", async (signal) => {
    console.log("be row", socket.id);
    socket.to(socket.ownerSocketId).emit("ownerVideoRequested", {
      requestorSignal: signal,
      requestorSocketId: socket.id,
    });
  });

  socket.on("acceptOwnerVideoRequest", ({ signal, requestorSocketId }) => {
    console.log("acceptOwnerVideoRequest", requestorSocketId);
    socket.to(requestorSocketId).emit("ownerVideoRequestAccepted", signal);
  });
}

module.exports = handleWebRtcEvent;
