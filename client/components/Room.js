import React from 'react';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'This is a room.',
    };
  }

  render() {
    // <Stage />
    // <Vote />
    // <Crowd />
    return (
      <div className="room">
        {this.state.message}
      </div>
    );
  }
}
