const Connection = require('../models/Connection');
const Room = require('../models/Room');
const DjQueue = require('../models/DjQueue');

const MvpAPI = {};

MvpAPI.getState = () => {
  const state = {};
  Room.all().forEach((room) => {
    // Get the DjQueue associated with this room
    const queue = DjQueue.getByRoom(room.id);
    // Build up the state object entry from related Room and DjQueue models
    state[room.id] = {
      name: room.name,
      djs: queue.active,
      currentDj: queue.currentDj,
      // User's array should not include DJ's
      users: room.users.filter(user => !queue.active.includes(user)),
      djMaxNum: queue.maxDjs,
      // TODO: include current track
      track: '',
    };
  });
  return state;
};

MvpAPI.sendState = () => {
  Connection.sendAll('room', MvpAPI.getState());
};

MvpAPI.createRoom = (name) => {
  const room = Room.create(name);
  DjQueue.create(room.id);
  return room;
};

// Resets all the App's models! -- used for testing
MvpAPI.clearAll = () => {
  Room.clearAll();
  DjQueue.clearAll();
};

MvpAPI.login = (socket, data) => {
  Connection.register(data.id, socket);
  Connection.send(data.id, 'login', { id: data.id });
  MvpAPI.sendState();
};

MvpAPI.attachListeners = (io) => {
  io.on('connection', (socket) => {
    socket.on('login', MvpAPI.login.bind(null, socket));
  });
};

module.exports = MvpAPI;