import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'SoundDeck!',
    };
  }

  toggleLobby() {
    $('#lobby').toggleClass('active');
  }

  togglePlaylist() {
    $('#playlist').toggleClass('active');
  }

  showPlaylist() {
    if (this.props.userData) {
      return <button className="btn btn-default" onClick={this.togglePlaylist}> playlist </button>
    } else {
      return false;
    }
  }

  toggleSignedIn() {
    if (this.props.userData) {
      return <div> { this.props.userData.username } </div>;
    } else {
      return <button className="btn btn-default" onClick={this.props.loggingIn}> login </button>
    }
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
              <button className="btn btn-default" disabled={this.props.currentRoom===undefined} onClick={this.toggleLobby}> Lobby </button>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              { this.showPlaylist() }
            </li>
            <li>
              { this.toggleSignedIn() }
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
