const chai = require('chai');
const DjQueue = require('../../../server/models/DjQueue');
// const Playlist = require('../../../server/models/Playlist');

const expect = chai.expect;

/* global describe it xit after afterEach before beforeEach */

describe('DjQueue', () => {
  afterEach(() => {
    DjQueue.clearAll();
  });
  describe('create', () => {
    it('should be a function', () => {
      expect(DjQueue.create).to.be.a('function');
    });
    it('should create a new DjQueue', () => {
      const roomId = 12;
      const queue = DjQueue.create(roomId);
      expect(queue).to.be.an('object');
      expect(queue.roomId).to.equal(roomId);
      expect(queue.id).to.be.a('number');
    });
    it('takes an optional limit for active djs', () => {
      const roomId = 5;
      const maxDjs = 12;
      const queue = DjQueue.create(roomId, maxDjs);
      expect(queue.maxDjs).to.equal(12);
    });
  });
  describe('get', () => {
    it('should be a function', () => {
      expect(DjQueue.get).to.be.a('function');
    });
    it('should return a DjQueue by id', () => {
      const queue = DjQueue.create(1);
      expect(DjQueue.get(queue.id)).to.deep.equal(queue);
    });
  });
  describe('getByRoom', () => {
    it('should be a function', () => {
      expect(DjQueue.getByRoom).to.be.a('function');
    });
    it('should return a DjQueue by Room id', () => {
      const queue = DjQueue.create(1234);
      expect(DjQueue.getByRoom(1234)).to.deep.equal(queue);
    });
  });
  describe('clearAll', () => {
    it('should reset all models', () => {
      const q1 = DjQueue.create(1);
      const q2 = DjQueue.create(2);
      DjQueue.clearAll();
      expect(DjQueue.get(q1.id)).to.equal(undefined);
      expect(DjQueue.get(q2.id)).to.equal(undefined);
      expect(DjQueue.getByRoom(q1.roomId)).to.equal(undefined);
      expect(DjQueue.getByRoom(q2.roomId)).to.equal(undefined);
    });
  });
  describe('enqueue', () => {
    it('should be a function', () => {
      expect(DjQueue.enqueue).to.be.a('function');
    });
    it('should add users to a active DJ queue if there are open spots', () => {
      const roomId = 123;
      const id = DjQueue.create(roomId, 3).id;
      const u1 = 1;
      const u2 = 2;
      const u3 = 3;
      DjQueue.enqueue(id, u1);
      DjQueue.enqueue(id, u2);
      DjQueue.enqueue(id, u3);
      expect(DjQueue.getByRoom(roomId).active).to.deep.equal([u1, u2, u3]);
    });
    it('should add users to waiting queue if all active DJ spots are full', () => {
      const roomId = 123;
      const id = DjQueue.create(roomId, 2).id;
      const u1 = 1;
      const u2 = 2;
      const u3 = 3;
      DjQueue.enqueue(id, u1);
      DjQueue.enqueue(id, u2);
      DjQueue.enqueue(id, u3);
      expect(DjQueue.getByRoom(roomId).active).to.deep.equal([u1, u2]);
      expect(DjQueue.getByRoom(roomId).waiting).to.deep.equal([u3]);
    });
    it('should not add a user if that user is already in the qeueue', () => {
      const roomId = 123;
      const u1 = 1;
      let id = DjQueue.create(roomId).id;
      DjQueue.enqueue(id, u1);
      // Check active
      expect(DjQueue.get(id).active).to.deep.equal([u1]);
      DjQueue.enqueue(id, u1);
      expect(DjQueue.get(id).active).to.deep.equal([u1]);
      // Check waiting
      id = DjQueue.create(roomId, 0).id;
      DjQueue.enqueue(id, u1);
      expect(DjQueue.get(id).waiting).to.deep.equal([u1]);
      DjQueue.enqueue(id, u1);
      expect(DjQueue.get(id).waiting).to.deep.equal([u1]);
    });
  });
  describe('removeUser', () => {
    it('should be a function', () => {
      expect(DjQueue.removeUser).to.be.a('function');
    });
    it('should remove a user from active if user is a DJ', () => {
      const id = DjQueue.create(1, 2).id;
      const u1 = 1;
      DjQueue.enqueue(id, u1);
      expect(DjQueue.get(id).active).to.deep.equal([u1]);
      DjQueue.removeUser(id, u1);
      expect(DjQueue.get(id).active).to.deep.equal([]);
    });
    it('should remove a user from waiting if user is waiting', () => {
      const id = DjQueue.create(1, 1).id;
      const u1 = 1;
      const u2 = 2;
      DjQueue.enqueue(id, u1);
      DjQueue.enqueue(id, u2);
      expect(DjQueue.get(id).waiting).to.deep.equal([u2]);
      DjQueue.removeUser(id, u2);
      expect(DjQueue.get(id).waiting).to.deep.equal([]);
    });
    it('should move users from waiting to active if there open spots and waiting users', () => {
      const id = DjQueue.create(1, 2).id;
      const u1 = 1;
      const u2 = 2;
      const u3 = 3;
      DjQueue.enqueue(id, u1);
      DjQueue.enqueue(id, u2);
      DjQueue.enqueue(id, u3);
      expect(DjQueue.get(id).active).to.deep.equal([u1, u2]);
      expect(DjQueue.get(id).waiting).to.deep.equal([u3]);
      DjQueue.removeUser(id, u2);
      expect(DjQueue.get(id).active).to.deep.equal([u1, u3]);
      expect(DjQueue.get(id).waiting).to.deep.equal([]);
    });
  });
  describe('next', () => {
    it('should be a function', () => {
      expect(DjQueue.next).to.be.a('function');
    });
    it('should return the next DJ in queue', () => {
      const id = DjQueue.create(1, 4).id;
      const u1 = 1;
      const u2 = 2;
      const u3 = 3;
      DjQueue.enqueue(id, u1);
      DjQueue.enqueue(id, u2);
      DjQueue.enqueue(id, u3);
      expect(DjQueue.next(id)).to.equal(u1);
      expect(DjQueue.next(id)).to.equal(u2);
      expect(DjQueue.next(id)).to.equal(u3);
      expect(DjQueue.next(id)).to.equal(u1);
    });
    it('should work even if next DJ was removed', () => {
      const id = DjQueue.create(1, 4).id;
      const u1 = 1;
      const u2 = 2;
      const u3 = 3;
      DjQueue.enqueue(id, u1);
      DjQueue.enqueue(id, u2);
      DjQueue.enqueue(id, u3);
      expect(DjQueue.next(id)).to.equal(u1);
      expect(DjQueue.next(id)).to.equal(u2);
      DjQueue.removeUser(id, u3);
      expect(DjQueue.next(id)).to.equal(u1);
    });
  });
});
