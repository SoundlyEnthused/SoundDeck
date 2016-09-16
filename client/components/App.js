import React from 'react';
import Room from './Room';
import Nav from './Nav';
import Lobby from './Lobby';
//import Login from './Login';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Cool!',
    };
  }

  render() {
    return (
      <main>
        <Nav />
        <Lobby />
        <Room />
      </main>
    );
  }
}
