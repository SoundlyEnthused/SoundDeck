const Room = {};

let rooms = {};
let nextId = 0;
// Map users to rooms;
let usersToRooms = {};

Room.create = function create(name) {
  const newRoom = {
    name,
    id: nextId,
    users: [],
    // djs: [],
    // currentDj: null,
    // track: null,
  };
  rooms[nextId] = newRoom;
  nextId += 1;
  return newRoom;
};

Room.clearAll = function clearAll() {
  rooms = {};
  usersToRooms = {};
};

Room.all = function all() {
  return Object.keys(rooms).map(k => rooms[k]);
};

Room.remove = function remove(id) {
  delete rooms[id];
};

Room.getByUserId = function getByUserId(userId) {
  return rooms[usersToRooms[userId]];
};

Room.join = function join(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    return;
  }
  if (usersToRooms[userId]) {
    // Return if we are trying to join a room we are in already
    if (usersToRooms[userId] === roomId) {
      return;
    }
    // Leave a room if we are already in one
    Room.leave(usersToRooms[userId], userId);
  }
  usersToRooms[userId] = roomId;
  room.users.push(userId);
};

Room.leave = function leave(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    return;
  }
  delete usersToRooms[userId];
  room.users = room.users.filter(user => user.id === userId);
};

module.exports = Room;
