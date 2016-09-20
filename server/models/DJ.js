const Playlist = require('./Playlist');

function DJ(maxDJs = 4) {
  let active = [];
  const waiting = [];
  // let currentDJ = null;
  return {
    addToWaiting: (id) => {
      if (active.length < maxDJs) {
        active.push(id);
      } else {
        waiting.push(id);
      }
    },
    getNextWaiting: () => waiting.shift(),
    getNextTrack: () => {
      // If we don't have a DJ return null
      if (active.length === 0) {
        return null;
      }
      // Get next DJ
      const dj = active.shift();
      // Get DJ's next track
      const id = Playlist.getIdByUser(dj);
      const track = Playlist.get(id)[0]; // TODO: Handle case where playlist is empty
      // Rotate DJ's playlist
      Playlist.rotate(id);
      // Rotate DJs
      active.push(dj);
      return track;
    },
    getDJs: () => active.slice(),
    getWaiting: () => waiting.slice(),
    removeDJ: (id) => {
      active = active.filter(userId => userId !== id);
      if (active.length < maxDJs && waiting.length > 0) {
        active.push(waiting.shift());
      }
    },
  };
}

module.exports = DJ;
