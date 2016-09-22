const Connection = require('../models/Connection');
const Room = require('../models/Room');
const DjQueue = require('../models/DjQueue');

const MvpAPI = {};

/* Bundle the state of all Rooms and DjQueues into one Object */
MvpAPI.getState = () => {
  const state = {};
  Room.all().forEach((room) => {
    // Get the DjQueue associated with this room
    const queue = DjQueue.getByRoom(room.id);
    // Build up the state object entry from related Room and DjQueue models
    state[room.id] = {
      name: room.name,
      djs: queue.active.map(dj => ({ id: dj })),
      currentDj: queue.currentDj,
      // User's array should not include DJ's
      users: room.users.filter(user => !queue.active.includes(user)).map(user => ({ id: user })),
      djMaxNum: queue.maxDjs,
      // TODO: include current track
      track: '',
    };
  });
  return state;
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

/* Socket.io Event Endpoints */

/* Handler for event to associate a connection with a soundcloud user */
MvpAPI.login = (socket, data) => {
  Connection.register(data.id, socket);
  Connection.send(data.id, 'login', { id: data.id });
  Connection.send(data.id, 'room', MvpAPI.getState());
};

/* Handler for event to join a room */
MvpAPI.join = (socket, data) => {
  // User must be logged in, in order to join
  if (!Connection.isRegistered(socket)) {
    return;
  }
  const userId = Connection.getUserId(socket);
  Room.join(data.roomId, userId);
  Connection.sendAll('room', MvpAPI.getState());
};

/* Handler for event to enqueue for DJ position */
MvpAPI.enqueue = (socket) => {
  // User must be logged in, in order to become a DJ
  if (!Connection.isRegistered(socket)) {
    return;
  }
  const userId = Connection.getUserId(socket);
  const room = Room.getByUserId(userId);
  const queue = DjQueue.getByRoom(room.id);
  DjQueue.enqueue(queue.id, userId);
  Connection.sendAll('room', MvpAPI.getState());
};

/* Connect all Event Endpoints to Server */
MvpAPI.attachListeners = (io) => {
  io.on('connection', (socket) => {
    socket.on('login', MvpAPI.login.bind(null, socket));
  });
  io.on('join', (socket) => {
    socket.on('join', MvpAPI.join.bind(null, socket));
  });
  io.on('enqueue', (socket) => {
    socket.on('enqueue', MvpAPI.join.bind(null, socket));
  });
};

module.exports = MvpAPI;
