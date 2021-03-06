// Represents a user's connections
const Connection = {};

let connectionsByUser = {};
let usersBySocket = {};

Connection.register = function register(userId, socket) {
  if (connectionsByUser[userId]) {
    connectionsByUser[userId].push(socket);
  } else {
    connectionsByUser[userId] = [socket];
  }
  usersBySocket[socket.id] = userId;
};

Connection.isRegistered = function isRegistered(socket) {
  return socket.id in usersBySocket;
};

Connection.getSockets = function getSockets(userId) {
  return connectionsByUser[userId] ? connectionsByUser[userId].slice() : [];
};

Connection.getUserId = function getUserId(socket) {
  return usersBySocket[socket.id] !== undefined ? usersBySocket[socket.id] : null;
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

Connection.sendAll = function sendAll(eventName, data) {
  // TODO: Replace this with a socket room somehow
  Object.keys(connectionsByUser)
    .forEach(userId => connectionsByUser[userId].length && Connection.send(userId, eventName, data));
};

module.exports = Connection;
