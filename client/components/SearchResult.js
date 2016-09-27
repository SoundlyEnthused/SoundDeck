import React from 'react';

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this._clickToAdd = this._clickToAdd.bind(this);
  }

  _clickToAdd() {
    this.props.clickToAdd(this.props.id);
  }

  render() {
    // eslint-disable-next-line
    return <li className="list-unstyled" onClick={this._clickToAdd}>{this.props.title}</li>;
  }
}

SearchResult.propTypes = {
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  clickToAdd: React.PropTypes.func.isRequired,
};
