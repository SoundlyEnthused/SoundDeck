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
  describe('join', () => {
    it('should be a function', () => {
      expect(Room.join).to.be.a('function');
    });
    it('should add a user to room', () => {
      const room = Room.create('Punk');
      const userId = 123;
      Room.join(room.id, userId);
      expect(room.users).to.deep.equal([userId]);
    });
    it('should move a user from any current room to another', () => {
      const room1 = Room.create('Dance');
      const room2 = Room.create('Ambient');
      const userId = 1234;
      Room.join(room1.id, userId);
      expect(room1.users).to.deep.equal([userId]);
      expect(room2.users).to.deep.equal([]);
      Room.join(room2.id, userId);
      expect(room1.users).to.deep.equal([]);
      expect(room2.users).to.deep.equal([userId]);
    });
  });
  describe('leave', () => {
    it('should be a function', () => {
      expect(Room.leave).to.be.a('function');
    });
    it('should remove a user from a room', () => {
      const room = Room.create('Reggae');
      const userId = 1337;
      Room.join(room.id, userId);
      expect(room.users).to.deep.equal([userId]);
      Room.leave(room.id, userId);
      expect(room.users).to.deep.equal([]);
    });
  });
});
