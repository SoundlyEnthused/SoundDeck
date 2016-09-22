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
  describe('enqueue', () => {
    let room;
    const user1 = 22;
    const user2 = 23;
    let socket1;
    let socket2;
    beforeEach('Create state to test', () => {
      // There is an additional Room from outer beforeEach
      // Create a Room to test
      room = MvpAPI.createRoom('Metal');
      // Create two users for tests
      socket1 = { id: 1 };
      socket2 = { id: 2 };
      // Log those users in
      MvpAPI.login(socket1, { id: user1 });
      MvpAPI.login(socket2, { id: user2 });
      // Join Metal Room
      MvpAPI.join(socket1, { roomId: room.id });
      MvpAPI.join(socket2, { roomId: room.id });
      // clear sent so that no login messages remain for easier testing
      sent = [];
    });
    it('should be a function', () => {
      expect(MvpAPI.enqueue).to.be.a('function');
    });
    it('should send updated state to all users', () => {
      MvpAPI.enqueue(socket1);
      expect(sent.length).to.equal(2);
      expect(sent[0].eventName).to.equal('room');
    });
    it('should make a user an active dj if there are spots available', () => {
      MvpAPI.enqueue(socket1);
      const state = sent[0].data;
      expect(state[room.id].djs.length).to.equal(1);
      expect(state[room.id].djs[0].id).to.equal(user1);
    });
    it('should do and send nothing if user is not logged in', () => {
      // Create a dummy socket that is not registered
      const unregisteredSocket = { id: 78969 };
      MvpAPI.enqueue(unregisteredSocket);
      expect(sent.length).to.equal(0);
    });
  });
  describe('join', () => {
    let room1;
    let room2;
    const user1 = 22;
    const user2 = 23;
    let socket1;
    let socket2;
    beforeEach('Create state to test', () => {
      // There is an additional Room from outer beforeEach
      // Create some Rooms to test
      room1 = MvpAPI.createRoom('Metal');
      room2 = MvpAPI.createRoom('Industrial');
      // Create two users for tests
      socket1 = { id: 1 };
      socket2 = { id: 2 };
      // Log those users in
      MvpAPI.login(socket1, { id: user1 });
      MvpAPI.login(socket2, { id: user2 });
      // clear sent so that no login messages remain for easier testing
      sent = [];
    });
    it('should be a function', () => {
      expect(MvpAPI.join).to.be.a('function');
    });
    it('should do and send nothing is user is not logged in', () => {
      // Create a dummy socket that is not registered
      const unregisteredSocket = { id: 78969 };
      MvpAPI.join(unregisteredSocket, { roomId: room1.id });
      expect(sent.length).to.equal(0);
    });
    it('should send updated state to all users', () => {
      MvpAPI.join(socket1, { roomId: room1.id });
      // There should be a message for both logged in users
      expect(sent.length).to.equal(2);
      const msg1 = sent.shift();
      expect(msg1.eventName).to.equal('room');
      const msg2 = sent.shift();
      expect(msg1.data).to.deep.equal(msg2.data);
    });
    it('should join a room', () => {
      MvpAPI.join(socket1, { roomId: room2.id });
      let msg = sent.shift();
      let users = (msg.data[room2.id].users);
      expect(users.length).to.equal(1);
      expect(users[0].id).to.equal(user1);
      sent = [];
      MvpAPI.join(socket2, { roomId: room2.id });
      msg = sent.shift();
      users = (msg.data[room2.id].users);
      expect(users.length).to.equal(2);
    });
    it('should move a user to another room if they are in one already', () => {
      MvpAPI.join(socket1, { roomId: room2.id });
      let msg = sent.shift();
      expect(msg.data[room1.id].users.length).to.equal(0);
      expect(msg.data[room2.id].users.length).to.equal(1);
      sent = [];
      MvpAPI.join(socket1, { roomId: room1.id });
      msg = sent.shift();
      expect(msg.data[room1.id].users.length).to.equal(1);
      expect(msg.data[room2.id].users.length).to.equal(0);
    });
  });
});
