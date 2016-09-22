const Playlist = require('./Playlist');

// DjQueue are indexed by roomId
const DjQueue = {};
let queues = {};
let queuesByRoom = {};
let nextId = 0;

DjQueue.create = function create(roomId, maxDjs = 4) {
  const queue = {
    roomId,
    id: nextId,
    active: [],
    waiting: [],
    maxDjs,
    currentDj: 0,
  };
  nextId += 1;
  queues[queue.id] = queue;
  queuesByRoom[roomId] = queue;
  return queue;
};

DjQueue.clearAll = function clearAll() {
  queues = {};
  queuesByRoom = {};
};

DjQueue.get = function get(id) {
  return queues[id];
};

DjQueue.getByRoom = function getByRoom(roomId) {
  return queuesByRoom[roomId];
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
  const dj = queue.active[queue.currentDj];
  queue.currentDj = ((queue.currentDj + 1) % queue.active.length);
  return dj !== undefined ? dj : null;
};

/* Retrieve the next track for track change events in a room or return null if none are ready */
DjQueue.nextTrack = function nextTrack(id) {
  // Get the next DJ
  const dj = DjQueue.next(id);
  // If we have no DJ's return null
  if (dj === null) {
    return null;
  }
  // Grab DJ's playlist
  const playlist = Playlist.getByUserId(dj);
  // if playlist is empty...
  if (playlist.tracks.length === 0) {
    // remove the DJ from queue
    DjQueue.removeUser(id, dj);
    // Set currentDj index back by one in order to keep current position
    queues[id].currentDj -= 1;
    // Try again!
    return DjQueue.nextTrack(id);
  }

  const track = playlist.tracks[0];
  Playlist.rotate(playlist.id);
  return track;
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
      queue.active.push(queue.waiting.shift());
    }
    return; // We can exit as user was an active DJ and thus isn't waiting
  }
  queue.waiting = queue.waiting.filter(uid => uid !== userId);
};

module.exports = DjQueue;
