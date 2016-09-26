// Component to ListItems in Playlist

import React from 'react';
// import { Sortable } from 'react-sortable';
 import Playlist from './Playlist';

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
    console.log('ListItem props = ', this.props);

    this.state = {
      tracks: [{ title: 'UNO' }, { title: 'DOS' }, { title: 'TRES' }],
    };
  }

  removeFromPlaylist(track) {
    const newCurrPlaylist = this.props.tracks;
    function trackToRemove(tracks) {
      // console.log('tracks', tracks);
      // console.log('track', track);
      return tracks !== track;
    }
    const updatedPlaylist = newCurrPlaylist.filter(trackToRemove);
    this.setState({
      tracks: updatedPlaylist,
    });
  }

  render() {
    console.log('Inside ListItem render()');
    return (
      <div>
        <h3>TEST MESSAGE!!</h3>
        <div className="list-unstyled"> { this.props.tracks.map(track =>
              (<li className="playlist--playlist--track">
                <button key={track} className="remove-btn" onClick={this.removeFromPlaylist(this)}>
                  <span className="fa fa-times" />
                </button>
                {track.title}
              </li>)
            )}
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  tracks: React.PropTypes.any,
  handleRemoveTrack: React.PropTypes.function,
};

/*

                (track[0] ? (<li className="playlist--playlist--track list-unstyled firstTrack">
                  <button key={track} className="remove-btn" onClick={Playlist.removeFromPlaylist(this)}>
                    <span className="fa fa-times" /></button>{track.title}</li>)
                :
                (<li className="playlist--playlist--track list-unstyled">
                  <button key={track} className="remove-btn" onClick={Playlist.removeFromPlaylist(this)}>
                    <span className="fa fa-times" /></button>{track.title}</li>))
            ) // end map

*/