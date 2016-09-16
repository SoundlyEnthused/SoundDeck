// neded for bootstrap-sass
import jquery from 'jquery';
// eslint-disable-next-line
import SC from 'soundcloud'; // don't need to use as SC is global!
import React from 'react';
import Room from './Room';
import Nav from './Nav';
import Lobby from './Lobby';
//import Login from './Login';

// bootstrap-sass needs jQuery to be global
window.jQuery = jquery;
window.$ = jquery;

// sass doesn't export anything meaninful so disable lint
// eslint-disable-next-line
const css = require('../sass/style.scss'); // require our sass!

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoom: undefined,
      label: 'Cool!',
    };
  }
  joinRoom(room) {
    this.setState({
      currentRoom: room,
    });
  }

  render() {
    return (
      <main>
        <Nav currentRoom={this.state.currentRoom} />
        <Lobby rooms={['default', 'pop', 'metal']} joinRoom={this.joinRoom.bind(this)} />
        <Room />
      </main>
    );
  }
}