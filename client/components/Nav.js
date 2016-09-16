import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'SoundDeck!',
    };
  }

  toggleRoom() {
    $('#lobby').toggleClass('active');
  }
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <ul className="nav navbar-nav navbar-left">
            <li>
              <div className="navbar-header">
                <a className="navbar-brand"> {this.state.label} </a>
              </div>
            </li>
            <li>
              <button className="btn btn-default" disabled={this.props.currentRoom===undefined} onClick={this.toggleRoom}> Lobby </button>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <button className="btn btn-default"> playlist </button>
            </li>
            <li>
              <button className="btn btn-default"> login </button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
