const Playlist = {};

let playlists = {};

// Playlists are always associated with a user!
Playlist.create = function create(userId) {
  const playlist = [];
  playlists[userId] = playlist;
  return playlist;
};

Playlist.clearAll = function clearAll() {
  playlists = {};
};

Playlist.update = function update(userId, list) {
  if (userId in playlists) {
    playlists[userId] = list.map(ele => ({ songId: ele.songId, duration: ele.duration }));
  }
};

Playlist.get = function get(userId) {
  return playlists[userId];
};

Playlist.rotate = function rotate(userId) {
  if (userId in playlists) {
    const list = playlists[userId];
    if (list.length < 2) {
      return; // Nothing to rotate!
    }
    list.push(list.shift());
  }
};

module.exports = Playlist;
