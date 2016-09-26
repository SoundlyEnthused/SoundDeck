// Component to add drag-and-drop sorting to Playlist

import React from 'react';
import { Sortable } from 'react-sortable';
import ListItem from './ListItem';
import Playlist from './Playlist';

const SortableListItem = Sortable(ListItem);

export default class SortableList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playlist: Playlist.playlist,
    };
  }

  render() {
    const childProps = { className: 'myClass1' };
    const listItems = this.state.playlist.map((item, i) =>
     (<SortableListItem
       key={i}
       updateState={this.updateState}
       items={this.state.data.items}
       draggingIndex={this.state.draggingIndex}
       sortId={i}
       outline="list"
       childProps={childProps}
     >{item}</SortableListItem>)
    );

    return (
      <div className="list">{listItems}</div>
    );
  }
}
