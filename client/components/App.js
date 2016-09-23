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
    this.update = this.update.bind(this);
  }

  componentWillMount() {
    ServerAPI.connect();
    ServerAPI.onUpdate((data) => {
      console.log("getting data", data)
      let state = this.update(data);
      this.setState(state);
    });
    ServerAPI.onLogin((data) => {
      console.log("login data", data);
    });
  }
  componentDidMount() {
    // quick seeding data
    const djs = [
        { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
        { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
        { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
    ];
    const users = [
          { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
          { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
          { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
          { id: 11, username: 'robert', avatar_url: 'https://i1.sndcdn.com/avatars-000000000050-56eb60-large.jpg' },
          { id: 46, username: 'bjornjeffery', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
          { id: 58, username: 'lukas', avatar_url: 'https://i1.sndcdn.com/avatars-000001916005-iinh3e-large.jpg' },
          { id: 51, username: 'mikaelpersson', avatar_url: 'https://i1.sndcdn.com/avatars-000000000330-627e91-large.jpg' },
    ];
    this.roomData = {
      1: {
        name: 'ROCK',
        track: '',
        djs: [
            { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' }],
        currentDj: 4973508,
        djMaxNum: 4,
        users: users,
      },
      2: {
        name: 'POP',
        track: '',
        djs: [
          { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
          { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
          { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
          { id: 24, username: 'Rouzbeh Delavari', avatar_url: 'https://i1.sndcdn.com/avatars-000128836744-w66epn-large.jpg' },
          ],
        currentDj: 965552,
        djMaxNum: 4,
        users: users,
      },
      3: {
        name: 'DANCE',
        track: '',
        djs: [
          { id: 52, username: 'Van Rivers', avatar_url: 'https://i1.sndcdn.com/avatars-000204704801-1zqjqs-large.jpg' },
        ],
        currentDj: 49,
        djMaxNum: 4,
        users: users,
      },
    };
    this.setState({
          roomIds: [1, 2, 3],
          roomNames: ['ROCK', 'POP', 'DANCE'],
        });
  }

  update(data) {
    let state = {};
    if (data.rooms) {
      this.roomData = data.rooms;
      state.roomIds = this.roomData.map(room => (room.id));
      state.roomNames = this.roomData.map(room => (room.name));
      if (this.state.currentRoom) {
        state.roomName = this.roomData[this.state.currentRoom].name;
        state.users = this.roomData[this.state.currentRoom].users;
        state.dj = this.roomData[this.state.currentRoom].dj;
        state.djMaxNum = this.roomData[this.state.currentRoom].djMaxNum;
        state.track = this.roomData[this.state.currentRoom].track;
        state.currentDj = this.roomData[this.state.currentRoom].currentDj;
      }
    }
    return state;
  }

  joinRoom(roomId) {
    ServerAPI.joinRoom(roomId);
    this.setState({
      currentRoom: this.roomData[roomId],
    });
  }

  loggingIn() {
    console.log("logging in");
    Auth.signin().then((userData) => {
      console.log("logging in", userData);
      ServerAPI.login(userData);
      this.setState({ userData });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <main>
        <Nav currentRoom={this.state.currentRoom} loggingIn={this.loggingIn} userData={this.state.userData} />
        <Lobby roomIds={this.state.roomIds} roomNames={this.state.roomNames} joinRoom={this.joinRoom} />
        <Playlist />
        {
          this.state.currentRoom ? (
            <Room
              name={this.state.currentRoom.name}
              track={this.state.currentRoom.track}
              djs={this.state.currentRoom.djs}
              djMaxNum={this.state.currentRoom.djMaxNum}
              currentDj={this.state.currentRoom.currentDj}
              users={this.state.currentRoom.users}
            />) : null
        }
      </main>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
