import React from 'react';
import Room from './Room';
import Nav from './Nav';
import Lobby from './Lobby';
//import Login from './Login';

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
