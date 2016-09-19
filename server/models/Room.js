const Room = {};

let rooms = [];
let nextId = 0;

Room.create = function create(name) {
  const newRoom = { name, id: nextId };
  nextId += 1;
  rooms.push(newRoom);
  Room.onCreate(newRoom);
  return newRoom;
};

// Replace this with a custom callback
Room.onCreate = function onCreate() {
  // Passed room
};

Room.clearAll = function clearAll() {
  rooms = [];
};

Room.all = function all() {
  return rooms;
};

Room.remove = function remove(id) {
  rooms = rooms.filter(room => room.id !== id);
  return rooms;
};

module.exports = Room;
