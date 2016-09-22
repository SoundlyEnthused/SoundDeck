const MvpAPI = require('../../../server/apis/MvpAPI');
const Connection = require('../../../server/models/Connection');
const chai = require('chai');

const expect = chai.expect;

/* global xdescribe xit describe it after afterEach before beforeEach */
describe('MvpAPI', () => {
  let sent = [];
  let roomId;
  const ConnectionSend = Connection.send;
  beforeEach('create Connection mock', () => {
    Connection.send = (userId, eventName, data) => {
      sent.push({ userId, eventName, data });
    };
  });
  beforeEach('Create initial app state', () => {
    roomId = MvpAPI.createRoom('Jazz').id;
  });
  afterEach('Reset models', () => {
    MvpAPI.clearAll();
    Connection.clearAll();
    sent = [];
  });
  after('set Connection.send back', () => {
    Connection.send = ConnectionSend;
  });
  xdescribe('room', () => {
    xit('should receive initial app state on connection', (done) => {
    });
    xit('should receive app state when rooms are created', (done) => {
    });
    xit('should share state between multiple clients', (done) => {
    });
  });
  describe('login', () => {
    it('should be a function', () => {
      expect(MvpAPI.login).to.be.a('function');
    });
    it('Expects a socket, and an id (soundcloudId) and sends back same id', () => {
      const socket = { id: 1 };
      const userId = 2;
      MvpAPI.login(socket, { id: userId });
      const msg = sent.shift();
      expect(msg).to.deep.equal({ userId, eventName: 'login', data: { id: userId } });
    });
    it('should send inital app state to user', () => {
      const socket = { id: 1 };
      const userId = 2;
      MvpAPI.login(socket, { id: userId });
      let msg = sent.shift();
      expect(msg).to.deep.equal({ userId, eventName: 'login', data: { id: userId } });
      msg = sent.shift();
      expect(msg.eventName).to.equal('room');
      expect(msg.data).to.be.an('object');
    });
  });
  describe('createRoom', () => {
    it('should be a function', () => {
      expect(MvpAPI.createRoom).to.be.a('function');
    });
    it('should create a Room and DjQueue and return the Room', () => {
      const room = MvpAPI.createRoom('Bluegrass');
      expect(room.name).to.equal('Bluegrass');
      expect(room.id).to.be.a('number');
    });
  });
  describe('sendState', () => {
    it('should be a function', () => {
      expect(MvpAPI.sendState).to.be.a('function');
    });
    it('should send an object representing the state of all rooms', () => {
      const socket = { id: 1 };
      const userId = 2;
      MvpAPI.login(socket, { id: userId });
      // Swallow login event
      sent.pop();
      MvpAPI.sendState();
      const msg = sent.pop();
      const state = msg.data;
      // Should have emitted room event
      expect(msg.eventName).to.equal('room');
      expect(state).to.be.an('object');
      const roomState = state[roomId];
      expect(roomState).to.be.an('object');
      expect(roomState.users).to.be.an('array');
      expect(roomState.djs).to.be.an('array');
    });
  });
  xdescribe('join', () => {
    it('should add user to room and send updated state', () => {
      const socket = { id: 1 };
      const userId = 12;
      MvpAPI.login(socket, { id: userId });
      MvpAPI.join(socket, { roomId });
      // const join = MvpAP
    });
    it('should move a user to another room if they are in one already', (done) => {
      const socket = { id: 1 };
      const userId = 12;
      MvpAPI.login(socket, { id: userId });
      MvpAPI.join(socket, { roomId });
      const room2Id = MvpAPI.createRoom('Punk').id;
      MvpAPI.join(socket, { roomId: room2Id });
    });
  });
});
