const chai = require('chai');
const MVPAPI = require('../../../server/apis/MVPAPI');
const MVP = require('../../../server/models/MVP');
const createServer = require('../../test_socket_server');
const socketClient = require('socket.io-client');
// const Room = require('../../../server/models/Room');

const expect = chai.expect;

/* global describe it after afterEach before beforeEach */
describe('MVP API', () => {
  let server;
  const port = process.env.PORT;

  const url = `http://127.0.0.1:${port}`;
  before('Start server', (done) => {
    server = createServer(port, [MVPAPI], done);
  });

  after('Stop server', () => {
    server.close();
  });

  afterEach('Reset models', () => {
    MVP.reset();
  });

  describe('room', () => {
    it('should receive initial app state on connection', (done) => {
      const client = socketClient.connect(url);
      client.on('room', (state) => {
        expect(state).to.be.an('object');
        client.disconnect();
        done();
      });
    });
    it('should receive app state when rooms are created', (done) => {
      const client = socketClient.connect(url);
      // initial message from connection
      client.once('room', () => {
        // create a room
        const room = MVP.create('Trance');
        client.on('room', (state) => {
          expect(state[room.id]).to.be.an('object');
          expect(state[room.id].name).to.equal('Trance');
          client.disconnect();
          done();
        });
      });
    });
    it('should share state between multiple clients', (done) => {
      const room = MVP.create('Shoegaze');
      const client1 = socketClient.connect(url);
      client1.emit('login', { id: 1 });
      client1.once('login', () => {
        client1.emit('join', { roomId: room.id });
        client1.once('room', (state1) => {
          expect(state1[room.id].users).to.deep.equal([1]);
          const client2 = socketClient.connect(url);
          client2.once('room', (state2) => {
            expect(state2[room.id].users).to.deep.equal([1]);
            client1.disconnect();
            client2.disconnect();
            done();
          });
        });
      });
    });
  });
  describe('login', () => {
    it('should associate a soundcloud id with a socket session', (done) => {
      const client = socketClient.connect(url);
      const soundcloudId = 1;
      client.emit('login', { id: soundcloudId });
      client.once('login', (data) => {
        expect(data.id).to.equal(soundcloudId);
        done();
      });
    });
  });
  describe('join', () => {
    it('should add user to room and send updated state', (done) => {
      // create a Room
      const room = MVP.create('Jazz');
      const client = socketClient.connect(url);
      client.emit('login', { id: 1337 });
      // Initial connection event
      client.once('room', () => {
        client.emit('join', { roomId: room.id });
        client.on('room', (appState) => {
          expect(appState[room.id].users).to.deep.equal([1337]);
          client.disconnect();
          done();
        });
      });
    });
    it('should move a user to another room if they are in one already', (done) => {
      // create a Room
      const room1 = MVP.create('Classical');
      const room2 = MVP.create('Techno');
      const client = socketClient.connect(url);
      client.emit('login', { id: 1337 });
      // Initial connection event
      client.once('room', () => {
        client.emit('join', { roomId: room1.id });
        client.once('room', (state1) => {
          expect(state1[room1.id].users).to.deep.equal([1337]);
          expect(state1[room2.id].users).to.deep.equal([]);
          client.emit('join', { userId: 1337, roomId: room2.id });
          client.once('room', (state2) => {
            expect(state2[room1.id].users).to.deep.equal([]);
            expect(state2[room2.id].users).to.deep.equal([1337]);
            client.disconnect();
            done();
          });
        });
      });
    });
  });
});
