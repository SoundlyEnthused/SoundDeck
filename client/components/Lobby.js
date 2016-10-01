import React from 'react';
import $ from 'jquery';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.handleRoomJoin = this.handleRoomJoin.bind(this);
  }

  handleRoomJoin(room) {
    var _this = this;

    $('#lobby').collapse('hide', function() {
      console.log('all hidden now');
    });

    window.setTimeout(function() {
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
                this.props.roomIds.map((roomId, index) => {
                  return (
                    <li className="row lobby--room list-unstyled" key={roomId}>
                      <div className="col-xs-10 lobby--roomName">{this.props.roomNames[index]}</div>
                      <div className="col-xs-2 lobby--joinBtn" >
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
