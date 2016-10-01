const SC = require('soundcloud');

const clientId = process.env.CLIENT_ID;
console.log('clientId = ', clientId);
const login = {};


login.signin = () => {
  SC.initialize({
    client_id: clientId,
    redirect_uri: process.env.CALLBACK_URI,
  });

  return SC.connect()
    .then(() => SC.get('/me'))
    .then((me) => {
      console.log('result of me: ', me);
      return me;
    });
};

module.exports = login;
