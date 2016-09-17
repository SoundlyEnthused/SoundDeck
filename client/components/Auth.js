const SC = require('soundcloud');

const clientId = process.env.CLIENT_ID;
const login = {};


login.signin = () => {
  SC.initialize({
    client_id: clientId,
    redirect_uri: 'http://localhost:4000/callback.html',
  });

  return SC.connect()
    .then(() => SC.get('/me'))
    .then((me) => {
      console.log('result of me: ', me);
      return me;
    });
};

module.exports = login;
