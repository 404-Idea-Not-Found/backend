function handleCanvasEvent(socket) {
  socket.on("drawing", ({ pathData, room }) => {
    socket.broadcast.to(room).emit("drawing", pathData);
  });
  socket.on("clearCanvas", ({ room }) => {
    socket.broadcast.to(room).emit("clearCanvas");
  });
}

module.exports = handleCanvasEvent;
