const MvpAPI = require('../../../server/apis/MvpAPI');
const Connection = require('../../../server/models/Connection');
const chai = require('chai');

const expect = chai.expect;

/* global xdescribe xit describe it after afterEach before beforeEach */
describe('MvpAPI', () => {
  let sent = [];
  const ConnectionSend = Connection.send;
  beforeEach('create Connection mock', () => {
    Connection.send = (userId, eventName, data) => {
      sent.push({ userId, eventName, data });
    };
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
  describe('getState', () => {
    let room1;
    let room2;
    beforeEach('Create state to test', () => {
      // There is an additional Room from outer beforeEach
      // Create some Rooms to test
      room1 = MvpAPI.createRoom('Metal');
      room2 = MvpAPI.createRoom('Industrial');
      // Create a user to test
      const socket = { id: 1 };
      const userId = 12;
      MvpAPI.login(socket, { id: userId });
    });
    it('should be a function', () => {
      expect(MvpAPI.getState).to.be.a('function');
    });
    it('should return an object representing the state of the App', () => {
      expect(MvpAPI.getState()).to.be.an('object');
    });
    it('should return an object of objects, one for each room', () => {
      expect(Object.keys(MvpAPI.getState()).length).to.equal(2);
    });
    it('should return object of objects indexed by room IDs', () => {
      expect(MvpAPI.getState()[room1.id]).to.be.an('object');
      expect(MvpAPI.getState()[room2.id]).to.be.an('object');
    });
    it('should return object of objects with .name properties', () => {
      expect(MvpAPI.getState()[room1.id].name).to.equal(room1.name);
      expect(MvpAPI.getState()[room2.id].name).to.equal(room2.name);
    });
    it('should return object of objects with .djs arrays', () => {
      expect(MvpAPI.getState()[room1.id].djs).to.be.an('array');
      expect(MvpAPI.getState()[room2.id].djs).to.be.an('array');
    });
    it('should return object of objects with .users array', () => {
      expect(MvpAPI.getState()[room1.id].users).to.be.an('array');
      expect(MvpAPI.getState()[room2.id].users).to.be.an('array');
    });
    it('should return object of objects with .djMaxNum property', () => {
      expect(MvpAPI.getState()[room1.id].djMaxNum).to.be.a('number');
      expect(MvpAPI.getState()[room1.id].djMaxNum).to.equal(4);
    });
    it('should return object of objects with .currentDj property', () => {
      expect(MvpAPI.getState()[room1.id].currentDj).not.to.equal(undefined);
    });
    it('should return object of objects with .track property', () => {
      expect(MvpAPI.getState()[room1.id].track).not.to.equal(undefined);
    });
  });
  xdescribe('join', () => {
    it('should add user to room and send updated state', () => {

    });
    it('should move a user to another room if they are in one already', (done) => {

    });
  });
});
