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
window.jQuery = jquery;
window.$ = jquery;

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
      let state = this.update(data);
      this.setState(state);
    });
  }
  componentDidMount() {
    // quick seeding data
    this.roomData = {
      1: {
        name: 'ROCK',
        track: '',
        djs: [
            { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' }],
        currentDj: "user",
        djMaxNum: 4,
        users: [{}, {}, {}, {}],
      },
      2: {
        name: 'POP',
        track: '',
        djs: [
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' }],
        currentDj: "",
        djMaxNum: 4,
        users: [{}, {}, {}, {}],
      },
      3: {
        name: 'DANCE',
        track: '',
        djs: [],
        currentDj: "",
        djMaxNum: 4,
        users: [{}, {}, {}, {}],
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
    Auth.signin().then((userData) => {
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
