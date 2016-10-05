const DB = require('../db');

const Playlist = {};

Playlist.clearAll = function clearAll() {
  // playlists = {};
  // usersToPlaylists = {};
};

Playlist.update = function update(userId, tracks) {
  const tracksCache = tracks.map(ele => ({
    songId: ele.songId,
    duration: ele.duration,
    title: ele.title,
  }));
  return DB.updatePlaylist(userId, tracksCache);
};

Playlist.get = function get(userId) {
  return DB.getPlaylist(userId);
};

Playlist.rotate = function rotate(userId) {
  return Playlist.get(userId).then((data) => {
    const tracks = data;
    if (tracks.length < 2) {
      return Promise.resolve(tracks[0]); // Nothing to rotate!
    }
    tracks.push(tracks.shift());
    return Playlist.update(userId, tracks);
  });
};

module.exports = Playlist;
