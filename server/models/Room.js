const EventEmitter = require('events');

const Room = {};

Room.emitter = new EventEmitter();

let rooms = [];
let nextId = 0;

Room.create = function create(name) {
  const newRoom = { name, id: nextId };
  nextId += 1;
  rooms.push(newRoom);
  Room.emitter.emit('create', newRoom);
  return newRoom;
};

Room.clearAll = function clearAll() {
  rooms = [];
};

Room.all = function all() {
  return rooms.slice();
};

Room.remove = function remove(id) {
  rooms = rooms.filter(room => room.id !== id);
  Room.emitter.emit('remove');
};

module.exports = Room;
