import React from 'react';

const DjSeat = props => (
  <div className="dj--seat">
    <div className="dj--avatar">
      <div
        className="avatar"
        src={props.avatar_url}
        alt={props.username}
        title={props.username}
        data-placement="bottom"
        data-animation="true"
        data-toggle="tooltip"
        data-likes={props.likes || 0}
        data-strikes={props.strikes}
      >
        <img src={props.avatar_url} alt={props.username} />
      </div>
    </div>
  </div>
);

DjSeat.propTypes = {
  avatar_url: React.PropTypes.string,
  username: React.PropTypes.string,
  likes: React.PropTypes.number,
  strikes: React.PropTypes.number,
};

export default DjSeat;
