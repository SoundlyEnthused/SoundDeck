const SC = require('soundcloud');


SC.initialize({
  client_id: 'key goes here',
  redirect_uri: 'http://localhost:4000/callback.html',
});
