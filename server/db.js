const MongoClient = require('mongodb').MongoClient;

const DB = {};
let Users = null;

// insert or update new User
const updateUser = (user) => {
  return Users.update(
    { id: { $eq: user.id } },
    { $set: { username: user.username, avatar_url: user.avatar_url } },
    { upsert: true });
};
// get User
const getUser = (id) => {
  if (id) {
    return new Promise((resolve, reject) => {
      Users.find({ id: { $eq: id } }).each((err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
  return Promise.resolve(null);
};
// Get playlist
const getPlaylist = (userId) => {
  return Users.findOne({ id: { $eq: userId } }, { playlist: 1 }).then((data) => {
    if (data && data.playlist) {
      return data.playlist;
    }
    return null;
  });
};

// Update playlist
const updatePlaylist = (userId, playlist) => {
  return Users.updateOne({ id: { $eq: userId } }, { $set: { playlist } });
};

// Upvote. Increase likes
const upvote = (userId) => {
  return Users.updateOne({ id: { $eq: userId } }, { $inc: { likes: 1 } });
};
// Downvote. Decrease likes
const downvote = (userId) => {
  return Users.updateOne({ id: { $eq: userId } }, { $inc: { likes: -1 } });
};

const clearAll = () => {
  return Users.remove({});
};

/*
  create folder /db at project root
  to initialize mongo db, run
    mongod --dbpath ./db
  then inside /db folder, run
    mongo
  to start the mongo shell
  inside of mongo shell, run
    use sounddeck
  to switch to sounddeck database
  add env variable MONGODB_URI='mongodb://localhost:27017/sounddeck'
*/

let url = process.env.MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
  url = 'mongodb://localhost:27017/sounddeck';
}

DB.init = () => {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('err connecting to database');
    }
    console.log('Connected successfully to database');
    Users = db.collection('Users');
    DB.getUser = getUser;
    DB.getPlaylist = getPlaylist;
    DB.updateUser = updateUser;
    DB.updatePlaylist = updatePlaylist;
    DB.upvote = upvote;
    DB.downvote = downvote;
    DB.clearAll = clearAll;
  });
};

module.exports = DB;
