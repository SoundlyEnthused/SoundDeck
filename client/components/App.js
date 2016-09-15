import React from 'react';
import Room from './Room';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Cool!',
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1>{ this.state.label }</h1>
            <Room />
          </div>
        </div>
      </div>
    );
  }
}
