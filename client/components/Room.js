import React from 'react';
import load from 'load-script';
import SC from 'soundcloud';
import $ from 'jquery';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    const state = this.processProps(this.props);
    this.state = state;
    this.mute = false;  // can't set this.mute as state, otherwise it will render iframe for some reason
    this.player = null; // new html5 audio player
    this.infoImage = null;
    this.infoArtist = null;
    this.infoTrack = null;
    this.trackProgress = null;
    this.updataTrack = false;
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

  initPlayer() {
    const _this = this;
    // check current time vs. time stamp
    const timeDiff = (Date.now() - this.state.timeStamp) / 1000;

    SC.get(`/tracks/${this.state.track}`).then(function(sound) {
      if (sound.errors) {
        console.log("Error", sound.errors);
      } else {
        console.log('sound object', sound);

        player.crossOrigin = "anonymous";
        player.setAttribute('src', sound.stream_url + '?client_id=' + process.env.CLIENT_ID);
        player.play();

        // if current time is larger than time stamp, skip some par of the song
        console.log('time diff', timeDiff);
        if (timeDiff > 0) {
          _this.player.currentTime = timeDiff;
        }




        // var self = this;
        // var analyser;
        // var audioCtx = new (window.AudioContext || window.webkitAudioContext);
        // var streamData = new Uint8Array(128);
        // var playStream = function(streamUrl) {
        //     // get the input stream from the audio element
        //     player.addEventListener('ended', function(){
        //         self.directStream('coasting');
        //     });
        //     player.setAttribute('src', streamUrl);
        //     player.play();
        // }

        // analyser = audioCtx.createAnalyser();
        // analyser.fftSize = 256;
        // player.crossOrigin = "anonymous";
        // var source = audioCtx.createMediaElementSource(player);
        // source.connect(analyser);
        // analyser.connect(audioCtx.destination);
        // var sampleAudioStream = function() {
        //     analyser.getByteFrequencyData(streamData);
        //     // calculate an overall volume value
        //     var total = 0;
        //     for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
        //         total += streamData[i];
        //     }
        //     console.log(total);
        // };
        // setInterval(sampleAudioStream, 20);




        window.setInterval(function() {
            _this.trackProgress.style.width = `${(player.currentTime / player.duration) * 100}%`;
        }, 250);

        var image = sound.artwork_url ? sound.artwork_url : sound.user.avatar_url; // if no track artwork exists, use the user's avatar.
        _this.infoImage.setAttribute('src', image);
        _this.infoImage.setAttribute('alt', sound.user.username);
        _this.infoArtist.innerHTML = sound.user.username;
        _this.infoTrack.innerHTML = sound.title;






        var ctx = new AudioContext();
        // var audio = document.getElementById('myAudio');
        var audioSrc = ctx.createMediaElementSource(player);
        var analyser = ctx.createAnalyser();
        
        // we have to connect the MediaElementSource with the analyser 
        audioSrc.connect(analyser);
        audioSrc.connect(ctx.destination);

        // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
        // analyser.fftSize = 128;

        // frequencyBinCount tells you how many values you'll receive from the analyser
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);
      
        // we're ready to receive some data!
        // loop

        var bars = document.getElementsByClassName('bar');
        function renderFrame() {
          requestAnimationFrame(renderFrame);
          // update data in frequencyData
          analyser.getByteFrequencyData(frequencyData);
          // render frame based on values in frequencyData
          //console.log(analyser.frequencyBinCount, frequencyData);
          for (var i = 0; i < 32; i++) {
            var h = ((frequencyData[i]) / 256) * 100;
            h = h * Math.sin(i/10);
            bars[i].style.height =  h < 100 ? h + '%' : '100%';
            if (i === 31) {
                bars[0].style.height = h + '%';
            }
          }
        }
        renderFrame();








      }
    });
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
  }

  // ********************
  // Room functions
  // ********************
  handleMute() {
    // toggle mute state. Inital mute state is false.
    // this.setState({
    //   mute: !this.mute,
    // });
    this.mute = !this.mute;
    if (!this.mute) {
      this.player.volume = 0;
    } else {
      this.player.volume = 1;
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
    const djArray = this.processDjs(nextProps.djs, nextProps.djMaxNum);
    const isDJ = nextProps.djs.map(dj => dj.id).includes(this.props.userId);
    return {
      name: nextProps.name,
      track: nextProps.track,
      timeStamp: nextProps.timeStamp,
      djs: djArray,
      currentDj: nextProps.currentDj,
      isDJ,
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

  upvote() {
    var djList = this.state.djs;
    djList[this.state.currentDj].likes = djList[this.state.currentDj].likes + 1 || 1;
    this.setState({
      djs: djList,
    });
  }

  downvote() {
    this.setState({
      downvotes: this.state.downvotes + 1 || 1,
    });
  }

  render() {
    // console.log('room render', this.state)
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
              <img src="" alt="" id="infoImage" className="player--image" />
              <h2 id="infoArtist" className="player--artist" />
              <h3 id="infoTrack" className="player--track" />
              <audio id="player" loop autoPlay preload></audio>
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
                    aria-valuenow={this.state.downvotes}
                    aria-valuemin="0"
                    aria-valuemax="5"
                    style={{ width: `${(this.state.downvotes / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className="vote--btns col-xs-4">
                <button className="btn btn-success btn-round vote--upvote" id="upvote" onClick={this.upvote}>
                  <i className="fa fa-check" aria-hidden="true" />
                </button>
                <button className="btn btn-danger btn-round vote--downvote" id="downvote" onClick={this.downvote}>
                  <i className="fa fa-times" aria-hidden="true" />
                </button>
              </div>
              <div className="vote--djQueue col-xs-4">
                <button className="vote--djqueueBtn btn btn-default btn-round" onClick={this.handleDjQueue}>
                  {this.state.isDJ ? <img src="img/removeFromList.svg" alt="dequeue" /> : <img src="img/addToList.svg" alt="enqueue" />}
                </button>

                <button className="vote--muteBtn btn btn-default btn-round" onClick={this.handleMute}>
                  {this.mute ? <span className="fa fa-volume-off" /> : <span className="fa fa-volume-up" /> }
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
};