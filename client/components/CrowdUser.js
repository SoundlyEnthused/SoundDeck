import React from 'react';
// key={user.username}
const CrowdUser = props => (
  <div className="crowd--user" >
    <div
      className="avatar"
      title={props.username}
      data-placement="bottom"
      data-animation="true"
      data-toggle="tooltip"
      data-likes={props.likes}
    >
      <img src={props.avatar_url} alt={props.username} />
    </div>
  </div>
);

CrowdUser.propTypes = {
  avatar_url: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  likes: React.PropTypes.number.isRequired,
};

export default CrowdUser;
