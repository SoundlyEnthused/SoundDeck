const MvpAPI = require('../../../server/apis/MvpAPI');
const Connection = require('../../../server/models/Connection');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

/* global xdescribe xit describe it after afterEach before beforeEach */
describe('MvpAPI', () => {
  let sent = [];
  const ConnectionSend = Connection.send;
  const setTest = function setTest(callback) {
    Connection.send = (userId, eventName, data) => {
      sent.push({ userId, eventName, data });
      callback();
    };
  };
  before('create Connection mock', () => {

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
      setTest(() => {
        const msg = sent.shift();
        expect(msg).to.deep.equal({ userId, eventName: 'login', data: { id: userId } });
      });
      MvpAPI.login(socket, { id: userId });
    });
    it('should send inital app state to user', () => {
      const socket = { id: 1 };
      const userId = 2;
      setTest(() => {
        let msg = sent.shift();
        expect(msg).to.deep.equal({ userId, eventName: 'login', data: { id: userId } });
        msg = sent.shift();
        expect(msg.eventName).to.equal('room');
        expect(msg.data).to.be.an('object');
      });
      MvpAPI.login(socket, { id: userId });
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
  describe('userCreateRoom', () => {
    it('should be a function', () => {
      expect(MvpAPI.userCreateRoom).to.be.a('function');
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
      expect(MvpAPI.getState()).to.eventually.be.an('object');
    });
    it('should return an object of objects, one for each room', () => {
      MvpAPI.getState().then((state) => {
        expect(Object.keys(state).length).to.equal(2);
      });
    });
    it('should return object of objects indexed by room IDs', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id]).to.be.an('object');
        expect(state[room2.id]).to.be.an('object');
      });
    });
    it('should return object of objects with .name properties', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].name).to.equal(room1.name);
        expect(state[room2.id].name).to.equal(room2.name);
      });
    });
    it('should return object of objects with .djs arrays', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].djs).to.be.an('array');
        expect(state[room2.id].djs).to.be.an('array');
      });
    });
    it('should return object of objects with .users array', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].users).to.be.an('array');
        expect(state[room2.id].users).to.be.an('array');
      });
    });
    it('should return object of objects with .djMaxNum property', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].djMaxNum).to.be.an('number');
        expect(state[room1.id].djMaxNum).to.be.an(4);
      });
    });
    it('should return object of objects with .currentDj property', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].currentDj).not.to.equal(undefined);
      });
    });
    it('should return object of objects with .track property', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].track).not.to.equal(undefined);
      });
    });
    it('should return oboject of objects with a .timeStamp propert', () => {
      MvpAPI.getState().then((state) => {
        expect(state[room1.id].timeStamp).not.to.equal(undefined);
      });
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
      setTest(() => {
        expect(sent.length).to.equal(2);
        expect(sent[0].eventName).to.equal('room');
      });
      MvpAPI.enqueue(socket1);
    });
    it('should make a user an active dj if there are spots available', () => {
      setTest(() => {
        const state = sent[0].data;
        expect(state[room.id].djs[0].id).to.equal(user1);
        expect(state[room.id].djs[1]).to.equal(null);
        expect(state[room.id].djs[2]).to.equal(null);
        expect(state[room.id].djs[3]).to.equal(null);
      });
      MvpAPI.enqueue(socket1);
    });
    it('should do and send nothing if user is not logged in', () => {
      // Create a dummy socket that is not registered
      const unregisteredSocket = { id: 78969 };
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.enqueue(unregisteredSocket);
    });
    it('should do and send nothing if user is not in a Room', () => {
      const userId3 = 12;
      const socket3 = { id: 78969 };
      setTest(() => {
        sent = [];
      });
      MvpAPI.login(socket3, { id: userId3 });
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.enqueue(socket3);
    });
  });
  describe('dequeue', () => {
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
      expect(MvpAPI.dequeue).to.be.a('function');
    });
    it('should send a room event with updated state', () => {
      setTest(() => {
        sent = [];
      });
      MvpAPI.enqueue(socket1);
      setTest(() => {
        expect(sent.length).to.equal(2);
        expect(sent[0].eventName).to.equal('room');
        expect(sent[0].data).to.be.an('object');
      });
      MvpAPI.dequeue(socket1);
    });
    it('should remove a user from active DJ queue', () => {
      let msg = null;
      setTest(() => {
        sent = []; // clear sent messages
      });
      MvpAPI.enqueue(socket1);
      setTest(() => {
        msg = sent[0];
        expect(msg.data[room.id].djs[0].id).to.equal(user1);
        expect(msg.data[room.id].djs[1].id).to.equal(user2);
        sent = []; // clear sent messages
      });
      MvpAPI.enqueue(socket2);
      setTest(() => {
        msg = sent[0];
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room.id].djs[0]).to.equal(null);
        expect(msg.data[room.id].djs[1].id).to.equal(user2);
      });
      MvpAPI.dequeue(socket1);
    });
    it('should do and send nothing if user is not logged in', () => {
      // Create a dummy socket that is not registered
      const unregisteredSocket = { id: 78969 };
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.dequeue(unregisteredSocket);
    });
    it('should do and send nothing if user is not in a Room', () => {
      const userId3 = 12;
      const socket3 = { id: 78969 };
      setTest(() => {
        sent = [];
      });
      MvpAPI.login(socket3, { id: userId3 });
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.dequeue(socket3);
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
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.join(unregisteredSocket, { roomId: room1.id });
    });
    it('should send updated state to all users', () => {
      setTest(() => {
        // There should be a message for both logged in users
        expect(sent.length).to.equal(2);
        const msg1 = sent.shift();
        expect(msg1.eventName).to.equal('room');
        const msg2 = sent.shift();
        expect(msg1.data).to.deep.equal(msg2.data);
      });
      MvpAPI.join(socket1, { roomId: room1.id });
    });
    it('should join a room', () => {
      let msg = null;
      let users = null;
      setTest(() => {
        msg = sent.shift();
        users = (msg.data[room2.id].users);
        expect(users.length).to.equal(1);
        expect(users[0].id).to.equal(user1);
        sent = [];
      });
      MvpAPI.join(socket1, { roomId: room2.id });

      setTest(() => {
        msg = sent.shift();
        users = (msg.data[room2.id].users);
        expect(users.length).to.equal(2);
      });
      MvpAPI.join(socket2, { roomId: room2.id });
    });
    it('should move a user to another room if they are in one already', () => {
      let msg = null;
      setTest(() => {
        msg = sent.shift();
        expect(msg.data[room1.id].users.length).to.equal(0);
        expect(msg.data[room2.id].users.length).to.equal(1);
        sent = [];
      });
      MvpAPI.join(socket1, { roomId: room2.id });

      setTest(() => {
        msg = sent.shift();
        expect(msg.data[room1.id].users.length).to.equal(1);
        expect(msg.data[room2.id].users.length).to.equal(0);
      });
      MvpAPI.join(socket1, { roomId: room1.id });
    });
    it('should remove a user from the DjQueue if they join another room', () => {
      setTest(() => {
        sent = [];
      });
      MvpAPI.join(socket1, { roomId: room2.id });

      let msg = null;
      setTest(() => {
        msg = sent.pop();
        expect(msg.data[room2.id].djs[0].id).to.equal(user1);
        sent = [];
      });
      MvpAPI.enqueue(socket1);
      setTest(() => {
        msg = sent.pop();
        expect(msg.data[room2.id].djs[0]).to.equal(null);
      });
      MvpAPI.join(socket1, { roomId: room1.id });
    });
  });
  describe('disconnect', () => {
    it('should be a function', () => {
      expect(MvpAPI.disconnect).to.be.a('function');
    });
    it('should remove user from room when all connections are closed', () => {
      const room = MvpAPI.createRoom('Metal');
      const socket1 = { id: 1 };
      const socket2 = { id: 2 };
      const socket3 = { id: 3 };
      const userId1 = 22;
      const userId2 = 23;
      let msg = null;
      setTest(() => {
        msg = sent.pop(); // get last message
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room.id].users.length).to.equal(1);
        sent = []; // clear sent messages
      });
      MvpAPI.login(socket1, { id: userId1 });
      MvpAPI.login(socket2, { id: userId1 });
      // Need a second user to watch for changes when first one leaves!
      MvpAPI.login(socket3, { id: userId2 });
      // Doesn't matter which socket joins Room
      MvpAPI.join(socket1, { roomId: room.id });
      setTest(() => {
        expect(sent.length).to.equal(0); // Should be no update as 1 socket still connects user
      });
      MvpAPI.disconnect(socket1);
      setTest(() => {
        expect(sent.length).to.equal(1);
        msg = sent.pop();
        expect(msg.data[room.id].users.length).to.equal(0);
      });
      MvpAPI.disconnect(socket2);
    });
    it('should do and send nothing if socket is unregistered', () => {
      const socket1 = { id: 1 };
      const socket2 = { id: 2 };
      const userId = 22;
      setTest(() => {
        sent = []; // clear all messages
      });
      MvpAPI.login(socket1, { id: userId });
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.disconnect(socket2);
    });
    it('should do and send nothing if user disconnects without joining a room', () => {
      const socket1 = { id: 1 };
      const socket2 = { id: 2 };
      const userId1 = 22;
      const userId2 = 23;
      MvpAPI.login(socket1, { id: userId1 });
      setTest(() => {
        sent = []; // clear all messages
      });
      MvpAPI.login(socket2, { id: userId2 });
      setTest(() => {
        expect(sent.length).to.equal(0);
      });
      MvpAPI.disconnect(socket2);
    });
    it('should remove user from DjQueue on disconnect', () => {
      const room = MvpAPI.createRoom('Sludge');
      const socket1 = { id: 1 };
      const socket2 = { id: 2 };
      const userId1 = 22;
      const userId2 = 23;
      MvpAPI.login(socket1, { id: userId1 });
      MvpAPI.login(socket2, { id: userId2 });
      MvpAPI.join(socket1, { roomId: room.id });
      MvpAPI.join(socket2, { roomId: room.id });
      setTest(() => {
        sent = []; // clear sent messages
      });
      MvpAPI.enqueue(socket1);
      setTest(() => {
        expect(msg.data[room.id].djs[0].id).to.equal(userId1);
        expect(msg.data[room.id].djs[1].id).to.equal(userId2);
        sent = []; // clear sent messages
      });
      MvpAPI.enqueue(socket2);
      let msg = sent.pop();
      setTest(() => {
        msg = sent.pop();
        expect(msg.data[room.id].djs[0]).to.equal(null);
        expect(msg.data[room.id].djs[1].id).to.equal(userId2);
      });
      MvpAPI.disconnect(socket1);
    });
  });
  describe('updatePlaylist', () => {
    const socket = { id: 2 };
    const userId = 22;
    beforeEach(() => {
      MvpAPI.login(socket, { id: userId });
      sent = [];
    });
    it('should be a function', () => {
      expect(MvpAPI.updatePlaylist).to.be.a('function');
    });
    it('should create a Playlist for the user if one does not exist', () => {
      MvpAPI.updatePlaylist(socket, [{ songId: 12, duration: 1000 }]);
      setTest(() => {
        MvpAPI.getPlaylist(socket);
        const msg = sent.pop();
        expect(msg.eventName).to.equal('playlist');
        expect(msg.data).to.deep.equal([{ songId: 12, duration: 1000 }]);
      });
    });
    it('should update an existing Playlist', () => {
      MvpAPI.updatePlaylist(socket, [{ songId: 12, duration: 1000 }]);
      MvpAPI.updatePlaylist(socket, [{ songId: 12, duration: 1000 },
        { songId: 14, duration: 2000 }]);
      setTest(() => {
        const msg = sent.pop();
        expect(msg.data).to.deep.equal([{ songId: 12, duration: 1000 },
        { songId: 14, duration: 2000 }]);
      });
      MvpAPI.getPlaylist(socket);
    });
  });
  describe('getPlaylist', () => {
    it('should be a function', () => {
      expect(MvpAPI.getPlaylist).to.be.a('function');
    });
    it('should send an empty array if the user has no Playlist', () => {
      const socket = { id: 2 };
      const userId = 22;
      setTest(() => {

      });
      MvpAPI.login(socket, { id: userId });
      sent = [];
      setTest(() => {
        const msg = sent.pop();
        expect(msg.eventName).to.equal('playlist');
        expect(msg.data).to.deep.equal([]);
      });
      MvpAPI.getPlaylist(socket);
    });
  });
  describe('sendNextTrack', () => {
    let room1;
    let room2;
    const user1 = 22;
    const user2 = 23;
    let socket1;
    let socket2;
    const tracks1 = [{ songId: 1, duration: 1000 }, { songId: 2, duration: 2000 }];
    const tracks2 = [{ songId: 3, duration: 3000 }, { songId: 4, duration: 4000 }];
    beforeEach('Create state to test', () => {
      // Create a Room to test
      room1 = MvpAPI.createRoom('Metal');
      room2 = MvpAPI.createRoom('Punk');
      // Create two users for tests
      socket1 = { id: 1 };
      socket2 = { id: 2 };
      // Log those users in
      MvpAPI.login(socket1, { id: user1 });
      MvpAPI.login(socket2, { id: user2 });
      // Join Metal Room
      MvpAPI.join(socket1, { roomId: room1.id });
      MvpAPI.join(socket2, { roomId: room1.id });
      // Create playlists
      MvpAPI.updatePlaylist(socket1, tracks1);
      MvpAPI.updatePlaylist(socket2, tracks2);
      // Become djs
      MvpAPI.enqueue(socket1);
      MvpAPI.enqueue(socket2);
      // clear sent so that no login messages remain for easier testing
      sent = [];
    });
    it('should be a function', () => {
      expect(MvpAPI.sendNextTrack).to.be.a('function');
    });
    it('should not update track if there is no next track', () => {
      setTest(() => {
        const msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room2.id].track).to.equal(null);
      });
      MvpAPI.sendNextTrack(room2.id);
    });
    it('should send updated timeStamp of when track started + trackDelay', () => {
      setTest(() => {
        const msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room1.id].timeStamp).to.be.closeTo(Date.now() + MvpAPI.trackDelay, 100);
      });
      MvpAPI.sendNextTrack(room1.id);
    });
    it('should send the next track from current DJ\'s playlist', () => {
      let msg = null;
      setTest(() => {
        msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room1.id].track).to.equal(tracks1[0].songId);
      });
      MvpAPI.sendNextTrack(room1.id);

      // Grab track from next DJ
      sent = [];
      setTest(() => {
        msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room1.id].track).to.equal(tracks2[0].songId);
      // Test rotation
        sent = [];
      });
      MvpAPI.sendNextTrack(room1.id);

      setTest(() => {
        msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room1.id].track).to.equal(tracks1[1].songId);
      });
      MvpAPI.sendNextTrack(room1.id);
    });
    xit('should allow dj\'s to leave the queue and maintain order', () => {
      let msg = null;
      setTest(() => {
        msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room1.id].track).to.equal(tracks1[0].songId);
      });
      MvpAPI.sendNextTrack(room1.id);

      setTest(() => {
        sent = [];
      });
      MvpAPI.dequeue(socket2);
      // Grab track from next DJ

      setTest(() => {
        msg = sent.pop();
        expect(msg.eventName).to.equal('room');
        expect(msg.data[room1.id].track).to.equal(tracks1[1].songId);
      });
      MvpAPI.sendNextTrack(room1.id);

      // Test addition
    });
    it('should send rotated playlist to the current DJ', () => {
      // TODO fix string issue for IDs?
      // Grab track from first DJ
      let msg = null;
      setTest(() => {
        msg = sent.shift();
        expect(msg).to.not.equal(undefined);
        expect(msg.userId).to.equal(user1);
        expect(msg.eventName).to.equal('playlist');
        expect(msg.data).to.deep.equal([{ songId: 2, duration: 2000 },
        { songId: 1, duration: 1000 }]);
        sent = [];
      });
      MvpAPI.sendNextTrack(room1.id);
      // let msg = sent.find(m => m.eventName === 'playlist');

      // Grab track from second DJ
      setTest(() => {
        msg = sent.shift();
        expect(msg.userId).to.equal(user2);
        expect(msg.eventName).to.equal('playlist');
        expect(msg.data).to.deep.equal([{ songId: 4, duration: 4000 },
        { songId: 3, duration: 3000 }]);
      // Make sure that we can loop DJs
        sent = [];
      });
      MvpAPI.sendNextTrack(room1.id);

      setTest(() => {
        msg = sent.shift();
        expect(msg.userId).to.equal(user1);
        expect(msg.eventName).to.equal('playlist');
        expect(msg.data).to.deep.equal([{ songId: 1, duration: 1000 },
        { songId: 2, duration: 2000 }]);
        sent = [];
      });
      MvpAPI.sendNextTrack(room1.id);
    });
  });
});
