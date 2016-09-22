const chai = require('chai');
const Connection = require('../../../server/models/Connection');

const expect = chai.expect;

/* global describe it after afterEach before beforeEach */

describe('Connection', () => {
  afterEach('reset Models', () => {
    Connection.clearAll();
  });
  describe('register', () => {
    it('should be a function', () => {
      expect(Connection.register).to.be.a('function');
    });
  });
  describe('getUserId', () => {
    it('should be a function', () => {
      expect(Connection.getUserId).to.be.a('function');
    });
    it('should return associated User\'s id', () => {
      const userId = 1;
      const socket = { id: 2 };
      Connection.register(userId, socket);
      expect(Connection.getUserId(socket)).to.equal(userId);
    });
  });
  describe('getSockets', () => {
    it('should be a function', () => {
      expect(Connection.getSockets).to.be.a('function');
    });
    it('should return an empty array if a user has no connections', () => {
      expect(Connection.getSockets(1)).to.deep.equal([]);
    });
    it('should return an array of all registered sockets for a user', () => {
      const userId = 1;
      const socket1 = 'socket1';
      const socket2 = 'socket2';
      const socket3 = 'socket3';
      Connection.register(userId, socket1);
      Connection.register(userId, socket2);
      Connection.register(userId, socket3);
      expect(Connection.getSockets(userId)).to.deep.equal([socket1, socket2, socket3]);
    });
  });
  describe('remove', () => {
    it('should be a function', () => {
      expect(Connection.remove).to.be.a('function');
    });
    it('should remove a connected socket', () => {
      const userId = 1;
      const socket1 = { id: 1 };
      const socket2 = { id: 2 };
      Connection.register(userId, socket1);
      Connection.register(userId, socket2);
      Connection.remove(socket1);
      expect(Connection.getSockets(userId)).to.deep.equal([socket2]);
    });
  });
  describe('send', () => {
    it('should be a function', () => {
      expect(Connection.send).to.be.a('function');
    });
    it('should emit event with data to all of a user\'s sockets', () => {
      let called = 2;
      const userId = 1;
      const socket1 = { id: 1, emit: () => { called -= 1; } };
      const socket2 = { id: 2, emit: () => { called -= 1; } };
      Connection.register(userId, socket1);
      Connection.register(userId, socket2);
      Connection.send(userId, 'event', {});
      expect(called).to.equal(0);
    });
  });
  describe('sendAll', () => {
    it('should be a function', () => {
      expect(Connection.sendAll).to.be.a('function');
    });
    it('should emit event "room" with data to all registered sockets', () => {
      let called = 2;
      const u1 = 1;
      const u2 = 2;
      const socket1 = { id: 1, emit: () => { called -= 1; } };
      const socket2 = { id: 2, emit: () => { called -= 1; } };
      Connection.register(u1, socket1);
      Connection.register(u2, socket2);
      Connection.sendAll('event', {});
      expect(called).to.equal(0);
    });
  });
});
