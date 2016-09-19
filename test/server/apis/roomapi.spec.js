const chai = require('chai');
const RoomAPI = require('../../../server/apis/RoomAPI.js');
const createServer = require('../../test_socket_server.js');
const socketClient = require('socket.io-client');
const expect = chai.expect;

describe('RoomAPI', () => {
  let server;
  let client;
  let url = 'http://127.0.0.1' + process.env.PORT;
  before('Start server', (done) => {
    server = createServer(process.env.PORT, [RoomAPI], done);
  });

  beforeEach('Start client', (done) => {
    client.on('connect', done);
    client = socketClient().connect(url);
  });

  describe('lobbyChange', () => {
    client.on
  });

});
