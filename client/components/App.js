// neded for bootstrap-sass
import jquery from 'jquery';
// eslint-disable-next-line
// import SC from 'soundcloud'; // don't need to use as SC is global!
import React from 'react';
import Room from './Room';


// bootstrap-sass needs jQuery to be global
window.jQuery = jquery;
window.$ = jquery;

// Do not include styles if testing
if (process.env.NODE_ENV !== 'test') {
  // sass doesn't export anything meaninful so disable lint
  // eslint-disable-next-line
  const css = require('../sass/style.sass'); // require our sass!
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Cool!',
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1>{ this.state.label }</h1>
            <Room />
          </div>
        </div>
      </div>
    );
  }
}
