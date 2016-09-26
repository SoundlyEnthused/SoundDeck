import React from 'react';
import SC from 'soundcloud';
import $ from 'jquery';
//import Sortable from './Sortable';
import ListItem from './ListItem';

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
    // console.log('SEARCH!', searchPhrase);
    SC.get('/tracks', {
      q: searchPhrase,
    }).then((tracks) => {
      $('#playlist--search--input')[0].value = '';
      // console.log('GETTING BACK: ', tracks);
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
    console.log('clicked track: ', track);

    currPlaylist.push(track);
    // console.log('after push: ', currPlaylist);
    tracks.splice(tracks.indexOf(track), 1);
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

  // checkPlaylist() {
  //   // look at new search results
  //   const currPlaylist = this.state.playlist;
  //
  //   // compare to existing tracks in playlist
  //
  //   // asign indicator (id or classname?) that keeps track of duplicates in searchResult
  //
  //   // apply css to modify the appearance and functionality of dupes in searchResult
  // }

  // removeHandler() {
  removeFromPlaylist(track) {
    const newCurrPlaylist = this.state.playlist;
    function trackToRemove(tracks) {
      // console.log('tracks', tracks);
      // console.log('track', track);
      return tracks !== track;
    }
    const updatedPlaylist = newCurrPlaylist.filter(trackToRemove);
    this.setState({
      playlist: updatedPlaylist,
    });
  }
  // }
  // var List = React.createClass({
  //   render() {
  //     return (
  //       <ul>
  //         {this.props.items.map(item =>
  //           <ListItem key={item.id} item={item} onItemClick={this.props.onItemClick} />
  //         )}
  //       </ul>
  //     );
  //   }
  // });
  //
  // var ListItem = React.createClass({
  //   render() {
  //     return (
  //       <li onClick={this._onClick}>
  //         ...
  //       </li>
  //     );
  //   },
  //   _onClick() {
  //     this.props.onItemClick(this.props.item.id);
  //   }
  // });


// <div className="listTracks">{ListItem(this.state.playlist)}}</div>   
// <SortableList data={data} />,  

  render() {
    return (
      <div id="playlist" className="playlist collapse">
        <div className="container">
          <h1> Playlist </h1>
          <div className="row">
            <div className="playlist--playlist col-sm-6">
              <div className="onDeck">{(this.state.playlist.length === 0) ? false : 'Next Track On Deck: '}</div>
              <ListItem tracks={this.state.playlist} handleRemoveTrack={this.removeFromPlaylist} />
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


/*
   <ul>
                {this.state.playlist.map(track =>
                  (track === this.state.playlist[0] ? (<li className="playlist--playlist--track list-unstyled firstTrack">
                    <button key={track} className="remove-btn" onClick={this.removeFromPlaylist.bind(this, track)}>
                      <span className="fa fa-times" /></button>{track.title}</li>)
                  :
                    (<li className="playlist--playlist--track list-unstyled">
                      <button key={track} className="remove-btn" onClick={this.removeFromPlaylist.bind(this, track)}>
                        <span className="fa fa-times" /></button>{track.title}</li>)
                  )
                )}
              </ul>
*/
