const MVP = require('../models/MVP');

module.exports = function createAPI(io) {
  // register a handler to send updated state on room creation
  MVP.emitter.on('create', () => {
    io.sockets.emit('room', MVP.get());
  });
  io.on('connection', (socket) => {
    // Send inital app state on connection
    socket.emit('room', MVP.get());

    socket.on('login', (data) => {
      if (data.id) {
        // eslint-disable-next-line
        socket.soundcloudId = data.id;
        socket.emit('login', { id: socket.soundcloudId });
      } else {
        socket.emit('login', null);
      }
    });

    socket.on('join', (data) => {
      // Add user to room
      if (!socket.soundcloudId) {
        return; // What should we do on failure?
      }
      MVP.join(data.roomId, socket.soundcloudId);
      // Broadcast updated app state
      io.sockets.emit('room', MVP.get());
    });
  });
};
