const Room = require('../models/Room');

module.exports = function RoomAPI(io) {
  const emitLobbyChange = () => {
    io.sockets.emit('lobbyChange', { rooms: Room.all() });
  };

  Room.emitter.on('create', emitLobbyChange);
  Room.emitter.on('remove', emitLobbyChange);
  io.on('connect', (socket) => {
    socket.emit('lobbyChange', { rooms: Room.all() });
  });
};
