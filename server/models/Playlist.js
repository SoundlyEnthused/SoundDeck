const Playlist = {};

let playlists = {};
/* map of user ids to playlist ids */
let usersToPlaylists = {};
let nextId = 0;
// Playlists are always associated with a user!
Playlist.create = function create(userId, playlist = []) {
  const id = nextId;
  nextId += 1;
  playlists[id] = playlist;
  usersToPlaylists[userId] = id;
  return id;
};

Playlist.clearAll = function clearAll() {
  playlists = {};
  usersToPlaylists = {};
};

Playlist.update = function update(userId, list) {
  if (userId in playlists) {
    playlists[userId] = list.map(ele => ({ songId: ele.songId, duration: ele.duration }));
  }
};

Playlist.get = function get(id) {
  return playlists[id];
};

Playlist.getIdByUser = function getIdByUser(userId) {
  return usersToPlaylists[userId];
};

Playlist.rotate = function rotate(id) {
  if (id in playlists) {
    const list = playlists[id];
    if (list.length < 2) {
      return; // Nothing to rotate!
    }
    list.push(list.shift());
  }
};

module.exports = Playlist;
