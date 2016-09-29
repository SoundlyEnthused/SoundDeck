import React from 'react';
import formatDuration from '../utils/formatDuration';

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this._clickToAdd = this._clickToAdd.bind(this);
  }

  _clickToAdd() {
    if (this.props.inPlaylist) {
      return;
    }
    this.props.clickToAdd(this.props.id);
  }
  render() {
    return (
      // eslint-disable-next-line
      <li
        className={`list-unstyled ${this.props.inPlaylist ? 'inPL' : ''}`}
        onClick={this._clickToAdd}
      >{this.props.title} {formatDuration(this.props.duration)}</li>
    );
  }
}

SearchResult.propTypes = {
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  duration: React.PropTypes.number.isRequired,
  clickToAdd: React.PropTypes.func.isRequired,
  inPlaylist: React.PropTypes.bool.isRequired,
};
