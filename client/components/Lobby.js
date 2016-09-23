import React from 'react';
import $ from 'jquery';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.handleRoomJoin = this.handleRoomJoin.bind(this);
  }

  handleRoomJoin(roomId) {
    this.props.joinRoom(roomId);
    $('#lobby').toggleClass('active');
  }

  render() {
    return (
      <div id="lobby" className="lobby active">
        <div className="container">
          <h1 className="lobby--title">
            Lobby
          </h1>
          <div className="row">
            <ul className="lobby--roomlist col-sm-12">
              {
                this.props.roomIds.map((roomId, index) => {
                  return (
                    <li className="row lobby--room list-unstyled" key={roomId}>
                      <div className="col-sm-10">{this.props.roomNames[index]}</div>
                      <div className="col-sm-2 lobby--joinBtn" >
                        <button className="btn btn-default joinBtn" onClick={() => { this.handleRoomJoin(roomId); }}>
                          Join
                        </button>
                      </div>
                    </li>
                  );
                })
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
  joinRoom: React.PropTypes.func,
};
