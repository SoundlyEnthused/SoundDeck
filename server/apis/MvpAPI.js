const Connection = require('../models/Connection');
const Room = require('../models/Room');
const DjQueue = require('../models/DjQueue');
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const Voting = require('../models/Voting');

const MvpAPI = {};

/* Delay to insert between tracks times */
MvpAPI.trackDelay = 500;

/* Bundle the state of all Rooms and DjQueues into one Object */
MvpAPI.getState = () => {
  const state = {};
  Room.all().forEach((room) => {
    // Get the DjQueue associated with this room
    const queue = DjQueue.getByRoom(room.id);
    // Build up the state object entry from related Room and DjQueue models
    state[room.id] = {
      name: room.name,
      djs: queue.active.map(dj => User.get(dj)),
      currentDj: queue.currentDj,
      // User's array should not include DJ's
      users: room.users.filter(user => !queue.active.includes(user)).map(user => User.get(user)),
      djMaxNum: queue.maxDjs,
      track: queue.currentTrack !== null ? queue.currentTrack.songId : null,
      timeStamp: queue.currentTrack !== null ? queue.currentTrack.startTime + MvpAPI.trackDelay : 0,
    };
  });
  return state;
};

MvpAPI.createRoom = (name) => {
  const room = Room.create(name);
  DjQueue.create(room.id);
  return room;
};

// Resets all the App's models! -- used for testing
MvpAPI.clearAll = () => {
  Room.clearAll();
  DjQueue.clearAll();
  Playlist.clearAll();
  Voting.clearAll();
};

// TODO: Test this!
function updateTracks() {
  Room.all().forEach((room) => {
    const queue = DjQueue.getByRoom(room.id);
    // There is not a track playing in this room
    if (queue.currentTrack === null) {
      // We have a DJ -- someone must have just joined an empty Queue
      if (queue.active.some(dj => dj !== null)) {
        MvpAPI.sendNextTrack(room.id);
      }
      return;
    }
    // Bail early if we don't have any time data
    if (queue.currentTrack.startTime === undefined
      || queue.currentTrack.duration === undefined) {
      console.error('updateTracks Error: no time information for current track');
      return;
    }
    // See if it is time to advance this track
    const endTime = queue.currentTrack.startTime + queue.currentTrack.duration + MvpAPI.trackDelay;
    if (Date.now() > endTime) {
      MvpAPI.sendNextTrack(room.id);
    }
  });
}

/* Socket.io Event Endpoints */

/* Handler for event to associate a connection with a soundcloud user */
MvpAPI.login = (socket, data) => {
  Connection.register(data.id, socket);
  User.create(data.id, data.username, data.avatar_url);
  Connection.send(data.id, 'login', { id: data.id });
  Connection.send(data.id, 'room', MvpAPI.getState());
};

/* Handler for event to join a room */
MvpAPI.join = (socket, data) => {
  // User must be logged in, in order to join
  if (!Connection.isRegistered(socket)) {
    return;
  }
  // User must send a roomId
  if (data === undefined || data.roomId === undefined) {
    return;
  }
  const userId = Connection.getUserId(socket);
  Room.join(data.roomId, userId);
  Connection.sendAll('room', MvpAPI.getState());
};

/* Handler for event to enqueue for DJ position */
MvpAPI.enqueue = (socket) => {
  // User must be logged in, in order to become a DJ
  if (!Connection.isRegistered(socket)) {
    return;
  }
  const userId = Connection.getUserId(socket);
  const room = Room.getByUserId(userId);
  if (room === null) {
    // User is not in a room!
    return;
  }
  const queue = DjQueue.getByRoom(room.id);
  if (queue == null) {
    // This shouldn't happen as queues should always be associated with rooms
    console.error('MvpAPI.enqueue error: Room has no corresponding DjQueue');
    return;
  }
  DjQueue.enqueue(queue.id, userId);
  Connection.sendAll('room', MvpAPI.getState());
};

/* Handler for event to dequeue DJ */
MvpAPI.dequeue = (socket) => {
  // User must be logged in, in order to dequeue
  if (!Connection.isRegistered(socket)) {
    return;
  }
  const userId = Connection.getUserId(socket);
  const room = Room.getByUserId(userId);
  if (room === null) {
    return; // user is not in a room
  }
  const queue = DjQueue.getByRoom(room.id);
  if (queue == null) {
    // This shouldn't happen as queues should always be associated with rooms
    console.error('MvpAPI.dequeue error: Room has no corresponding DjQueue');
    return;
  }
  DjQueue.removeUser(queue.id, userId);
  Connection.sendAll('room', MvpAPI.getState());
};

/* handler for updating Playlist */
MvpAPI.updatePlaylist = (socket, tracks) => {
  const userId = Connection.getUserId(socket);
  const playlist = Playlist.getByUserId(userId);
  if (playlist === null) {
    Playlist.create(userId, tracks);
  } else {
    Playlist.update(playlist.id, tracks);
  }
};
/* handler for getting Playlist for user */
MvpAPI.getPlaylist = (socket) => {
  const userId = Connection.getUserId(socket);
  const playlist = Playlist.getByUserId(userId);
  if (playlist === null) {
    Connection.send(userId, 'playlist', []);
  } else {
    Connection.send(userId, 'playlist', playlist.tracks);
  }
};

/* sendNextTrack for a given room -- expects a room.id */
MvpAPI.sendNextTrack = (roomId) => {
  const queue = DjQueue.getByRoom(roomId);
  if (queue === null) {
    // This shouldn't happen as queues should always be associated with rooms
    console.error('MvpAPI.sendNextTrack error: Room has no corresponding DjQueue');
    return;
  }
  // const dj = queue.active[queue.currentDj];
  const track = DjQueue.nextTrack(queue.id);
  const updatedQueue = DjQueue.get(queue.id);
  const dj = updatedQueue.active[updatedQueue.currentDj];
  const playlist = Playlist.getByUserId(dj);
  if (track === null) {
    // No next track for this room
    // Send state in case dj was removed
    Connection.sendAll('room', MvpAPI.getState());
    return;
  }
  // Send playlist back to dj
  if (playlist !== null) {
    Connection.send(dj, 'playlist', playlist.tracks);
  }
  Connection.sendAll('room', MvpAPI.getState());
};

/* Handler for event to upvote for DJ */
MvpAPI.upvote = (socket, data) => {
  // User must be logged in, in order to join
  if (!Connection.isRegistered(socket)) {
    return;
  }
  Voting.upvote(data.currentDjId)
};

/* Handler for event to downvote for song */
MvpAPI.downvote = (socket, data) => {
  // User must be logged in, in order to join
  if (!Connection.isRegistered(socket)) {
    return;
  }

};

/* Handler for disconnect event */
MvpAPI.disconnect = (socket) => {
  if (!Connection.isRegistered(socket)) {
    return;
  }
  const userId = Connection.getUserId(socket);
  const room = Room.getByUserId(userId);
  if (room === null) {
    return; // User is not in a Room
  }
  Connection.remove(socket);
  if (Connection.getSockets(userId).length === 0) {
    // All open connections have been closed so remove user!
    const queue = DjQueue.getByRoom(room.id);
    // Remove user from DjQueue if it exists
    if (queue !== null) {
      DjQueue.removeUser(queue.id, userId);
    }
    // Remove user from Room
    Room.leave(room.id, userId);
    Connection.sendAll('room', MvpAPI.getState());
  }
};

/* Connect all Event Endpoints to Server */
MvpAPI.attachListeners = (io) => {
  io.on('connection', (socket) => {
    // On a connection event, add handlers to socket
    socket.on('login', MvpAPI.login.bind(null, socket));
    socket.on('join', MvpAPI.join.bind(null, socket));
    socket.on('enqueue', MvpAPI.enqueue.bind(null, socket));
    socket.on('dequeue', MvpAPI.dequeue.bind(null, socket));
    socket.on('disconnect', MvpAPI.disconnect.bind(null, socket));
    socket.on('playlist', MvpAPI.updatePlaylist.bind(null, socket));
    socket.on('upvote', MvpAPI.upvote.bind(null, socket));
    socket.on('downvote', MvpAPI.downvote.bind(null, socket));
  });
  // Kick off repeated task to update tracks
  setInterval(updateTracks, 100);
};

module.exports = MvpAPI;
