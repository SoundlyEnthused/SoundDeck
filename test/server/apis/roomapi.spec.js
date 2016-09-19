const chai = require('chai');
const RoomAPI = require('../../../server/apis/RoomAPI.js');
const createServer = require('../../test_socket_server.js');
const socketClient = require('socket.io-client');
const Room = require('../../../server/models/Room.js');
const expect = chai.expect;

describe('RoomAPI', () => {
  let server;
  let client;
  let url = 'http://127.0.0.1:' + process.env.PORT;
  before('Start server', (done) => {
    server = createServer(process.env.PORT, [RoomAPI], done);
  });

  beforeEach('Start client', (done) => {
    client = socketClient.connect(url);
    client.on('connect', done);
  });

  afterEach('Stop client', (done) => {
    client.disconnect();
    client.on('disconnect', done);
  });

  after('Stop server', () => {
    server.close();
  });

  describe('lobbyChange', () => {
    it('should return an array of all rooms on connection', (done) => {
      client.on('lobbyChange', (data) => {
        expect(data).to.be.defined;
        expect(data.rooms).to.deep.equal([]);
        done();
      });
    });
  });

});
