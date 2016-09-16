import React from 'react';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'This is a room.',
    };
  }

  renderPlayer() {
    return SC.oEmbed('http://soundcloud.com/forss/flickermood', {
      auto_play: true
    }).then(function(embed){
      console.log('oEmbed response: ', embed.html);
      return embed.html
    });
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
          {
            //this.renderPlayer()
          }
        </div>
      </div>
    );
  }
}
