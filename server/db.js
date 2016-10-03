const MongoClient = require('mongodb').MongoClient;

const DB = {};
let Users = null;

// insert or update new User
const updateUser = (user) => {
  Users.update({ id: { $eq: user.id } }, user, { upsert: true });
};
// get User
const getUser = (id) => {
  if (id) {
    return new Promise((resolve, reject) => {
      Users.find({ id: { $eq: id } }).each((err, doc) => {
        if (err) {
          reject(doc);
        }
        resolve(doc);
      });
    });
  }
  return Promise.resolve(null);
};
// Update playlist
const updatePlaylist = (userId, playlist) => {
  console.log('DB update playlist', userId, playlist);
  Users.updateOne({ id: { $eq: userId } }, { $set: { playlist } });
};
// Upvote. Increase likes
const upvote = (userId) => {
  console.log('db upvote', userId);
  Users.updateOne({ id: { $eq: userId } }, { $inc: { likes: 1 } });
};
// Downvote. Decrease likes
const downvote = (userId) => {
  console.log('db downvote', userId);
  Users.updateOne({ id: { $eq: userId } }, { $inc: { likes: -1 } });
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
DB.init = () => {
  MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
    if (err) {
      console.log('err connecting to database');
    }
    console.log('Connected successfully to database');
    Users = db.collection('Users');
    DB.getUser = getUser;
    DB.updateUser = updateUser;
    DB.updatePlaylist = updatePlaylist;
    DB.upvote = upvote;
    DB.downvote = downvote;
  });
};

module.exports = DB;
