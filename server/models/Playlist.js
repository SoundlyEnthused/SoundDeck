const DB = require('../db');

const Playlist = {};

// let playlists = {};
// map of user ids to playlist ids
// let usersToPlaylists = {};
// let nextId = 0;
// Playlists are always associated with a user!

// Playlist.create = function create(userId, tracks = []) {
//   const id = nextId;
//   nextId += 1;
//   TODO: Validate tracks like in update
//   const playlist = { tracks: tracks.slice(), id, userId };
//   playlists[id] = playlist;
//   usersToPlaylists[userId] = id;
//   return DB.updatePlaylist(userId, tracks);
//   return Playlist.get(id);
// };

Playlist.clearAll = function clearAll() {
  // playlists = {};
  // usersToPlaylists = {};
};

Playlist.update = function update(userId, tracks) {
  // if (userId in playlists) {
  //   playlists[userId].tracks = tracks.map(ele => ({ songId: ele.songId, duration: ele.duration }));
  // }
  return DB.updatePlaylist(userId, tracks);
};

// Playlist.get = function get(id) {
//   const p = playlists[id];
//   return p !== undefined
//   ? Object.assign({}, p, { tracks: p.tracks.map(t => Object.assign({}, t)) })
//   : null;
// };
Playlist.get = function get(userId) {
  console.log('playlist get', userId);
  return DB.getPlaylist(userId);
};

Playlist.rotate = function rotate(userId) {
  console.log('playlist rotate')
  return Playlist.getByUserId(userId).then((data) => {
    const tracks = data;
    if (tracks.length < 2) {
      return Promise.resolve(null); // Nothing to rotate!
    }
    tracks.push(tracks.shift());
    return Playlist.update(userId, tracks);
  });
  // if (id in playlists) {
  //   const tracks = playlists[id].tracks;
  //   if (tracks.length < 2) {
  //     return; // Nothing to rotate!
  //   }
  //   tracks.push(tracks.shift());
  // }
};

module.exports = Playlist;
