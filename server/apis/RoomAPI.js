module.exports = function RoomAPI(io) {
  io.on('connect', (socket) => {
    socket.emit('lobbyChange', { rooms: [] });
  });
};
