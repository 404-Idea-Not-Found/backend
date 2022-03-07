/* eslint-disable no-console */
const io = require("socket.io")();

const checkDB = require("../middlewares/socket/checkDB");
const checkOwner = require("../middlewares/socket/checkOwner");
const handleCanvasEvent = require("./socketEventHandlers/handleCanvasEvent");
const handleChatEvent = require("./socketEventHandlers/handleChatEvent");
const handleConnection = require("./socketEventHandlers/handleConnection");
const handleControlPanelEvent = require("./socketEventHandlers/handleControlPanelEvent");
const handleWebRtcEvent = require("./socketEventHandlers/handleWebRtcEvent");

const socketAPI = {
  io: io,
};

io.of("/video").use(checkOwner);
io.of("/video").on("connection", (socket) => {
  handleWebRtcEvent(socket);
});

io.use(checkDB);
io.on("connection", (socket) => {
  handleConnection(socket);
  handleCanvasEvent(socket);
  handleControlPanelEvent(socket);
  handleChatEvent(socket);
});

module.exports = socketAPI;
