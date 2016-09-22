import React from 'react';
import SC from 'soundcloud';
import $ from 'jquery';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      searchResult: [],
    };
  }

  search(e) {
    e.preventDefault();
    const searchPhrase = $('#playlist--search--input')[0].value;
    console.log('SEARCH!', searchPhrase);
    SC.get('/tracks', {
      q: searchPhrase,
    }).then((tracks) => {
      $('#playlist--search--input')[0].value = '';
      console.log('GETTING BACK: ', tracks);
      this.setState({
        searchResult: tracks,
      });
    });
  }

  addToPlaylist(track) {
    const tracks = this.state.searchResult;
    const currPlaylist = this.state.playlist;
    // console.log('searchResults: ', tracks);
    // console.log('playlist: ', currPlaylist);
    // console.log('clicked track: ', track);
    if (!(currPlaylist.includes(track))) {
      currPlaylist.push(track);
      tracks.splice(tracks.indexOf(track), 1);
    }
    // console.log('playlist after push: ', currPlaylist);
    function trackToAdd(theTracks) {
      // console.log('theTrack inside trackToAdd filter: ', theTracks);
      // console.log('tracks inside trackToAdd filter: ', tracks);
      // console.log('track inside trackToAdd filter: ', track);
      return theTracks !== track;
    }
    const newTrackList = tracks.filter(trackToAdd);
    const newCurrPlaylist = currPlaylist;
    // console.log('tracks after filt: ', newTrackList);
    // console.log('playlist at end: ', currPlaylist);
    this.setState({
      playlist: newCurrPlaylist,
      searchResult: newTrackList,
    });
  }


  render() {
    return (
      <div id="playlist" className="playlist">
        <div className="container">
          <h1> Playlist </h1>
          <div className="row">
            <div className="playlist--playlist col-sm-6">
              <ul>
                {this.state.playlist.map(track =>
                  (<li className="playlist--playlist--track list-unstyled">{track.title}</li>))}
              </ul>
            </div>
            <div className="playlist--search col-sm-6">
              <form>
                <input type="text" id="playlist--search--input" />
                <button onClick={(e) => { this.search(e); }}>Search</button>
                <ul>
                  {this.state.searchResult.map(track =>
                      (<li className="list-unstyled" onClick={this.addToPlaylist.bind(this, track)}>{track.title}</li>))}
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
