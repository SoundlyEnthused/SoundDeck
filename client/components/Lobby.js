import React from 'react';
import $ from 'jquery';
import RoomSummary from './RoomSummary';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.handleRoomJoin = this.handleRoomJoin.bind(this);
    this.handleRoomCreate = this.handleRoomCreate.bind(this);
  }

  handleRoomJoin(room) {
    const _this = this;

    $('#lobby').collapse('hide');
    // wait for animation to finish
    window.setTimeout(() => {
      _this.props.joinRoom(room);
    }, 350);
  }

  handleRoomCreate(e) {
    const _this = this;

    e.preventDefault();
    $('#lobby').collapse('hide');

    window.setTimeout(() => {
      _this.props.createRoom($('#newRoomName').val());
      $('#newRoomName').val('');
    });
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
              <li className="row lobby--room list-unstyled">
                <form onSubmit={this.handleRoomCreate}>
                  <div className="col-xs-10">
                    <input type="text" minLength="3" maxLength="35" id="newRoomName" className="form-control" />
                  </div>
                  <div className="col-xs-2" >
                    <button type="submit" id="createRoomBtn" className="btn btn-primary form-control">Add Room </button>
                  </div>
                </form>
              </li>
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
