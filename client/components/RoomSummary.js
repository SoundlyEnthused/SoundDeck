import React from 'react';

const RoomSummary = props => (
  <li className="lobby--room list-unstyled">
    <div className="lobby--roomWrapper">
    <div className="lobby--roomname">{props.name}</div>

    <div className="lobby--join" >
      {
        props.djs.map((dj, idx) =>
          (dj !== null
          ? <div className="active-dj-slot" key={idx}><img src={dj.avatar_url} alt="active dj" /></div>
          : <div className="empty-dj-slot" key={idx} />)
        )
      }
      <span className="roomcount">{props.count}</span>
      <button className="btn btn-primary joinBtn" onClick={props.onJoinClick}>
        Join
      </button>
    </div>
    </div>
  </li>
);

RoomSummary.propTypes = {
  name: React.PropTypes.string,
  count: React.PropTypes.number,
  djs: React.PropTypes.array,
  onJoinClick: React.PropTypes.func,
};

export default RoomSummary;
