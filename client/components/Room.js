import React from 'react';
import load from 'load-script';
import SC from 'soundcloud';
import $ from 'jquery';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    const state = this.processProps(this.props);
    this.state = state;
    /*
      State object includes:
      { name
        track
        timeStamp
        djs
        currentDj
        isDJ
        users }
    */
    this.mute = false;  // can't set this.mute as state, otherwise it will render iframe for some reason
    this.player = null; // new html5 audio player
    this.infoImage = null;
    this.infoArtist = null;
    this.infoTrack = null;
    this.trackProgress = null;
    this.updataTrack = false;
    this.currentDj = null;
    this.handleMute = this.handleMute.bind(this);
    this.handleDjQueue = this.handleDjQueue.bind(this);
    this.downvote = this.downvote.bind(this);
    this.upvote = this.upvote.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
  }

  // componentDidMount invoked only once on the client side immediately after the initial rendering
  componentDidMount() {
    this.player = document.getElementById('player');
    this.infoImage = document.getElementById('infoImage');
    this.infoArtist = document.getElementById('infoArtist');
    this.infoTrack = document.getElementById('infoTrack');
    this.trackProgress = document.getElementById('progressBar');

    this.initPlayer();
    this.highlightDj();
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
    if (this.player && this.updataTrack) {
      this.initPlayer();
    }
    this.highlightDj();
    $('.avatar').tooltip();
    console.log('tooltips');
  }

  // ********************
  // Room functions
  // ********************
  initPlayer() {
    const _this = this;
    // check current time vs. time stamp
    const timeDiff = (Date.now() - this.state.timeStamp) / 1000;
    if(!this.state.track) {
      player.pause();
      player.currentTime = 0;
      _this.infoArtist.innerHTML = 'N/A';
      _this.trackProgress.style.width = '0';
      _this.infoTrack.innerHTML = 'No available tracks';
      _this.infoImage.setAttribute('src', 'img/spinner.svg');
    } else {
      SC.get(`/tracks/${this.state.track}`).catch((err) => {
        console.log('loading err', err);
        player.pause();
        player.currentTime = 0;
        _this.infoArtist.innerHTML = 'LOADING ERROR';
        _this.trackProgress.style.width = '0';
        _this.infoTrack.innerHTML = 'Reloading...';
        _this.infoImage.setAttribute('src', 'img/user.svg');
        setTimeout(_this.initPlayer, 3000);
      }).then((sound) => {
        if (sound.errors) {
          console.log('Error', sound.errors);
        } else {
          player.crossOrigin = 'anonymous';
          player.setAttribute('src', `${sound.stream_url}?client_id=${process.env.CLIENT_ID}`);
          player.play();

          // if current time is larger than time stamp, skip some part of the song
          if (timeDiff > 0) {
            _this.player.currentTime = timeDiff;
          }

          const image = sound.artwork_url ? sound.artwork_url : sound.user.avatar_url; // if no track artwork exists, use the user's avatar.
          _this.infoImage.setAttribute('src', image);
          _this.infoImage.setAttribute('alt', sound.user.username);
          _this.infoArtist.innerHTML = sound.user.username;
          _this.infoTrack.innerHTML = sound.title;

          const ctx = new AudioContext();
          const audioSrc = ctx.createMediaElementSource(player);
          const analyser = ctx.createAnalyser();

          audioSrc.connect(analyser);
          audioSrc.connect(ctx.destination);

          const frequencyData = new Uint8Array(analyser.frequencyBinCount);
          console.log('frequencyData outside', frequencyData);

          renderFrame(frequencyData);

          function renderFrame(frequencyData) {
            const bars = document.getElementsByClassName('bar');
            requestAnimationFrame(renderFrame.bind(null, frequencyData));
            analyser.getByteFrequencyData(frequencyData);

            // loop through divs in visualizer and render heights
            for (let i = 0; i < 32; i++) {
              let h = ((frequencyData[i]) / 256) * 100;
              h = h * Math.sin((i + 0.3) / 10);
              bars[i].style.height = h < 100 ? `${h}%` : '100%';
            }
            // update play position in player UI
            _this.trackProgress.style.width = `${(player.currentTime / player.duration) * 100}%`;
          }
        }
      });
    }
  }

  handleMute() {
    if (this.player.volume === 1) {
      this.player.volume = 0;
      this.setState({
        mute: true,
      });
    } else if (this.player.volume === 0) {
      this.player.volume = 1;
      this.setState({
        mute: false,
      });
    }
  }

  handleDjQueue() {
    if (this.state.isDJ) {
      this.props.ServerAPI.dequeue();
    } else {
      this.props.ServerAPI.enqueue();
    }
  }

  highlightDj() {
    $('.dj--seat').removeClass('current');

    if (this.props.djs.length > 0) {
      $(`.dj--seat:nth-child(${this.state.currentDj + 1})`).addClass('current');
    }
  }

  processProps(nextProps) {
    // const djArray = this.processDjs(nextProps.djs, nextProps.djMaxNum);
    const djArray = nextProps.djs;
    const isDJ = nextProps.djs.map(dj => dj !== null ? dj.id : null).includes(this.props.userId);
    return {
      name: nextProps.name,
      track: nextProps.track,
      timeStamp: nextProps.timeStamp,
      djs: djArray,
      currentDj: nextProps.currentDj,
      isDJ,
      users: nextProps.users,
      downvoteCount: nextProps.downvoteCount,
    };
  }

  // processDjs(djList, djMaxNum) {
  //   const djSeats = djList.slice();
  //   while (djSeats.length < djMaxNum) {
  //     djSeats.push(null);
  //   }
  //   return djSeats;
  // }

  upvote() {
    const djList = this.state.djs;
    const currentDjObj = djList[this.state.currentDj];
    const isDJ = this.props;
    const currentDjId = currentDjObj.id;
    if (currentDjObj.id === isDJ.userId) {
      return;
    }
    if (currentDjObj) {
      if (currentDjId) {
        this.props.ServerAPI.upvote(currentDjId, this.state.track);
      }
    }

    // $('.vote--upvote').addClass('upvoteActive').delay(2500).removeClass('upvoteActive');
    document.getElementsByClassName('vote--upvote')[0].classList.add('upvoteActive');
    const timeout = window.setTimeout(() => {
      document.getElementsByClassName('vote--upvote')[0].classList.remove('upvoteActive');
      clearTimeout(timeout);
    }, 1200);
  }

  downvote() {
    const djList = this.state.djs;
    const currentDjObj = djList[this.state.currentDj];
    const isDJ = this.props;
    if (currentDjObj.id === isDJ.userId) {
      return;
    }
    if (currentDjObj) {
      const currentDjId = currentDjObj.id;
      if (currentDjId) {
        this.props.ServerAPI.downvote(currentDjId, this.state.track);
      }
    }

    document.getElementsByClassName('vote--downvote')[0].classList.add('downvoteActive');
    const timeout = window.setTimeout(() => {
      document.getElementsByClassName('vote--downvote')[0].classList.remove('downvoteActive');
      clearTimeout(timeout);
    }, 1200);
  }

  render() {
    const activeDJs = this.state.djs.filter(d => d).length;
    const maxVotes = (this.state.users.length + activeDJs) * 0.4;

    console.log('my id', this.state.djs);

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
                        <div
                          className="avatar"
                          src={dj.avatar_url}
                          alt={dj.username}
                          title={dj.username}
                          data-placement="bottom"
                          data-animation="true"
                          data-toggle="tooltip"
                          data-likes={dj.likes || 0}
                        >
                          <img src={dj.avatar_url} alt={dj.username} />
                        </div>
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

            <div className="visualizer">
              <div id="spectrum">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />

                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />

                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />

                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </div>

            <div className="player">
              <img src="" alt="" id="infoImage" className="player--image" width="100" height="100" />
              <h2 id="infoArtist" className="player--artist" />
              <h3 id="infoTrack" className="player--track" />
              <audio id="player" loop autoPlay preload />
              <div className="progress player--progress">
                <div
                  className="progress-bar progress-bar-primary progress-bar-striped active"
                  role="progressbar"
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: '0%' }}
                  id="progressBar"
                />
              </div>
            </div>

            <div id="vote" className="vote row">
              <div className="col-xs-4 vote--meter">
                <p>Downvotes</p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-danger progress-bar-striped active"
                    role="progressbar"
                    aria-valuenow={this.state.downvoteCount}
                    aria-valuemin="0"
                    aria-valuemax={this.state.users.length + this.state.djs.filter(d => d).length}
                    style={{ width: `${(this.state.downvoteCount / maxVotes) * 100}%` }}
                  />
                </div>
              </div>
              <div className="vote--btns col-xs-4">
                {(this.state.currentDj === -1) || (this.state.track === null) || (this.props.userId === this.state.djs[this.state.currentDj].id) ? <button className="btn btn-success btn-round vote--upvote" disabled id="upvote">
                  <i className="fa fa-check" aria-hidden="true" /></button>
                  :
                  <button className="btn btn-success btn-round vote--upvoteCurrent" id="upvote" onClick={this.upvote}>
                    <i className="fa fa-check" aria-hidden="true" /></button>}
                {(this.state.currentDj === -1) || (this.state.track === null) || (this.props.userId === this.state.djs[this.state.currentDj].id) ? <button className="btn btn-danger btn-round vote--downvote" disabled id="downvote">
                  <i className="fa fa-times" aria-hidden="true" /></button>
                  :
                  <button className="btn btn-danger btn-round vote--downvoteCurrent" id="downvote" onClick={this.downvote}>
                    <i className="fa fa-times" aria-hidden="true" /></button>}
              </div>
              <div className="vote--djQueue col-xs-4">
                <button className="vote--djqueueBtn btn btn-default btn-round" onClick={this.handleDjQueue}>
                  {this.state.isDJ ? <img src="img/removeFromList.svg" alt="dequeue" /> : <img src="img/addToList.svg" alt="enqueue" />}
                </button>

                <button className="vote--muteBtn btn btn-default btn-round" onClick={this.handleMute}>
                  {this.state.mute ? <span className="fa fa-volume-off" /> : <span className="fa fa-volume-up" /> }
                </button>
              </div>
            </div>

          </div>

          <div className="crowd">
            {
              this.state.users.map(user => (
                <div className="crowd--user" key={user.username}>
                  <div
                    className="avatar"
                    title={user.username}
                    data-placement="bottom"
                    data-animation="true"
                    data-toggle="tooltip"
                    data-likes={user.likes}
                  >
                    <img src={user.avatar_url} alt={user.username} />
                  </div>
                </div>
                )
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

Room.propTypes = {
};
