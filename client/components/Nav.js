import React from 'react';
import $ from 'jquery';

export default class App extends React.Component {
  static toggleRoom() {
    $('#lobby').toggleClass('active');
  }

  constructor(props) {
    super(props);
    this.state = {
      label: 'SoundDeck!',
    };
  }

  toggleSignedIn() {
    if (this.props.userData) {
      return <div> { this.props.userData.username } </div>;
    } else {
      return <button className="btn btn-default" onClick={this.props.loggingIn}> Login </button>
    }
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">

          <div className="nav navbar-nav navbar-left">
            <div className="navbar-header">
              <a className="navbar-brand"> 
                <img src="/img/SoundDeck.svg" />
                {this.state.label} 
              </a>

              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <button className="btn btn-default" disabled={this.props.currentRoom===undefined} onClick={this.toggleRoom}> Lobby </button>
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
