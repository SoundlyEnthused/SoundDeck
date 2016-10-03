const Path = require('path');
// Imports for express
const express = require('express');
const bodyParser = require('body-parser');
// Imports for browserify-middleware
const browserify = require('browserify-middleware');
const babelify = require('babelify');
const api = require('./apis/MvpAPI');
const io = require('socket.io');
const initialRooms = require('./initialRooms');
const DB = require('./db');

DB.init();
const routes = express.Router();

//
// Provide a browserified file at a specified path
//
routes.get('/app-bundle.js',
  browserify('./client/app.js', {
    // Bundles all client-side es6, JSX, and CSS/SCSS/SASS
    transform: [[babelify, { presets: ['es2015', 'react'] }], 'envify', 'scssify'],
  })
);

//
// Example endpoint (also tested in test/server/index_test.js)
//
routes.get('/api/tags-example', (req, res) => {
  res.send(['node', 'express', 'browserify', 'mithril']);
});

//
// Static assets (html, etc.)
//
const assetFolder = Path.resolve(__dirname, '../client/public');
routes.use(express.static(assetFolder));


if (process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', (req, res) => {
    res.sendFile(`${assetFolder}/index.html`);
  });

  //
  // We're in development or production mode;
  // create and run a real server.
  //
  const app = express();

  // Parse incoming request bodies as JSON
  app.use(bodyParser.json());

  // Mount our main router
  app.use('/', routes);

  // Start the server!
  const port = process.env.PORT || 4000;
  const server = app.listen(port);
  console.log('Listening on port', port);
  api.attachListeners(io(server));

  // Seed rooms with initialRooms.json
  initialRooms.forEach(room => api.createRoom(room));
} else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}
