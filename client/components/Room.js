import React from 'react';
import SoundCloud from 'react-soundcloud-widget';
//let widget = SC.Widget('react-sc-player');

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'This is a room.',
      track: 'https://soundcloud.com/logic_official/flexicution-1?in=hennessy/sets/never-stop-never-settle',
    };
  }

  render() {
    // <Stage />
    // <Vote />
    // <Crowd />
    return (
      <div className="room">
        <div className="container">
          <h1> {this.props.room} </h1>
          <SoundCloud url={this.state.track} />
        </div>
      </div>
    );
  }
}
