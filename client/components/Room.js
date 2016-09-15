import React from 'react';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'This is a room.',
    };
  }

  render() {
    return (
      <div>
        {this.state.message}
      </div>
    );
  }
}
