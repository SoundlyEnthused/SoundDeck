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
      this.widget.load(this.state.track);
    });

    const djs = [{ 'id': 3203, 'username': 'manyoora', 'avatar_url': 'https://a1.sndcdn.com/images/default_avatar_large.png' },
    { 'id': 4973508, 'username': 'Macabre!', 'avatar_url': "https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg" },
    { 'id': 9509, 'username': 'compositeone', 'avatar_url': 'https://i1.sndcdn.com/avatars-000000607500-271hqp-large.jpg' },
    {}];
    this.setState({
      djs,
    });
  }

  render() {
    // <Stage />
    // <Vote />
    // <Crowd />
    return (
      <div className="room">
        <div className="container">
          <h1> {this.props.room} </h1>
          <div className="stage row">
            {
              this.state.djs.map((dj) => {
                return (
                  <div className="stage--seat col-xs-3" key={dj.id}>
                    <div className="stage--dj">
                      <img src={dj.avatar_url} alt={dj.username} title={dj.username} />
                    </div>
                  </div>
                );
              })
            }
          </div>
          <iframe id="soundcloudPlayer" width="100%" height="166" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=" />
          <div className="crowd">
          </div>
        </div>
      </div>
    );
  }
}
