import React from 'react';

export default class MyComponent extends React.Component {
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
          </div>
        </div>
      </div>
    );
  }
}
