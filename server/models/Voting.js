const User = require('./User');
const Voting = {};

let votings = {};
let votingsIdsByRoom = {};
let nextId = 0;

Voting.create = function create(roomId, maxDjs = 4) {
  const voting = {
    roomId,
    id: nextId,
    trackId: null,
    voted: {},
  };
  nextId += 1;
  queues[queue.id] = queue;
  queueIdsByRoom[roomId] = queue.id;
  return DjQueue.get(queue.id);

  votings[roomId] = voting;
  return Voting.get(voting.roomId);
};

Voting.clearAll = () => {
  voting = {};
};

Voting.upvote = () => {
  User.get(djid).likes = User.get(djid).likes + 1;
};

Voting.downvote = () => {

};

Voting.newTrack = (roomId, trackId) => {

};

module.exports = Voting;
