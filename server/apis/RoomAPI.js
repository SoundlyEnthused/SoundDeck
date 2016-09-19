const Room = require('../models/Room');

module.exports = function RoomAPI(io) {
  Room.onCreate = () => {
    io.sockets.emit('lobbyChange', { rooms: Room.all() });
  };
  io.on('connect', (socket) => {
    socket.emit('lobbyChange', { rooms: Room.all() });
  });
};
