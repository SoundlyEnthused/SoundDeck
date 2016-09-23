// neded for bootstrap-sass
import jquery from 'jquery';

// eslint-disable-next-line
import SC from 'soundcloud'; // don't need to use as SC is global!
import React from 'react';
import Playlist from './Playlist';
import Room from './Room';
import Nav from './Nav';
import Lobby from './Lobby';
import Auth from './Auth';
import ServerAPI from '../models/ServerAPI';

// bootstrap-sass needs jQuery to be global
global.jQuery = jquery;
global.$ = jquery;
require('bootstrap-sass');  // import doesn't work for some reason

// Do not include styles if testing
if (process.env.NODE_ENV !== 'test') {
  // sass doesn't export anything meaninful so disable lint
  // eslint-disable-next-line
  const css = require('../sass/style.scss'); // require our sass!
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: false,
      roomIds: [],
      roomNames: [],
      currentRoom: undefined,
    };
    this.roomData = {};
    this.joinRoom = this.joinRoom.bind(this);
    this.loggingIn = this.loggingIn.bind(this);
    this.updateOnEvent = this.updateOnEvent.bind(this);
    this.getRoomStates = this.getRoomStates.bind(this);
  }

  componentWillMount() {
    ServerAPI.connect();
    ServerAPI.onUpdate(this.update);
    ServerAPI.onLogin((data) => {
      console.log('login data', data);
    });
  }
  componentDidMount() {
    // quick seeding data
    const users = [
          { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
          { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
          { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
          { id: 11, username: 'robert', avatar_url: 'https://i1.sndcdn.com/avatars-000000000050-56eb60-large.jpg' },
          { id: 46, username: 'bjornjeffery', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
          { id: 58, username: 'lukas', avatar_url: 'https://i1.sndcdn.com/avatars-000001916005-iinh3e-large.jpg' },
          { id: 51, username: 'mikaelpersson', avatar_url: 'https://i1.sndcdn.com/avatars-000000000330-627e91-large.jpg' },
          { id: 1005, username: 'DerTeta', avatar_url: 'https://i1.sndcdn.com/avatars-000000048788-1dabf5-large.jpg' },
          { id: 1000, username: 'shaka', avatar_url: 'https://i1.sndcdn.com/avatars-000001116755-hhusd1-large.jpg' },
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
    this.roomData = {
      1: {
        name: 'ROCK',
        track: 168240777,
        djs: [
            { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' }],
        currentDj: 4973508,
        djMaxNum: 4,
        users: users,
      },
      2: {
        name: 'POP',
        track: 59102642,
        djs: [
          { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
          { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
          { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
          { id: 24, username: 'Rouzbeh Delavari', avatar_url: 'https://i1.sndcdn.com/avatars-000128836744-w66epn-large.jpg' },
          ],
        currentDj: 965552,
        djMaxNum: 4,
        users: users.slice(20),
      },
      3: {
        name: 'DANCE',
        track: 105563310,
        djs: [
          { id: 52, username: 'Van Rivers', avatar_url: 'https://i1.sndcdn.com/avatars-000204704801-1zqjqs-large.jpg' },
        ],
        currentDj: 49,
        djMaxNum: 4,
        users: users.slice(10, 13),
      },
    };
    this.setState({
          roomIds: [1, 2, 3],
          roomNames: ['ROCK', 'POP', 'DANCE'],
        });
  }

  // update when rooms event
  updateOnEvent(data) {
    this.roomData = data.rooms;
    let state = {};
    state.roomIds = this.roomData.map(room => (room.id));
    state.roomNames = this.roomData.map(room => (room.name));
    state.extendthis.getRoomStates();
    this.setState(state);
  }

  getRoomStates() {
    let state = {};
    if (this.roomData && this.state.currentRoom && (this.state.currentRoom in this.roomData)) {
      state.roomName = this.roomData[this.state.currentRoom].name;
      state.users = this.roomData[this.state.currentRoom].users;
      state.djs = this.roomData[this.state.currentRoom].djs;
      state.djMaxNum = this.roomData[this.state.currentRoom].djMaxNum;
      state.track = this.roomData[this.state.currentRoom].track;
      state.currentDj = this.roomData[this.state.currentRoom].currentDj;
    }
    return state;
  }

  joinRoom(roomId) {
    console.log('join room', roomId);
    ServerAPI.joinRoom(roomId);
    this.state.currentRoom = roomId;
    this.setState(this.getRoomStates());
  }

  loggingIn() {
    Auth.signin().then((userData) => {
      ServerAPI.login(userData);
      this.setState({ userData });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    console.log('render', this.state)
    return (
      <main>
        <Nav currentRoom={this.state.currentRoom} loggingIn={this.loggingIn} userData={this.state.userData} />
        <Lobby roomIds={this.state.roomIds} roomNames={this.state.roomNames} joinRoom={this.joinRoom} />
        <Playlist />
        {
          this.state.currentRoom ? (
            <Room
              name={this.state.roomName}
              track={this.state.track}
              djs={this.state.djs}
              djMaxNum={this.state.djMaxNum}
              currentDj={this.state.currentDj}
              users={this.state.users}
            />) : null
        }
      </main>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
