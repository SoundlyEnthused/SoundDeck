const Playlist = require('./Playlist');

// DjQueue are indexed by roomId
const DjQueue = {};
let queues = {};
let queueIdsByRoom = {};
let nextId = 0;

DjQueue.create = function create(roomId, maxDjs = 4) {
  const queue = {
    roomId,
    id: nextId,
    active: [],
    waiting: [],
    maxDjs,
    currentDj: 0,
    previousDj: -1,
    currentTrack: null,
  };
  nextId += 1;
  queues[queue.id] = queue;
  queueIdsByRoom[roomId] = queue.id;
  return DjQueue.get(queue.id);
};

DjQueue.clearAll = function clearAll() {
  queues = {};
  queueIdsByRoom = {};
};

/* Return immutable DjQueue representation or null if there is none */
DjQueue.get = function get(id) {
  const q = queues[id];
  // Copy objects and Array's to make result immutable
  return id in queues
    ? Object.assign({}, q, { active: q.active.slice(), waiting: q.waiting.slice() })
    : null;
};

DjQueue.getByRoom = function getByRoom(roomId) {
  return roomId in queueIdsByRoom ? DjQueue.get(queueIdsByRoom[roomId]) : null;
};

DjQueue.enqueue = function enqueue(id, userId) {
  const queue = queues[id];
  if (queue.active.includes(userId) || queue.waiting.includes(userId)) {
    return;
  }
  if (queue.active.length < queue.maxDjs) {
    queue.active.push(userId);
  } else {
    queue.waiting.push(userId);
  }
};

/* Return the id of next DJ in line, or null if there are no DJs */
DjQueue.next = function next(id) {
  const queue = queues[id];
  if (queue.currentDj >= queue.active.length) {
    queue.currentDj = 0;
  }
  if (queue.currentDj === queue.previousDj
    && queue.active.length > queue.currentDj + 1) {
    // Another user has joined since song start
    // This case should only happen when currentDj is 0
    queue.currentDj += 1;
  }
  queue.previousDj = queue.currentDj;
  const dj = queue.active[queue.currentDj];
  // update current dj
  if (queue.active.length === 0) {
    // We can't mod by zero...
    queue.currentDj = 0;
  } else {
    queue.currentDj = ((queue.currentDj + 1) % queue.active.length);
  }
  return dj !== undefined ? dj : null;
};
// /* Return the id of next DJ in line, or null if there are no DJs */
// DjQueue.next = function next(id) {
//   const queue = queues[id];
//   if (queue.currentDj >= queue.active.length) {
//     queue.currentDj = 0;
//   }
//   const dj = queue.active[queue.currentDj];
//   // update current dj
//   if (queue.active.length === 0) {
//     // We can't mod by zero...
//     queue.currentDj = 0;
//   } else {
//     queue.currentDj = ((queue.currentDj + 1) % queue.active.length);
//   }
//   return dj !== undefined ? dj : null;
// };

/* Retrieve the next track for track change events in a room or return null if none are ready */
DjQueue.nextTrack = function nextTrack(id) {
  // Get the next DJ
  const dj = DjQueue.next(id);
  // If we have no DJ's return null
  if (dj === null) {
    queues[id].currentTrack = null;
    return queues[id].currentTrack;
  }
  // Grab DJ's playlist
  const playlist = Playlist.getByUserId(dj);
  // if playlist is empty...
  if (playlist === null || playlist.tracks.length === 0) {
    // remove the DJ from queue
    DjQueue.removeUser(id, dj);
    // Set currentDj index back by one in order to keep current position
    queues[id].currentDj = Math.max(0, queues[id].currentDj - 1);
    // Try again!
    queues[id].currentTrack = DjQueue.nextTrack(id);
    return queues[id].currentTrack;
  }
  // Return startTime of track
  queues[id].currentTrack = Object.assign({ startTime: Date.now() }, playlist.tracks[0]);
  Playlist.rotate(playlist.id);
  return queues[id].currentTrack;
};

DjQueue.removeUser = function removeUser(id, userId) {
  const queue = queues[id];
  if (!queue) {
    return;
  }
  const length = queue.active.length;
  queue.active = queue.active.filter(uid => uid !== userId);
  // Move users from waiting to active if we removed a user and have waiting
  if (queue.active.length < length) {
    if (queue.waiting.length > 0) {
      // Promote next waiting user to DJ
      queue.active.push(queue.waiting.shift());
    }
    // if (queue.currentDj >= queue.active.length) {
    //   // Reset currentDj if there are no more after removed user
    //   console.log('reset current dj')
    //   queue.currentDj = 0;
    // }
    return; // We can exit as user was an active DJ and thus isn't waiting
  }
  queue.waiting = queue.waiting.filter(uid => uid !== userId);
};

module.exports = DjQueue;
