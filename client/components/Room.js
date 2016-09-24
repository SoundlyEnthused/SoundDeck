import React from 'react';
import load from 'load-script';
import SC from 'soundcloud';
import $ from 'jquery';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    console.log('room init', this.props)
    const state = this.processProps(this.props);
    this.state = state;
    this.widget = null;
    this.updataTrack = false;
    this.handleMute = this.handleMute.bind(this);
  }

  // componentDidMount invoked only once on the client side immediately after the initial rendering
  componentDidMount() {
    // Load SoundCloud widget
    load('https://w.soundcloud.com/player/api.js', () => {
      this.widget = window.SC.Widget('soundcloudPlayer'); // eslint-disable-line new-cap
      this.widget.show_artwork = false;
      this.widget.load('https://api.soundcloud.com/tracks/' + this.state.track, { show_artwork: false, auto_play: true });
      this.handleMute();
    });
    $('.avatar').tooltip();
  }

  componentWillReceiveProps(nextProps) {
    const state = this.processProps(nextProps);
    this.updataTrack = true;
    if (this.state.track === state.track) {
      this.updataTrack = false;
    }
    this.setState(state);
  }

  // componentDidUpate invoked immediately after the component's updates are flushed to the DOM
  componentDidUpdate() {
    if (this.widget && this.updataTrack) {
      this.widget.load('https://api.soundcloud.com/tracks/' + this.state.track, { show_artwork: false, auto_play: true });
    }
  }

  handleMute() {
    this.setState({
      mute: this.state.mute * -1 || -1,
    });

    if (this.state.mute === -1) {
      this.widget.setVolume(0);
    } else {
      this.widget.setVolume(75);
    }
  }
  processProps(nextProps) {
    const djArray = this.processDjs(nextProps.djs, nextProps.djMaxNum);
    return {
      name: nextProps.name,
      track: nextProps.track,
      timeStamp: nextProps.timeStamp,
      djs: djArray,
      currentDj: nextProps.currentDj,
      users: nextProps.users,
    };
  }

  processDjs(djList, djMaxNum) {
    const djSeats = djList.slice();
    while (djSeats.length < djMaxNum) {
      djSeats.push(null);
    }
    return djSeats;
  }

  render() {
    return (
      <div className="room">
        <div className="container">
          <h1> {this.state.name} </h1>
          <div className="stage">
            <div className="stage--djs">
            {
              this.state.djs.map((dj, index) => {
                if (dj && dj.username) {
                  return (
                    <div className="dj--seat" key={dj.id}>
                      <div className="dj--avatar">
                        <img
                          className="avatar"
                          src={dj.avatar_url}
                          alt={dj.username}
                          title={dj.username}
                          data-placement="bottom"
                          data-animation="true"
                          data-toggle="tooltip"
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="dj--seat empty" key={index} />
                );
              })
            }
            </div>

            <iframe
              id="soundcloudPlayer"
              className="soundcloudPlayer"
              width="100%"
              height="100"
              scrolling="no"
              frameBorder="no"
              src="https://w.soundcloud.com/player/?url="
            />

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
                <button className="btn btn-default btn-round">
                  <span className="fa fa-list" />
                </button>

                <button className="vote--muteBtn btn btn-default btn-round" onClick={this.handleMute}>
                  {this.state.mute === -1 ? <span className="fa fa-volume-up" /> : <span className="fa fa-volume-off" />}
                </button>
              </div>
            </div>

          </div>

          <div className="crowd">
            {
              this.state.users.map((user) => {
                return (
                  <div className="crowd--user" key={user.username}>
                    <div
                      className="avatar"
                      title={user.username}
                      data-placement="bottom"
                      data-animation="true"
                      data-toggle="tooltip"
                      data-likes={5}
                    >
                      <img src={user.avatar_url} alt={user.username} />
                    </div>
                  </div>
                );
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
