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
    it('should move a user from any current room to another and leave current users alone!', () => {
      const room1 = Room.create('Dance');
      const room2 = Room.create('Ambient');
      const userId = 1234;
      const userId2 = 12;
      Room.join(room1.id, userId2);
      Room.join(room1.id, userId);
      expect(room1.users.sort()).to.deep.equal([userId, userId2].sort());
      expect(room2.users).to.deep.equal([]);
      Room.join(room2.id, userId);
      expect(room1.users).to.deep.equal([userId2]);
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
      const userId2 = 13372;
      Room.join(room.id, userId);
      Room.join(room.id, userId2);
      expect(room.users.sort()).to.deep.equal([userId, userId2].sort());
      Room.leave(room.id, userId);
      const updatedRoom = Room.getByUserId(userId2);
      expect(updatedRoom.id).to.equal(room.id);
      expect(updatedRoom.users).to.deep.equal([userId2]);
    });
  });
  describe('getByUserId', () => {
    it('should be a function', () => {
      expect(Room.getByUserId).to.be.a('function');
    });
    it('should return the room a user is in', () => {
      const room = Room.create('Reggae');
      const userId = 1337;
      Room.join(room.id, userId);
      expect(Room.getByUserId(userId).id).to.equal(room.id);
    });
    it('should return null if the user is not in a Room', () => {
      const userId = 42;
      expect(Room.getByUserId(userId)).to.equal(null);
    });
  });
});
