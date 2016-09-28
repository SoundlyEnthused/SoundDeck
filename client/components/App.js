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
    this.me = null;
    this.ServerAPI = null;
    this.roomData = {};
    this.joinRoom = this.joinRoom.bind(this);
    this.loggingIn = this.loggingIn.bind(this);
    this.updateOnEvent = this.updateOnEvent.bind(this);
    this.getRoomStates = this.getRoomStates.bind(this);
  }

  componentWillMount() {
    ServerAPI.connect();
    ServerAPI.onUpdate(this.updateOnEvent);
    ServerAPI.onLogin((data) => {
      console.log('login data', data);
    });
  }

  // Seeding for FE dev
  componentDidMount(){
    let seeds = require('../../test/client/seeds');
    this.roomData = seeds.rooms;
    let state = this.getRoomStates();
    state.roomIds = Object.keys(this.roomData);
    state.roomNames = Object.keys(this.roomData).map(roomId => (this.roomData[roomId].name));
    this.setState(state);
  }

  componentDidUpdate() {
    if (this.state.userData && !this.state.currentRoom) {
      $('#lobby').collapse('show');
    }
  }

  updateOnEvent(data) {
    // console.log("app event", data);
    // this.roomData = data;
    // let state = this.getRoomStates();
    // state.roomIds = Object.keys(this.roomData);
    // state.roomNames = Object.keys(this.roomData).map(roomId => (this.roomData[roomId].name));
    // this.setState(state);
  }

  getRoomStates() {
    let state = {};
    if (this.roomData && this.state.currentRoom && (this.state.currentRoom in this.roomData)) {
      state.roomName = this.roomData[this.state.currentRoom].name;
      state.users = this.roomData[this.state.currentRoom].users;
      state.djs = this.roomData[this.state.currentRoom].djs;
      state.djMaxNum = this.roomData[this.state.currentRoom].djMaxNum;
      state.track = this.roomData[this.state.currentRoom].track;
      state.timeStamp = this.roomData[this.state.currentRoom].timeStamp;
      state.currentDj = this.roomData[this.state.currentRoom].currentDj;
    }
    return state;
  }

  joinRoom(roomId) {
    // console.log('join room', roomId);
    this.state.currentRoom = roomId;
    ServerAPI.joinRoom(roomId);
    this.setState(this.getRoomStates());
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
        <Lobby roomIds={this.state.roomIds} roomNames={this.state.roomNames} joinRoom={this.joinRoom} />
        <Playlist />
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
