import React from 'react';

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

  render() {
    return (
      <div id="playlist" className="playlist">
        <div className="container">
          <h1> Playlist </h1>
          <div className="row">
            <div className="playlist--playlist col-sm-6">
              <ul>
                {
                  this.state.playlist.map((track) => {
                    return (
                      <li className="playlist--playlist--track list-unstyled">
                        {track.title}
                      </li>
                    );
                  })
                }
              </ul>
            </div>
            <div className="playlist--search col-sm-6">
              <form>
                <input type="text" id="playlist--search--input" />
                <button onClick={(e) => { this.search(e); }}>Search</button>
                <ul>
                  {
                    this.state.searchResult.map((track) => {
                      return (
                        <li className="list-unstyled">
                          {track.title}
                        </li>
                      );
                    })
                  }
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
