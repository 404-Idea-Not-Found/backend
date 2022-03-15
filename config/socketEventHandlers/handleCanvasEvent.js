function handleCanvasEvent(socket) {
  socket.on("getOwnersCanvas", () => {
    socket
      .to(socket.ownerSocketId)
      .emit("getOwnersCanvas", { requestorSocketId: socket.id });
  });

  socket.on("sendOwnersCanvas", ({ ownersCanvas, requestorSocketId }) => {
    socket.to(requestorSocketId).emit("sendOwnersCanvas", { ownersCanvas });
  });

  socket.on("drawing", ({ pathData, room }) => {
    socket.broadcast.to(room).emit("drawing", pathData);
  });

  socket.on("clearCanvas", ({ room }) => {
    socket.broadcast.to(room).emit("clearCanvas");
  });
}

module.exports = handleCanvasEvent;
