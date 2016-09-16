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
    console.log('SC in Room', SC);
    return (
      <div className="room">
        <div className="container">
          {this.state.message}
          <SoundCloud url={this.state.track} />
        </div>
      </div>
    );
  }
}
