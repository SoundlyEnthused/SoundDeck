import React from 'react';
import { Sortable } from 'react-sortable';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this._clickToRem = this._clickToRem.bind(this);
    this._clickToTop = this._clickToTop.bind(this);
  }
  _clickToRem() {
    this.props.clickToRem(this.props.id);
  }
  _clickToTop() {
    this.props.clickToTop(this.props.id);
  }
  render() {
    return (
    (this.props.isFirst ? (<li
      {...this.props}
      className="playlist--playlist--track list-unstyled list-item firstTrack"
    >
      <button className="remove-btn" onClick={this._clickToRem}>
        <span className="fa fa-times" /></button>{this.props.title}</li>)
    :
      (<li
        {...this.props}
        className="playlist--playlist--track list-unstyled list-item"
      >
        <button className="remove-btn" onClick={this._clickToRem}>
          <span className="fa fa-times" /></button>|
        <button className="moveTop-btn" onClick={this._clickToTop}>
          <span className="fa fa-level-up" aria-hidden="true" /></button>
        {this.props.title}</li>)
    ));
  }
}

Track.propTypes = {
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  clickToTop: React.PropTypes.func.isRequired,
  clickToRem: React.PropTypes.func.isRequired,
  isFirst: React.PropTypes.bool,
};

Track.defaultProps = {
  isFirst: false,
};

// eslint-disable-next-line
const PlaylistTrack = Sortable(Track);

export default PlaylistTrack;