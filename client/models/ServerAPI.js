import io from 'socket.io-client';

const ServerAPI = {
  socket: null,
};

ServerAPI.connect = () => {
  ServerAPI.socket = io('http://localhost:' + process.env.PORT);
};

ServerAPI.disconnect = () => {
  ServerAPI.socket.disconnect();
};

ServerAPI.onUpdate = (callback) => {
  ServerAPI.socket.on('lobbyChange', (data) => {
    console.log("client getting lobby change ", data)
    callback(data);
  });
};

ServerAPI.joinRoom = (roomId) => {
  console.log('client join room', roomId);
  ServerAPI.socket.emit('join', roomId);
};

ServerAPI.login = (userId) => {
  ServerAPI.socket.emit('login', userId);
};

module.exports = ServerAPI;
