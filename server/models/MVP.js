const Room = require('../models/Room');

const MVP = Object.create(Room);

MVP.get = function getState() {
  const state = {};
  this.all().forEach((room) => {
    state[room.id] = room;
  });
  return state;
};

MVP.reset = function resetState() {
  this.clearAll();
};

module.exports = MVP;
