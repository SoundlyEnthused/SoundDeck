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
  return DB.updateUser(user);
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

User.clearAll = function clearAll(id) {
  return DB.clearAll();
};

// User.updateAvatar = function updataAvatar(avatar) {

// }
module.exports = User;
