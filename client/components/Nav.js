import React from 'react';
import $ from 'jquery';

export default class Nav extends React.Component {
  static toggleLobby() {
    $('#lobby').collapse('toggle');
    $('#playlist').collapse('hide');
  }

  static togglePlaylist() {
    $('#playlist').collapse('toggle');
    $('#lobby').collapse('hide');
  }


  constructor(props) {
    super(props);
    this.state = {
      label: 'SoundDeck!',
    };
  }

  // Toggles the lobby id element to 'active' in CSS => displays Lobby
  toggleLobby() {
    $('#lobby').toggleClass('active');
  }

  // Toggles the playlist id element to 'active' in CSS => displays Playlist
  togglePlaylist() {
    console.log('the playlist click');
    $('#playlist').toggleClass('active');
  }

  // Displays the Lobby button upon user login
  showLobby(){
    if(this.props.userData){
      return (
        <button
          className="btn btn-default"
          disabled={this.props.currentRoom === undefined}
          onClick={Nav.toggleLobby}
          data-toggle="collapse"
          data-target="#lobby"
          aria-expanded="false"
        >
          Lobby
        </button>
      );
    }
    return false;
  }

  showPlaylist() {
    if (this.props.userData) {
      return <button className="btn btn-default" id="PlaylistButton" onClick={Nav.togglePlaylist} data-toggle="collapse" data-target="#playlist" aria-expanded="false"> Playlist </button>;
    }
    return false;
  }

  // Displays Login button or user's Soundcloud username
  toggleSignedIn() {
    // If user signs-in, displays their Soundcloud username in the nav bar
    if (this.props.userData) {
      return <div className="navbar--signedIn"> { this.props.userData.username } </div>;
    }
    // Displays the Login button
    return <button className="btn btn-default" id="LoginButton" onClick={this.props.loggingIn}> Login </button>;
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
                { this.showLobby() }
              </li>
              <li>
                { this.showPlaylist() }
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

// Specifies the prop types for es Linting
Nav.propTypes = {
  currentRoom: React.PropTypes.string,
  loggingIn: React.PropTypes.func.isRequired,
  userData: React.PropTypes.any,
};

// //!-- <button className="btn btn-default" disabled={this.props.currentRoom === undefined} onClick={Nav.toggleRoom}> Lobby </button>
