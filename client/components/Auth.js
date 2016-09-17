const SC = require('soundcloud');
const auth = require('./key');
const login = {};


login.signin = function (){
  SC.initialize({
    client_id: auth.CLIENT_ID,
    redirect_uri: 'http://localhost:4000/callback.html',
  });

  SC.connect().then(function () {
    return SC.get('/me');
  }).then(function(me) {
    alert('Hello, ' + me.username);
  });
};

module.exports = login;
