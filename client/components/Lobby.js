import React from 'react';

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
                    <li className="row lobby--room" key={room}>
                      <div className="col-sm-12">
                        {room}
                        <button onClick={() => { this.joinRoom(room); }}> Join </button>
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
