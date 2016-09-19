const chai = require('chai');
const Room = require('../../../server/models/Room.js');

const expect = chai.expect;


describe('Room', () => {
  afterEach('reset models', () => {
    Room.clearAll();
  });

  describe('create', () => {
    it('should be a function', () => {
      expect(Room.create).to.be.a('function');
    });
    it('should make a new room', () => {
      let roomName = "rap";
      let newRoom = Room.create(roomName);
      expect(newRoom).to.be.a('object');
      expect(newRoom.name).to.equal(roomName);
    });
  });

  describe('all', () => {
    it('should be a function', () => {
      expect(Room.all).to.be.a('function');
    });
    it('should return an array of all rooms', () => {
      let rooms = Room.all();
      expect(rooms).to.be.a('array');
      expect(rooms).to.deep.equal([]);

      let room1 = Room.create('Default');
      let room2 = Room.create('Pop');
      let room3 = Room.create('Rock');
      rooms = Room.all();
      expect(rooms).to.deep.equal([room1, room2, room3]);
    });
  });

  describe('remove', () => {
    it('should be a function', () => {
      expect(Room.remove).to.be.a('function');
    });
    it('should remove room from room list', () => {
      let room1 = Room.create('Default');
      let room2 = Room.create('Pop');
      let room3 = Room.create('Rock');
      expect(Room.all()).to.deep.equal([room1, room2, room3]);
      Room.remove(room2.id);
      expect(Room.all()).to.deep.equal([room1, room3]);
    });
  })
});


