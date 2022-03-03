/* eslint-disable no-console */
const io = require("socket.io")();

const handleCanvasEvent = require("./socketEventHandlers/handleCanvasEvent");
const handleConnection = require("./socketEventHandlers/handleConnection");

const socketAPI = {
  io: io,
};

io.on("connection", (socket) => {
  handleConnection(socket);
  handleCanvasEvent(socket);
});

module.exports = socketAPI;
