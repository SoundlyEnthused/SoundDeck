const server = require('http').createServer();
const io = require('socket.io')(server);

module.export = function createServer(port, controllers, done) {
  controllers.forEach((controller) => {
    controller(io);
  });

  server.listen(port, done);
  return server;
};