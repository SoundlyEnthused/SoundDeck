const chai = require('chai');
const Playlist = require('../../../server/models/Playlist');

const expect = chai.expect;

/* global describe it after afterEach before beforeEach */

describe('Playlist', () => {
  afterEach('reset all models', () => {
    Playlist.clearAll();
  });
  describe('create', () => {
    it('should be a function', () => {
      expect(Playlist.create).to.be.a('function');
    });
    it('should return a new Playlist instance', () => {
      const userId = 1;
      const playlist = Playlist.create(userId);
      expect(playlist.id).to.be.a('number');
      expect(playlist.tracks).to.deep.equal([]);
    });
    it('should optionally allow an initial playlist to be set', () => {
      const userId = 1;
      const list = [{ songId: 12, duration: 1 }];
      const playlist = Playlist.create(userId, list);
      expect(playlist.id).to.be.a('number');
      expect(playlist.tracks).to.deep.equal(list);
    });
    it('should return an immutable object', () => {
      const userId = 12;
      const playlist = Playlist.create(userId, [{ songId: 1, duration: 1000 }]);
      playlist.tracks.push('No!');
      expect(Playlist.get(playlist.id).tracks).to.deep.equal([{ songId: 1, duration: 1000 }]);
      playlist.tracks[0].songId = 'Bummer';
      expect(Playlist.get(playlist.id).tracks[0].songId).to.equal(1);
    });
  });
  describe('get', () => {
    it('should be a function', () => {
      expect(Playlist.get).to.be.a('function');
    });
    it('should return an empty array for a new user\'s playlist.tracks', () => {
      const userId = 1;
      const id = Playlist.create(userId).id;
      const playlist = Playlist.get(id);
      expect(playlist.tracks).to.deep.equal([]);
    });
    it('should return an immutable object', () => {
      const userId = 12;
      const id = Playlist.create(userId, [{ songId: 1, duration: 1000 }]).id;
      const playlist = Playlist.get(id);
      playlist.tracks.push('No!');
      expect(Playlist.get(id).tracks).to.deep.equal([{ songId: 1, duration: 1000 }]);
      playlist.tracks[0].songId = 'Bummer';
      expect(Playlist.get(id).tracks[0].songId).to.equal(1);
    });
    it('should return null if there is no playlist for a given id', () => {
      expect(Playlist.get(1337)).to.equal(null);
    });
  });
  describe('getByUserId', () => {
    it('should be a function', () => {
      expect(Playlist.getByUserId).to.be.a('function');
    });
    it('should return playlist associated with a user ID', () => {
      const userId = 1000;
      const list = [{ songId: 17, duration: 2000 }];
      Playlist.create(userId, list); // Association is made on create
      const playlist = Playlist.getByUserId(userId);
      expect(playlist.tracks).to.deep.equal(list);
      expect(playlist.userId).to.equal(userId);
      expect(playlist.id).to.be.a('number');
    });
    it('should return an immutable object', () => {
      const userId = 12;
      Playlist.create(userId, [{ songId: 1, duration: 1000 }]);
      const playlist = Playlist.getByUserId(userId);
      playlist.tracks.push('No!');
      expect(Playlist.getByUserId(userId).tracks).to.deep.equal([{ songId: 1, duration: 1000 }]);
      playlist.tracks[0].songId = 'Bummer';
      expect(Playlist.getByUserId(userId).tracks[0].songId).to.equal(1);
    });
    it('should return null if there is no Playlist for this user', () => {
      expect(Playlist.getByUserId(12345)).to.equal(null);
    });
  });
  describe('update', () => {
    it('should be function', () => {
      expect(Playlist.update).to.be.a('function');
    });
    it('should update a specific user\'s playlist', () => {
      const userId = 17;
      const id = Playlist.create(userId).id;
      const list = [{ songId: 1, duration: 100 }, { songId: 2, duration: 200 }];
      Playlist.update(id, list);
      const playlist = Playlist.get(id);
      expect(playlist.tracks).to.deep.equal(list);
      expect(playlist.userId).to.equal(userId);
    });
  });
  describe('rotate', () => {
    it('should be function', () => {
      expect(Playlist.rotate).to.be.a('function');
    });
    it('should move the top track to the bottom', () => {
      const userId = 1;
      const id = Playlist.create(userId).id;
      const list = [
        { songId: 1, duration: 100 },
        { songId: 2, duration: 200 },
        { songId: 3, duration: 150 },
      ];
      Playlist.update(id, list);
      expect(Playlist.get(id).tracks).to.deep.equal(list);
      Playlist.rotate(id);
      expect(Playlist.get(id).tracks).to.deep.equal([
        { songId: 2, duration: 200 },
        { songId: 3, duration: 150 },
        { songId: 1, duration: 100 },
      ]);
    });
    it('should work with empty playlists', () => {
      const userId = 7;
      const id = Playlist.create(userId).id;
      Playlist.rotate(id);
      expect(Playlist.get(id).tracks).to.deep.equal([]);
    });
  });
});
