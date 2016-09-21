const chai = require('chai');
const DJ = require('../../../server/models/DJ');
const Playlist = require('../../../server/models/Playlist');

const expect = chai.expect;

/* global describe it after afterEach before beforeEach */

describe('DJ', () => {
  it('should be a function', () => {
    expect(DJ).to.be.a('function');
  });
  it('should return a new DJ instance', () => {
    expect(DJ()).to.be.an('object');
  });
  describe('getDJs', () => {
    it('should be a function', () => {
      expect(DJ().getDJs).to.be.a('function');
    });
    it('should return an empty array if there are no DJs', () => {
      expect(DJ().getDJs()).to.deep.equal([]);
    });
  });
  describe('addToWaiting', () => {
    it('should be a function', () => {
      expect(DJ().addToWaiting).to.be.a('function');
    });
    it('should advance waiting DJs to active if there are empty spots', () => {
      const dj = DJ(1); // set limit to 1
      dj.addToWaiting(1);
      expect(dj.getDJs()).to.deep.equal([1]);
      dj.addToWaiting(2);
      expect(dj.getDJs()).to.deep.equal([1]);
    });
    it('should add dj to waiting queue', () => {
      const dj = DJ(1);
      dj.addToWaiting(1);
      dj.addToWaiting(2);
      expect(dj.getNextWaiting()).to.equal(2);
    });
  });
  describe('getWaiting', () => {
    it('should be a function', () => {
      expect(DJ().getWaiting).to.be.a('function');
    });
    it('should return all users waiting to be DJs in order', () => {
      const dj = DJ(0);
      dj.addToWaiting(1);
      dj.addToWaiting(2);
      dj.addToWaiting(3);
      expect(dj.getWaiting()).to.deep.equal([1, 2, 3]);
    });
  });
  describe('getNextWaiting', () => {
    it('should be a function', () => {
      expect(DJ().getNextWaiting).to.be.a('function');
    });
    it('should remove next waiting DJ from wating queue', () => {
      const dj = DJ(0);
      dj.addToWaiting(1);
      dj.addToWaiting(2);
      expect(dj.getNextWaiting()).to.equal(1);
      expect(dj.getWaiting()).to.deep.equal([2]);
    });
  });
  describe('getNextTrack', () => {
    it('should be a function', () => {
      expect(DJ().getNextTrack).to.be.a('function');
    });
    it('should return null if there are no active djs', () => {
      expect(DJ().getNextTrack()).to.equal(null);
    });
    it('should return current DJ\'s next playlist entry and rotate tracks', () => {
      const userId = 1;
      const list = [{ songId: 12, duration: 134 }, { songId: 15, duration: 121 }];
      const id = Playlist.create(userId, list).id;
      const dj = DJ();
      dj.addToWaiting(userId);
      dj.addToWaiting(2);
      dj.addToWaiting(3);
      expect(dj.getNextTrack()).to.deep.equal({ songId: 12, duration: 134 });
      expect(Playlist.get(id).tracks).to.deep.equal([
        { songId: 15, duration: 121 },
        { songId: 12, duration: 134 },
      ]);
      expect(dj.getDJs()).to.deep.equal([2, 3, 1]);
    });
  });
  describe('removeDJ', () => {
    it('should be a function', () => {
      expect(DJ().removeDJ).to.be.a('function');
    });
    it('should remove DJ from active DJs', () => {
      const dj = DJ(2);
      dj.addToWaiting(1);
      dj.addToWaiting(2);
      expect(dj.getDJs()).to.deep.equal([1, 2]);
      dj.removeDJ(1);
      expect(dj.getDJs()).to.deep.equal([2]);
    });
    it('should advance any waiting DJs and make them active', () => {
      const dj = DJ(3);
      dj.addToWaiting(1);
      dj.addToWaiting(2);
      dj.addToWaiting(3);
      dj.addToWaiting(4);
      expect(dj.getDJs()).to.deep.equal([1, 2, 3]);
      dj.removeDJ(2);
      expect(dj.getDJs()).to.deep.equal([1, 3, 4]);
    });
  });
});
