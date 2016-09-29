const Voting = {};

// voting { } is an object created for each room
// this object persists as long as room exists:
let voting = {};

Voting.create = function create(roomId, track) {
  console.log('Voting.create roomId = ', roomId);
  console.log('Voting.create track = ', track);

  voting = {
    roomId,
    id: nextId, // used for testing 
    trackId: track,
    downvoteCount,

  	// object 
  	voters: {},
  };

}
/*
  // ?? nextId
  nextId += 1;
  // 
  votings[voting.id] = voting;
  votingIdsByRoom[roomId] = voting.id 
  return Voting.get(voting.roomId)



  	currentDJ: 0,
  };
*/
// This function records a user's like for the currentDJ
Voting.upvote = (userId, currentDJ) => {
// variable that assigns voting = voting[voting.id]

}
// This function records a user downvote and updates the
// specific voting object
Voting.downvote = (roomId, userId, currentDJ, track) => {



};
// This function updates the voting object when a 
// new track is played.
Voting.newTrack = (roomId, totalCount, track) => {
  const voting = votings[votingIdsByRoom[roomId]];
  voting.track = track;
  voting.downvoteCount = 0;
  voting.voted = {};
  voting.totalCount = totalCount;
};
// This function updates the voting object when a new
// enters the stage.
Voting.DJenqueue = (roomId, djList) => {
  const voting = votings[votingIdsByRoom[roomId]];
  
};
// This function updates the voting object when a DJ
// leaves a stage.
Voting.DJdequeue = (roomId, djList) => {
  const voting = votings[votingIdsByRoom[roomId]];

};
module.exports = Voting;

