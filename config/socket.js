/* eslint-disable no-console */
const io = require("socket.io")();

const checkDB = require("../middlewares/socket/checkDB");
const handleCanvasEvent = require("./socketEventHandlers/handleCanvasEvent");
const handleConnection = require("./socketEventHandlers/handleConnection");
const handleControlPanelEvent = require("./socketEventHandlers/handleControlPanelEvent");

const socketAPI = {
  io: io,
};

io.use(checkDB);
io.on("connection", (socket) => {
  handleConnection(socket);
  handleCanvasEvent(socket);
  handleControlPanelEvent(socket);
});

module.exports = socketAPI;
