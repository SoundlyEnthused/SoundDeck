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
      rooms: [],
      roomNames: [],
      currentRoom: undefined,
      track: '',
      users: [],
      djs: [],
      djMaxNum: 4,
      currentDj: -1,
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.loggingIn = this.loggingIn.bind(this);
    this.update = this.update.bind(this);
  }

  componentWillMount() {
    ServerAPI.connect();
    ServerAPI.onUpdate((data) => {
      this.update(data);
    });
  }
  componentDidMount() {
    this.setState({
      rooms: [1, 2, 3],
      roomNames: ['ROCK', 'POP', 'DANCE'],
    });
  }

  update(data) {
    const state = {};
    if (data.rooms) {
      /*
      data.rooms = [{
        id: 0,
        name: "",
        track: "",
        djs: [{user}],
        currentDj: user,
        djMaxNum: 4,
        users: [{user}],
      }]
      */
      state.rooms = data.rooms.map(room => (room.id));
      state.roomNames = data.rooms.map(room => (room.name));
      if (this.state.currentRoom) {
        state.roomName = data.rooms[this.state.currentRoom].name;
        state.users = data.rooms[this.state.currentRoom].users;
        state.dj = data.rooms[this.state.currentRoom].dj;
        state.track = data.rooms[this.state.currentRoom].track;
        state.currentDj = data.rooms[this.state.currentRoom].currentDj;
      }
    }
  }

  joinRoom(room) {
    ServerAPI.joinRoom(room.id);
    this.setState({
      currentRoom: room,
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
        <Playlist />
        <Lobby rooms={this.state.rooms} roomNames={this.state.roomNames} joinRoom={this.joinRoom} />
        {
          this.state.currentRoom ? <Room room={this.state.currentRoom} /> : null
        }
      </main>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
