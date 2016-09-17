const SC = require('soundcloud');

const clientId = process.env.CLIENT_ID;
const login = {};


login.signin = function (){
  SC.initialize({
    client_id: clientId,
    redirect_uri: 'http://localhost:4000/callback.html',
  });

  SC.connect().then(function () {
    return SC.get('/me');
  }).then(function(me) {
    alert('Hello, ' + me.username);
  });
};

module.exports = login;
