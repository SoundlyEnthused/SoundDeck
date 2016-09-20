const chai = require('chai');
const createServer = require('../../test_socket_server');
const ServerAPI = require('../../../client/models/ServerAPI');

const expect = chai.expect;

describe('ServerAPI', () => {
  let server;
  const url = `http://127.0.0.1:${process.env.PORT}`;

  before('Start server', () => {
    server = createServer(process.env.PORT, []);
  });

  after('Stop server', (done) => {
    server.close(done);
  });

  it('should connect', () => {
    server.io.on('connection', (socket) => {
      console.log("user connect");
      socket.on('AA', () => {
        console.log("Socket getting AA")
      })
    });

    ServerAPI.connect();
    expect(ServerAPI.socket).to.be.a('object');

    ServerAPI.socket.on("XXXX", () => { console.log("GOT XXXX")})
    server.io.emit("XXXX");
    ServerAPI.socket.emit('AA')
  });
});
