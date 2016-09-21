import React from 'react';
import $ from 'jquery';

export default class Nav extends React.Component {
  static toggleRoom() {
    $('#lobby').toggleClass('active');
  }

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
      return <button className="btn btn-default" onClick={this.togglePlaylist}> playlist </button>;
    }
    return false;
  }

  toggleSignedIn() {
    if (this.props.userData) {
      return <div> { this.props.userData.username } </div>;
    }

    return <button className="btn btn-default" onClick={this.props.loggingIn}> Login </button>;
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="nav navbar-nav navbar-left">
            <div className="navbar-header">
              <a className="navbar-brand">
                <img src="/img/SoundDeck.svg" alt="SoundDeck" />
                {this.state.label}
              </a>

              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <button className="btn btn-default" disabled={this.props.currentRoom === undefined} onClick={this.toggleRoom}> Lobby </button>
              </li>
              <li>
                <button className="btn btn-default"> Playlist </button>
              </li>
              <li>
                { this.toggleSignedIn() }
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  currentRoom: React.PropTypes.string,
  loggingIn: React.PropTypes.func.isRequired,
  userData: React.PropTypes.any,
};
