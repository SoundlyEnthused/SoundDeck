import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'default room',
    };
  }

  render() {
    return (
      <div className="lobby">
        <div className="container">
          <h1 className="lobby--title">
            Lobby
          </h1>
          <div className="row">
            <ul className="lobby--roomlist col-sm-12">
              <li className="row lobby--room">
                <div className="col-sm-12">
                  {this.state.label}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
