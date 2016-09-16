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
const css = require('../sass/style.sass'); // require our sass!

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
