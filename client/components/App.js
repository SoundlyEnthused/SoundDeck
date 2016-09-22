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
      this.update(data);
    });
  }
  componentDidMount() {
    // quick seeding data
    this.setState({
      roomIds: [1, 2, 3],
      roomNames: ['ROCK', 'POP', 'DANCE']
    });
  }

  update(data) {
    const state = {};
    if (data.rooms) {
      this.roomData = data.rooms;
      state.rooms = this.roomData.map(room => (room.id));
      state.roomNames = this.roomData.map(room => (room.name));
      if (this.state.currentRoom) {
        state.roomName = this.roomData[this.state.currentRoom].name;
        state.users = this.roomData[this.state.currentRoom].users;
        state.dj = this.roomData[this.state.currentRoom].dj;
        state.track = this.roomData[this.state.currentRoom].track;
        state.currentDj = this.roomData[this.state.currentRoom].currentDj;
      }
    }
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
          this.state.currentRoom ? <Room room={this.state.currentRoom} /> : null
        }
      </main>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
