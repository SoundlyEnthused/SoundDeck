import io from 'socket.io-client';

const ServerAPI = {
  socket: null,
};

ServerAPI.connect = () => {
  // console.log("socket connecting");
  ServerAPI.socket = io('http://localhost:' + process.env.PORT);
};

ServerAPI.disconnect = () => {
  ServerAPI.socket.disconnect();
};

ServerAPI.onUpdate = (callback) => {
  ServerAPI.socket.on('room', (data) => {
    // console.log('Room event', data);
    callback(data);
  });
};

ServerAPI.joinRoom = (roomId) => {
  // console.log('client join room', roomId);
  ServerAPI.socket.emit('join', { roomId });
};

ServerAPI.login = (user) => {
  // console.log('Server API login', user);
  ServerAPI.socket.emit('login', { id: user.id, username: user.username, avatar_url: user.avatar_url });
};

ServerAPI.onLogin = (callback) => {
  // console.log('client join room', roomId);
  ServerAPI.socket.on('login', (data) => {
    callback(data);
  });
};

ServerAPI.enqueue = () => {
  // console.log('Server API enqueueDJ', user);
  ServerAPI.socket.emit('enqueue');
};

ServerAPI.dequeue = () => {
  // console.log('Server API dequeueDJ', user);
  ServerAPI.socket.emit('dequeue');
};

// tracks => [{ songId: ele.songId, duration: ele.duration }, etc...]
ServerAPI.updatePlaylist = (tracks) => {
  ServerAPI.socket.emit('playlist', tracks);
};

module.exports = ServerAPI;
