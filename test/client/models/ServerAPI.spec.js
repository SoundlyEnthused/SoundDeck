const chai = require('chai');
const createServer = require('../../test_socket_server');
const ServerAPI = require('../../../client/models/ServerAPI');

const expect = chai.expect;

describe('ServerAPI', () => {
  let server;
  const url = `http://127.0.0.1:${process.env.TESTPORT}`;

  before('Start server', () => {
    server = createServer(process.env.TESTPORT, []);
  });

  after('Stop server', (done) => {
    server.close(done);
  });

  it('should connect', () => {

    server.io.on('connection', (socket) => {
      console.log('user connect');
      socket.on('join', (data) => {
        console.log('Server getting joinRoom', data);
      });
      socket.on('disconntect', (data) => {
        console.log('user disconnect');
      });
      ServerAPI.joinRoom(999);
      server.io.emit('lobbyChange', 'lobby change data');
      ServerAPI.disconnect();
      console.log("END");
    });
    ServerAPI.connect();

    expect(ServerAPI.socket).to.be.a('object');

  });
});
