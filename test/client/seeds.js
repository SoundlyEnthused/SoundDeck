const seeds = {};

seeds.user = { id: 1000, username: 'shaka', avatar_url: 'https://i1.sndcdn.com/avatars-000001116755-hhusd1-large.jpg' };
seeds.djs = [
      { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
      { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
      { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
      { id: 24, username: 'Rouzbeh Delavari', avatar_url: 'https://i1.sndcdn.com/avatars-000128836744-w66epn-large.jpg' },
];
seeds.djIds = seeds.djs.map(dj => dj.id);
seeds.users = [
      { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
      { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
      { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
      { id: 11, username: 'robert', avatar_url: 'https://i1.sndcdn.com/avatars-000000000050-56eb60-large.jpg' },
      { id: 46, username: 'bjornjeffery', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
      { id: 58, username: 'lukas', avatar_url: 'https://i1.sndcdn.com/avatars-000001916005-iinh3e-large.jpg' },
      { id: 51, username: 'mikaelpersson', avatar_url: 'https://i1.sndcdn.com/avatars-000000000330-627e91-large.jpg' },
      { id: 1005, username: 'DerTeta', avatar_url: 'https://i1.sndcdn.com/avatars-000000048788-1dabf5-large.jpg' },
      { id: 1001, username: 'eurokai', avatar_url: 'https://i1.sndcdn.com/avatars-000000026652-044652-large.jpg' },
      { id: 11005, username: 'Leinad Resiak', avatar_url: 'https://i1.sndcdn.com/avatars-000130560775-hqhtaw-large.jpg' },
      { id: 11007, username: 'LUEDFE', avatar_url: 'https://i1.sndcdn.com/avatars-000060914748-pyyg3v-large.jpg' },
      { id: 11507, username: 'Kat! Heath!', avatar_url: 'https://i1.sndcdn.com/avatars-000035098562-foj9my-large.jpg' },
      { id: 1503, username: 'doubleday', avatar_url: 'https://i1.sndcdn.com/avatars-000000011692-f39afa-large.jpg' },
      { id: 1501, username: 'thedolphins', avatar_url: 'https://i1.sndcdn.com/avatars-000223352485-hteh4h-large.jpg' },
      { id: 1508, username: 'FAYE', avatar_url: 'https://i1.sndcdn.com/avatars-000226100828-2rr6zt-large.jpg' },
      { id: 41507, username: 'truechains', avatar_url: 'https://i1.sndcdn.com/avatars-000197717169-1zf8lo-large.jpg' },
      { id: 41508, username: 'JESTER RUSH', avatar_url: 'https://i1.sndcdn.com/avatars-000013510454-fsfzwq-large.jpg' },
      { id: 91507, username: 'Manuel Maria', avatar_url: 'https://i1.sndcdn.com/avatars-000253312516-k5nrrd-large.jpg' },
      { id: 91512, username: 'sweetback', avatar_url: 'https://i1.sndcdn.com/avatars-000000755242-4xfsw8-large.jpg' },
      { id: 91519, username: 'Guru87Tech', avatar_url: 'https://i1.sndcdn.com/avatars-000000798894-f1k9ov-large.jpg' },
      { id: 91510, username: 'Ana Rubio', avatar_url: 'https://i1.sndcdn.com/avatars-000000872403-h18cat-large.jpg' },
      { id: 91500, username: 'mistac', avatar_url: 'https://i1.sndcdn.com/avatars-000028730567-9fpmtv-large.jpg' },
      { id: 91504, username: 'pearson', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
      { id: 99501, username: 'entità', avatar_url: 'https://i1.sndcdn.com/avatars-000000583403-al0j43-large.jpg' },
      { id: 99507, username: 'xenmate', avatar_url: 'https://i1.sndcdn.com/avatars-000041644617-nzd2ky-large.jpg' },
      { id: 99500, username: 'Walter Fierce', avatar_url: 'https://i1.sndcdn.com/avatars-000001798270-n4pye1-large.jpg' },
      { id: 99583, username: '_Hollis', avatar_url: 'https://i1.sndcdn.com/avatars-000000814538-wpovmt-large.jpg' },
      { id: 99587, username: 'none-1', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
      { id: 99572, username: 'remixland', avatar_url: 'https://i1.sndcdn.com/avatars-000000593421-456e97-large.jpg' },
      { id: 99585, username: 'dirwood', avatar_url: 'https://i1.sndcdn.com/avatars-000000583441-t9jjr4-large.jpg' },
];
seeds.roomname = 'metal';
seeds.djMaxNum = 4;
seeds.ServerAPI = {
  userId: 1000,
  connect: () => { console.log('socket connecting'); },
  disconnect: () => { console.log('socket connecting'); },
  onUpdate: (callback) => { console.log('Room event'); callback(); },
  joinRoom: () => { console.log('client join room'); },
  login: () => { console.log('Server API login'); },
  onLogin: (callback) => { console.log('client join room'); callback(); },
  enqueue: () => { console.log('SEEDS: Server API enqueue for DJ'); },
  dequeue: () => { console.log('SEEDS: Server API dequeue for DJ'); },
};

seeds.createRoom = (roomName, djNum, userNum, track) => {
  const room = {
    userId: 1000,
    name: roomName,
    track: track,
    timeStamp: Date.now() - 120000,
    djs: seeds.djs.slice(0, djNum),
    currentDj: 2,
    djMaxNum: 4,
    users: seeds.users.slice(0, userNum),
    ServerAPI: seeds.ServerAPI,
  };
  return room;
};

seeds.rooms = {
  0: seeds.createRoom('MIKU', 0, 5, 63029752),
  1: seeds.createRoom('BABYMETAL', 1, 10, 168240777),
  2: seeds.createRoom('Chthonic', 2, 15, 256295090),
  4: seeds.createRoom('SANTANA', 4, 0, 71841625),
};

seeds.widget = {
  songLoc: 0,
  load: () => {},
  setVolume: () => {},
  seekTo: (timeStamp) => { seeds.widget.songLoc = timeStamp; },
  getPosition: () => seeds.widget.songLoc,
};

module.exports = seeds;
