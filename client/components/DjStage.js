import React from 'react';
import DjSeat from './DjSeat';

const DjStage = props => (
  <div className="stage--djs">
    {
      props.djs.map((dj, index) => {
        if (dj && dj.username) {
          return (
            <DjSeat
              avatar_url={dj.avatar_url}
              likes={dj.likes}
              username={dj.username}
              key={dj.id}
            />);
        }
        return <div className="dj--seat empty" key={index} />;
      })
    }
  </div>
);

DjStage.propTypes = {
  djs: React.PropTypes.array.isRequired,
};

export default DjStage;
