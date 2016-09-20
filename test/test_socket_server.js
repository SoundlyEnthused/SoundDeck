const server = require('http').createServer();
const io = require('socket.io')(server);

module.exports = function createServer(port, controllers, done) {
  controllers.forEach((controller) => {
    controller(io);
  });

  server.listen(port, done);
  server.io = io;
  return server;
};
