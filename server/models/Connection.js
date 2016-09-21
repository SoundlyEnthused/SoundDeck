// Represents a user's connections
const Connection = {};

let connectionsByUser = {};
let usersBySocket = {};
// Connection.send(userId, data)
Connection.register = function register(userId, socket) {
  if (connectionsByUser[userId]) {
    connectionsByUser[userId].push(socket);
  } else {
    connectionsByUser[userId] = [socket];
  }
  usersBySocket[socket.id] = userId;
};

Connection.getSockets = function getSockets(userId) {
  return connectionsByUser[userId] ? connectionsByUser[userId].slice() : [];
};

Connection.clearAll = function reset() {
  connectionsByUser = {};
  usersBySocket = {};
};

Connection.remove = function remove(socket) {
  const id = usersBySocket[socket.id];
  delete usersBySocket[socket.id];
  connectionsByUser[id] = connectionsByUser[id].filter(s => s.id !== socket.id);
};

Connection.send = function send(userId, eventName, data) {
  connectionsByUser[userId].forEach(socket => socket.emit(eventName, data));
};

module.exports = Connection;
