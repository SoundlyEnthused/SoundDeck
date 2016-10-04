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
/* globals $ */
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
      playlistLength: 0,
    };
    this.me = null;
    this.ServerAPI = null;
    this.roomData = {};
    this.joinRoom = this.joinRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.loggingIn = this.loggingIn.bind(this);
    this.updateOnEvent = this.updateOnEvent.bind(this);
    this.getRoomStates = this.getRoomStates.bind(this);
    this.updatePlaylistLength = this.updatePlaylistLength.bind(this);
  }

  componentWillMount() {
    ServerAPI.connect();
    ServerAPI.onUpdate(this.updateOnEvent);
    ServerAPI.onLogin((data) => {
      console.log('login data', data);
    });
  }

  // Seeding for FE dev
  // componentDidMount(){
  //   let seeds = require('../../test/client/seeds');
  //   this.roomData = seeds.rooms;
  //   let state = this.getRoomStates();
  //   state.roomIds = Object.keys(this.roomData);
  //   state.roomNames = Object.keys(this.roomData).map(roomId => (this.roomData[roomId].name));
  //   this.setState(state);
  // }

  componentDidUpdate() {
    if (this.state.userData && !this.state.currentRoom) {
      $('#lobby').collapse('show');
    }
  }

  getRoomCounts() {
    return Object.keys(this.roomData)
    .map(id => this.roomData[id].users.length
      + this.roomData[id].djs.map(x => (x === null ? 0 : 1)).reduce((a, b) => a + b));
  }

  getDjs() {
    return Object.keys(this.roomData).map(id => this.roomData[id].djs);
  }

  updateOnEvent(data) {
    console.log("App updateOnEvent = ", data);
    this.roomData = data;
    let state = this.getRoomStates();
    state.roomIds = Object.keys(this.roomData);
    state.roomNames = Object.keys(this.roomData).map(roomId => (this.roomData[roomId].name));
    this.setState(state);
  }

  getRoomStates() {
    let state = {};
    if (this.roomData && this.state.currentRoom && (this.state.currentRoom in this.roomData)) {
      const room = this.roomData[this.state.currentRoom];
      state.roomName = room.name;
      state.users = room.users;
      state.djs = room.djs;
      state.djMaxNum = room.djMaxNum;
      state.track = room.track;
      state.timeStamp = room.timeStamp;
      state.currentDj = room.currentDj;
      state.downvoteCount = room.downvoteCount;
    }
    return state;
  }

  joinRoom(roomId) {
    // console.log('join room', roomId);
    this.state.currentRoom = roomId;
    ServerAPI.joinRoom(roomId);
    this.setState(this.getRoomStates());
  }

  updatePlaylistLength(num) {
    this.setState({
      playlistLength: num,
    });
  }

  createRoom(name) {
    const _this = this;
    ServerAPI.createRoom(name, this.state.userData.id, (id) => {
      _this.joinRoom(id);
    });
  }

  loggingIn() {
    Auth.signin().then((userData) => {
      console.log(userData);
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
        <Lobby
          roomIds={this.state.roomIds}
          roomNames={this.state.roomNames}
          roomCounts={this.getRoomCounts()}
          joinRoom={this.joinRoom}
          djs={this.getDjs()}
        />
        <Playlist updatePlaylistLength={this.updatePlaylistLength} />
        {
          this.state.currentRoom ? (
            <Room
              userId={this.state.userData.id}
              name={this.state.roomName}
              track={this.state.track}
              djs={this.state.djs}
              timeStamp={this.state.timeStamp}
              djMaxNum={this.state.djMaxNum}
              currentDj={this.state.currentDj}
              users={this.state.users}
              downvoteCount={this.state.downvoteCount}
              playlistLength={this.state.playlistLength}
              ServerAPI={ServerAPI}
            />) : null
        }

        {
          this.state.userData === false ? <div className="panel"><h1>Please log in.</h1></div> : null
        }
      </main>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
