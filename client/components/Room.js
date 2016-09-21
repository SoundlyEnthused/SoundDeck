import React from 'react';
import load from 'load-script';
import SC from 'soundcloud';
import $ from 'jquery';
// let widget = SC.Widget('react-sc-player');

export default class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      track: 'https://soundcloud.com/logic_official/flexicution-1?in=hennessy/sets/never-stop-never-settle',
      users: [],
      djs: [
        { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
        { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
        { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
        {},
      ],
    };
    this.widget = null;
  }

  componentDidMount() {
    load('https://w.soundcloud.com/player/api.js', () => {
      this.widget = window.SC.Widget('soundcloudPlayer'); // eslint-disable-line new-cap
      this.widget.show_artwork = false;
      this.widget.load(this.state.track, { show_artwork: false });
    });

    const _this = this;
    SC.get('/users').then(function(res) {
      let users = res.map(function(user) {
        return {
          username: user.username,
          id: user.id,
          avatar_url: user.avatar_url,
        };
      });

      console.log(users);

      _this.setState({
        users: users,
      });
    });
  }

  componentDidUpdate() {
    $('.avatar').tooltip();
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
                        <img className="avatar"
                          src={dj.avatar_url}
                          alt={dj.username}
                          title={dj.username}
                          data-placement="bottom"
                          data-animation="true"
                          data-toggle="tooltip" />
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
              this.state.users.map((user) => {
              return (
                <div className="crowd--user">
                  <img className="avatar"
                    src={user.avatar_url}
                    title={user.username}
                    alt={user.username}
                    data-placement="bottom"
                    data-animation="true"
                    data-toggle="tooltip" />

                </div>
              )
              })
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
