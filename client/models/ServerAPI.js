import io from 'socket.io-client';

const ServerAPI = {
  socket: null,
};

ServerAPI.connect = () => {
  this.socket = io('process.env.URL');
};

ServerAPI.disconntect = () => {
  this.socket.disconnect();
};

ServerAPI.onUpdate = (callback) => {
  this.socket.on('update', (data) => {
    callback(data);
  });
};

ServerAPI.joinRoom = (roomId) => {
  this.socket.emit('join', roomId);
};

ServerAPI.login = (userId) => {
  this.socket.emit('login', userId);
};

module.exports = ServerAPI;
