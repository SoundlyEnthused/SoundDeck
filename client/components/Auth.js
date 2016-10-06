const SC = require('soundcloud');

const clientId = process.env.CLIENT_ID;
const login = {};


login.signin = () => {
  SC.initialize({
    client_id: clientId,
    redirect_uri: process.env.CALLBACK_URI,
  });

  return SC.connect()
    .then(() => SC.get('/me'))
    .then(me => me);
};

module.exports = login;
