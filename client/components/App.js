// neded for bootstrap-sass
import jquery from 'jquery';

// eslint-disable-next-line
import SC from 'soundcloud'; // don't need to use as SC is global!
import React from 'react';
import Room from './Room';
import Nav from './Nav';
import Lobby from './Lobby';
import Auth from './Auth';
// import Login from './Login';

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
      currentRoom: undefined,
      userData: false,
      label: 'Cool!',
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.loggingIn = this.loggingIn.bind(this);
  }
  joinRoom(room) {
    this.setState({
      currentRoom: room,
    });
  }
  loggingIn() {
    Auth.signin().then((userData) => {
      this.setState({ userData });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <main>
        <Nav currentRoom={this.state.currentRoom} loggingIn={this.loggingIn} userData={this.state.userData} />
        <Lobby rooms={['default', 'pop', 'metal']} joinRoom={this.joinRoom} />
        {
          this.state.currentRoom ? <Room room={this.state.currentRoom} /> : null
        }
      </main>
    );
  }
}
