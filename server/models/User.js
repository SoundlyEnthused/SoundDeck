const DB = require('../db');

const User = {};

User.create = function create(id, username, avatar_url) {
  const user = {
    id,
    username,
    avatar_url,
    likes: 0,
    avatar: null,
  };
  DB.updateUser(user);
  return user;
};

User.get = function get(id) {
  return DB.getUser(id);
};

User.upvote = function upvote(id) {
  return DB.upvote(id);
};

User.downvote = function downvote(id) {
  return DB.downvote(id);
};

// User.updateAvatar = function updataAvatar(avatar) {

// }
module.exports = User;
