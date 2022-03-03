/* eslint-disable no-console */

function handleConnection(socket) {
  const { room } = socket.handshake.query;

  socket.join(room);
  console.log(`Socket ID ${socket.id} connected and joined room ${room}`);
}

module.exports = handleConnection;
