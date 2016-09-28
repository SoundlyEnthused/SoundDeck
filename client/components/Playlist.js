import React from 'react';
import SC from 'soundcloud';
import ServerAPI from '../models/ServerAPI';
import PlaylistTrack from './PlaylistTrack';
import SearchResult from './SearchResult';

function trackStatus(tracks, filterBy) {
  const setlist = {};
  filterBy.forEach((track) => { setlist[track.id] = true; });
  return tracks.map(track => Object.assign({}, track, { inPlaylist: !!setlist[track.id] }));
}

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: [],
      searchPhrase: '',
      playlist: [],
      draggingIndex: null,
    };
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
    this.moveToTop = this.moveToTop.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onServerPlaylistUpdate = this.onServerPlaylistUpdate.bind(this);
    ServerAPI.onPlaylistUpdate(this.onServerPlaylistUpdate);
  }

  onServerPlaylistUpdate(tracks) {
    const playlistById = {};
    this.state.playlist.forEach((track) => { playlistById[track.id] = track; });
    const updatedPlaylist = tracks.map(track => playlistById[track.songId]);
    this.setState({
      playlist: updatedPlaylist,
    });
    console.log('onServerPlaylistUpdate: ', updatedPlaylist);
  }

  updateState(obj) {
    this.setState(obj);
    if (obj.draggingIndex === null) {
      this.sendPlaylistToServer();
    }
  }

  search(e) {
    e.preventDefault();
    SC.get('/tracks', {
      q: this.state.searchPhrase,
    })
    .then(tracks => trackStatus(tracks, this.state.playlist))
    .then((tracks) => {
      this.setState({
        searchResult: tracks,
        searchPhrase: '',
      });
    });
  }

  sendPlaylistToServer() {
    const updated = this.state.playlist.map(track => ({ songId: track.id, duration: track.duration }));
    console.log('updated playlist: ', updated);
    ServerAPI.updatePlaylist(updated);
  }

  addToPlaylist(trackId) {
    const track = this.state.searchResult.find(t => t.id === trackId);
    if (track.inPlaylist) {
      return;
    }
    const newPlaylist = this.state.playlist.concat([track]);
    const newSearchResults = trackStatus(this.state.searchResult, newPlaylist);
    this.setState({
      playlist: newPlaylist,
      searchResult: newSearchResults,
    }, this.sendPlaylistToServer);
  }
  removeFromPlaylist(trackId) {
    const newCurrPlaylist = this.state.playlist;
    const updatedPlaylist = newCurrPlaylist.filter(tracks => tracks.id !== trackId);
    const updateSearchResult = trackStatus(this.state.searchResult, updatedPlaylist);
    this.setState({
      searchResult: updateSearchResult,
      playlist: updatedPlaylist,
    }, this.sendPlaylistToServer);
  }

  moveToTop(trackId) {
    const newCurrPlaylist = [];
    this.state.playlist.forEach(track => (track.id === trackId ? newCurrPlaylist.unshift(track) : newCurrPlaylist.push(track)));
    this.setState({
      playlist: newCurrPlaylist,
    }, this.sendPlaylistToServer);
  }

  render() {
    return (
      <div id="playlist" className="playlist collapse">
        <div className="container">
          <h1> Playlist </h1>
          <div className="row">
            <div className="playlist--playlist col-sm-6">
              <div className="onDeck">{(this.state.playlist.length === 0) ? false : 'Track On Deck: '}</div>
              <ul className="list">
                {this.state.playlist.map((track, i) =>
                  <PlaylistTrack
                    key={track.id}
                    updateState={this.updateState}
                    items={this.state.playlist}
                    draggingIndex={this.state.draggingIndex}
                    sortId={i}
                    outline="list"
                    childProps={{
                      title: track.title,
                      clickToRem: this.removeFromPlaylist,
                      clickToTop: this.moveToTop,
                      isFirst: i === 0,
                      id: track.id,
                    }}
                  />
                )}
              </ul>
            </div>
            <div className="playlist--search col-sm-6">
              <form>
                <input
                  type="text"
                  value={this.state.searchPhrase}
                  id="playlist--search--input"
                  onChange={(e) => { this.setState({ searchPhrase: e.target.value }); }}
                />
                <button onClick={(e) => { this.search(e); }}>Search</button>
                <ul>
                  {this.state.searchResult.map(track =>
                    <SearchResult
                      key={track.id}
                      id={track.id}
                      title={track.title}
                      clickToAdd={this.addToPlaylist}
                      inPlaylist={track.inPlaylist}
                    />
                  )}
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
