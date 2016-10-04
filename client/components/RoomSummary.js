import React from 'react';

export default class RoomSummary extends React.Component {
  render() {
    return (
      <li className="row lobby--room list-unstyled">
        <div className="col-sm-1">
          <span className="roomname">{this.props.name}</span>
        </div>
        <div className="col-sm-2">
          {
            this.props.djs.map((dj, idx) =>
              (dj !== null
              ? <div className="active-dj-slot" key={idx} />
              : <div className="empty-dj-slot" key={idx} />)
            )
          }
          <span className="roomcount">{this.props.count}</span>
        </div>
        <div className="col-sm-10 lobby--joinBtn" >
          <button className="btn btn-default joinBtn" onClick={this.props.onJoinClick}>
          Join
          </button>
        </div>
      </li>
    );
  }
}

RoomSummary.propTypes = {
  name: React.PropTypes.string,
  count: React.PropTypes.number,
  djs: React.PropTypes.array,
  onJoinClick: React.PropTypes.func,
};
