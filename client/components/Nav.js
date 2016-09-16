import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'SoundDeck!',
    };
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand"> {this.state.label} </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a> playlist </a>
            </li>
            <li>
              <a> login </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
