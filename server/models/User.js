const User = {};

const users = {};

User.create = function create(id, username, avatar_url) {
  const user = {
    id,
    username,
    avatar_url,
  };
  users[id] = user;
  return user;
};

User.get = function get(id) {
  return users[id] === undefined ? null : users[id];
};

module.exports = User;
