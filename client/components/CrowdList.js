import React from 'react';
import CrowdUser from './CrowdUser';

const CrowdList = props => (
  <div className="crowd">
    {
      props.users.map(user => (
        <CrowdUser
          username={user.username}
          likes={user.likes}
          avatar_url={user.avatar_url}
          key={user.username}
        />
      ))
    }
  </div>
);

CrowdList.propTypes = {
  users: React.PropTypes.array.isRequired,
};

export default CrowdList;
