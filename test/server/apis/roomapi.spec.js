const chai = require('chai');
const RoomAPI = require('../../../server/apis/RoomAPI');
const createServer = require('../../test_socket_server');
const socketClient = require('socket.io-client');
const Room = require('../../../server/models/Room');

const expect = chai.expect;

/* global describe it after afterEach before beforeEach */
describe('RoomAPI', () => {
  let server;
  // let client;
  const url = `http://127.0.0.1:${process.env.PORT}`;
  before('Start server', (done) => {
    server = createServer(process.env.PORT, [RoomAPI], done);
  });

  // beforeEach('Start client', (done) => {
  //   client = socketClient.connect(url);
  //   client.on('connect', done);
  // });
  //
  // afterEach('Stop client', (done) => {
  //   client.disconnect();
  //   client.on('disconnect', done);
  // });

  afterEach('reset models', () => {
    Room.clearAll();
  });

  after('Stop server', () => {
    server.close();
  });

  describe('lobbyChange', () => {
    it('should return an empty array on connection if no rooms exist', (done) => {
      const client = socketClient.connect(url);
      client.on('lobbyChange', (data) => {
        expect(data.rooms).to.deep.equal([]);
        client.disconnect();
        done();
      });
    });
    it('should return an array of all current rooms on connection', (done) => {
      const room1 = Room.create('Blues');
      const room2 = Room.create('Soul');
      const room3 = Room.create('Jazz');
      const client = socketClient.connect(url);
      client.on('lobbyChange', (data) => {
        expect(data.rooms).to.deep.equal([room1, room2, room3]);
        client.disconnect();
        done();
      });
    });
    it('should return an updated array of rooms whenever ones are created', (done) => {
      const client = socketClient.connect(url);
      client.once('lobbyChange', (data1) => {
        expect(data1.rooms).to.deep.equal([]);
        const room = Room.create('Zydeco');
        client.once('lobbyChange', (data2) => {
          expect(data2.rooms).to.deep.equal([room]);
          client.disconnect();
          done();
        });
      });
    });
    it('should return an updated array of rooms whenever one is removed', (done) => {
      const room1 = Room.create('Blues');
      const room2 = Room.create('Soul');
      const room3 = Room.create('Jazz');
      const client = socketClient.connect(url);
      client.once('lobbyChange', (data1) => {
        expect(data1.rooms).to.deep.equal([room1, room2, room3]);
        Room.remove(room2.id);
        client.once('lobbyChange', (data2) => {
          expect(data2.rooms).to.deep.equal([room1, room3]);
          client.disconnect();
          done();
        });
      });
    });
  });
});
