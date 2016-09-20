import React from 'react';
import $ from 'jquery';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'default room',
    };
  }

  joinRoom(room) {
    this.props.joinRoom(room);
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
                this.props.rooms.map((room) => {
                  return (
                    <li className="row lobby--room list-unstyled" key={room}>
                      <div className="col-sm-10">{room}</div>
                      <div className="col-sm-2 lobby--joinBtn" >
                        <button className="btn btn-default joinBtn" onClick={() => { this.joinRoom(room); }}>
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
