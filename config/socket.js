/* eslint-disable no-console */
const io = require("socket.io")();

const socketAPI = {
  io: io,
};

io.on("connection", (socket) => {
  console.log(`Socket ID ${socket.id} connected!`);
  socket.emit("connected!");
});

module.exports = socketAPI;
