const User = {};

const users = {};

User.create = function create(id, username, avatar_url) {
  const user = {
    id,
    username,
    avatar_url,
    likes: null,
  };
  users[id] = user;
  return user;
};

User.get = function get(id) {
  return users[id];
};

module.exports = User;
