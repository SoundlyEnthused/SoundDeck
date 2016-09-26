const chai = require('chai');
const DjQueue = require('../../../server/models/DjQueue');
const Playlist = require('../../../server/models/Playlist');

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
    it('should return an immutable object', () => {
      const queue = DjQueue.create(1);
      queue.active[0] = 'No';
      expect(DjQueue.get(queue.id).active).to.deep.equal([]);
      queue.waiting[0] = 'Really No!';
      expect(DjQueue.get(queue.id).waiting).to.deep.equal([]);
      queue.maxDjs = 99;
      expect(DjQueue.get(queue.id).maxDjs).to.equal(4);
    });
  });
  describe('get', () => {
    it('should be a function', () => {
      expect(DjQueue.get).to.be.a('function');
    });
    it('should return a DjQueue object by id', () => {
      const queue = DjQueue.create(1);
      expect(DjQueue.get(queue.id)).to.deep.equal(queue);
    });
    it('should return an immutable object', () => {
      const id = DjQueue.create(1).id;
      const queue = DjQueue.get(id);
      queue.active[0] = 'No';
      expect(DjQueue.get(id).active).to.deep.equal([]);
      queue.waiting[0] = 'Really No!';
      expect(DjQueue.get(id).waiting).to.deep.equal([]);
      queue.maxDjs = 99;
      expect(DjQueue.get(id).maxDjs).to.equal(4);
    });
    it('should return null if there is no DjQueue for id', () => {
      expect(DjQueue.get(123)).to.equal(null);
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
    it('should return null if there is no DjQueue for Room id', () => {
      expect(DjQueue.getByRoom(1234)).to.equal(null);
    });
  });
  describe('clearAll', () => {
    it('should reset all models', () => {
      const q1 = DjQueue.create(1);
      const q2 = DjQueue.create(2);
      DjQueue.clearAll();
      expect(DjQueue.get(q1.id)).to.equal(null);
      expect(DjQueue.get(q2.id)).to.equal(null);
      expect(DjQueue.getByRoom(q1.roomId)).to.equal(null);
      expect(DjQueue.getByRoom(q2.roomId)).to.equal(null);
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
    it('should return null if there are no DJs', () => {
      const id = DjQueue.create(1, 4).id;
      expect(DjQueue.next(id)).to.equal(null);
    });
  });
  describe('nextTrack', () => {
    let queue;
    const u1 = 1;
    const u2 = 2;
    const roomId = 1;
    const tracks1 = [
      { songId: 1, duration: 2000 },
      { songId: 2, duration: 1300 },
    ];
    const tracks2 = [
      { songId: 3, duration: 2200 },
      { songId: 4, duration: 1700 },
      { songId: 5, duration: 2300 },
    ];
    let p1;
    let p2;
    beforeEach(() => {
      queue = DjQueue.create(roomId);
      p1 = Playlist.create(u1, tracks1);
      p2 = Playlist.create(u2, tracks2);
    });
    it('should be a function', () => {
      expect(DjQueue.nextTrack).to.be.a('function');
    });
    it('should return null if there is no next track', () => {
      expect(DjQueue.nextTrack(queue.id)).to.equal(null);
    });
    it('should return current DJ\'s next track', () => {
      DjQueue.enqueue(queue.id, u1);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks1[0]);
    });
    it('should set currentTrack to null if there is no next track', () => {
      DjQueue.nextTrack(queue.id);
      const updated = DjQueue.get(queue.id);
      expect(updated.currentTrack).to.equal(null);
    });
    it('should set currentTrack to current DJ\'s next track', () => {
      DjQueue.enqueue(queue.id, u1);
      DjQueue.nextTrack(queue.id);
      const updated = DjQueue.get(queue.id);
      expect(updated.currentTrack).to.deep.equal(tracks1[0]);
    });
    it('should rotate tracks', () => {
      DjQueue.enqueue(queue.id, u1);
      DjQueue.nextTrack(queue.id);
      expect(Playlist.get(p1.id).tracks[0]).to.deep.equal(tracks1[1]);
      DjQueue.nextTrack(queue.id);
      expect(Playlist.get(p1.id).tracks[0]).to.deep.equal(tracks1[0]);
    });
    it('should rotate DJs', () => {
      DjQueue.enqueue(queue.id, u1);
      DjQueue.enqueue(queue.id, u2);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks1[0]);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks2[0]);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks1[1]);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks2[1]);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks1[0]);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks2[2]);
    });
    it('should remove DJs that have empty playlists', () => {
      const u3 = 3;
      Playlist.create(u3); // create an empty playlist
      DjQueue.enqueue(queue.id, u1);
      DjQueue.enqueue(queue.id, u3);
      DjQueue.enqueue(queue.id, u2);
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks1[0]);
      // Should skip u3
      expect(DjQueue.nextTrack(queue.id)).to.deep.equal(tracks2[0]);
      // Should reove u3 from active and waiting
      expect(DjQueue.get(queue.id).active).to.not.include(u3);
      expect(DjQueue.get(queue.id).waiting).to.not.include(u3);
    });
  });
});
