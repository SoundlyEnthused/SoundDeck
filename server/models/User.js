const DB = require('../db');

const User = {};
const users = {};

User.create = function create(id, username, avatar_url) {
  const user = {
    id,
    username,
    avatar_url,
    likes: 0,
    avatar: null,
  };
  users[id] = user;
  DB.updateUser(user);
  return user;
};

User.get = function get(id) {
  return DB.getUser(id);
  // return users[id] === undefined ? null : users[id];
};

User.upvote = function upvote(id) {
  if (users[id]) {
    users[id].likes += 1;
  }
  DB.upvote(id);
};

User.downvote = function downvote(id) {
  if (users[id]) {
    users[id].likes -= 1;
  }
  DB.downvote(id);
};

// User.updateAvatar = function updataAvatar(avatar) {

// }
module.exports = User;
