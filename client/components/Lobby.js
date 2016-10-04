import React from 'react';
import $ from 'jquery';
import RoomSummary from './RoomSummary';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.handleRoomJoin = this.handleRoomJoin.bind(this);
  }

  handleRoomJoin(room) {
    const _this = this;

    $('#lobby').collapse('hide', () => {
      console.log('all hidden now');
    });

    window.setTimeout(() => {
      _this.props.joinRoom(room);
    }, 350);
  }

  render() {
    return (
      <div id="lobby" className="lobby collapse">
        <div className="container">
          <h1 className="lobby--title">
            Lobby
          </h1>
          <div className="row">
            <ul className="lobby--roomlist col-sm-12">
              {
                this.props.roomIds.map((roomId, index) => (
                  <RoomSummary
                    name={this.props.roomNames[index]}
                    count={this.props.roomCounts[index]}
                    djs={this.props.djs[index]}
                    key={roomId}
                    onJoinClick={() => this.handleRoomJoin(roomId)}
                  />
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  roomIds: React.PropTypes.array,
  roomNames: React.PropTypes.array,
  roomCounts: React.PropTypes.array,
  joinRoom: React.PropTypes.func,
  djs: React.PropTypes.array,
};
