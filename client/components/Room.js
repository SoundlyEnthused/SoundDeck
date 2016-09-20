import React from 'react';
import load from 'load-script';
// let widget = SC.Widget('react-sc-player');

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      track: 'https://soundcloud.com/logic_official/flexicution-1?in=hennessy/sets/never-stop-never-settle',
      users: [],
      djs: [],
    };
    this.widget = null;
  }

  componentDidMount() {
    load('https://w.soundcloud.com/player/api.js', () => {
      this.widget = window.SC.Widget('soundcloudPlayer'); // eslint-disable-line new-cap
      this.widget.show_artwork = false;
      this.widget.load(this.state.track, { show_artwork: false });
    });
    const users = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    const djs = [{ id: 3203, username: 'manyoora', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
    { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
    { id: 9509, username: 'compositeone', avatar_url: 'https://i1.sndcdn.com/avatars-000000607500-271hqp-large.jpg' },
    {}];
    this.setState({
      djs,
      users,
    });
  }

  render() {
    return (
      <div className="room">
        <div className="container">
          <h1> {this.props.room} </h1>

          <div className="stage">
            <div className="stage--djs">
            {
              this.state.djs.map((dj) => {
                if (dj.username) {
                  return (
                    <div className="dj--seat" key={dj.id}>
                      <div className="dj--avatar">
                        <img src={dj.avatar_url} alt={dj.username} title={dj.username} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="dj--seat empty" key={dj.id} />
                );
              })
            }
            </div>

            <iframe id="soundcloudPlayer" className="soundcloudPlayer" width="100%" height="100" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=" />

            <div id="vote" className="vote row">
              <div className="col-xs-4" />
              <div className="vote--btns col-xs-4">
                <button className="btn btn-success btn-round vote--upvote" id="upvote">
                  <i className="fa fa-check" aria-hidden="true" />
                </button>
                <button className="btn btn-danger btn-round vote--downvote" id="downvote">
                  <i className="fa fa-times" aria-hidden="true" />
                </button>
              </div>
              <div className="vote--djQueue col-xs-4">
                <button className="btn btn-default">
                  <span className="fa fa-list" /> 
                  DJ List
                </button>
              </div>
            </div>

          </div>

          <div className="crowd">
            {
              this.state.users.map(() => <div className="crowd--user" />)
            }
          </div>
        </div>
      </div>
    );
  }
}

Room.propTypes = {
  room: React.PropTypes.string,
};
