const Playlist = {};

let playlists = {};
// map of user ids to playlist ids
let usersToPlaylists = {};
let nextId = 0;
// Playlists are always associated with a user!
Playlist.create = function create(userId, tracks = []) {
  const id = nextId;
  nextId += 1;
  const playlist = { tracks, id, userId };
  playlists[id] = playlist;
  usersToPlaylists[userId] = id;
  return playlist;
};

Playlist.clearAll = function clearAll() {
  playlists = {};
  usersToPlaylists = {};
};

Playlist.update = function update(userId, tracks) {
  if (userId in playlists) {
    playlists[userId].tracks = tracks.map(ele => ({ songId: ele.songId, duration: ele.duration }));
  }
};

Playlist.get = function get(id) {
  return playlists[id];
};

Playlist.getByUserId = function getIdByUser(userId) {
  return playlists[usersToPlaylists[userId]];
};

Playlist.rotate = function rotate(id) {
  if (id in playlists) {
    const tracks = playlists[id].tracks;
    if (tracks.length < 2) {
      return; // Nothing to rotate!
    }
    tracks.push(tracks.shift());
  }
};

module.exports = Playlist;
