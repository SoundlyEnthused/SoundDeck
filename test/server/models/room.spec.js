const chai = require('chai');
const Room = require('../../../server/models/Room');

const expect = chai.expect;

/* global describe it after afterEach before beforeEach */

describe('Room', () => {
  afterEach('reset models', () => {
    Room.clearAll();
  });

  describe('create', () => {
    it('should be a function', () => {
      expect(Room.create).to.be.a('function');
    });
    it('should make a new room', () => {
      const roomName = 'rap';
      const newRoom = Room.create(roomName);
      expect(newRoom).to.be.a('object');
      expect(newRoom.name).to.equal(roomName);
    });
    it('should call onCreate callback whenever a new room is made', () => {
      let called = false;
      Room.onCreate = () => { called = true; };
      Room.create('Swing');
      expect(called).to.equal(true);
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

      const room1 = Room.create('Default');
      const room2 = Room.create('Pop');
      const room3 = Room.create('Rock');
      rooms = Room.all();
      expect(rooms).to.deep.equal([room1, room2, room3]);
    });
  });

  describe('remove', () => {
    it('should be a function', () => {
      expect(Room.remove).to.be.a('function');
    });
    it('should remove room from room list', () => {
      const room1 = Room.create('Default');
      const room2 = Room.create('Pop');
      const room3 = Room.create('Rock');
      expect(Room.all()).to.deep.equal([room1, room2, room3]);
      Room.remove(room2.id);
      expect(Room.all()).to.deep.equal([room1, room3]);
    });
  });
});
