import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
// import $ from 'jquery';
import Lobby from '../../../client/components/Lobby';

/* globals describe it $ beforeEach expect */
describe('<Lobby />', () => {
  let wrapper;
  let joinRoomCalled;
  beforeEach(() => {
    wrapper = mount(
      <Lobby
        roomIds={[1, 2, 3]}
        roomNames={['rock', 'rap', 'dance']}
        roomCounts={[12, 25, 87]}
        joinRoom={() => { joinRoomCalled = true; }}
        djs={[[3, null, null, null], [null, 5, 7, null], [null, 2, null, null]]}
      />
    );
    joinRoomCalled = false;
  });
  it('should render the room count', () => {
    expect(wrapper.find('.roomcount')).to.have.length(3);
    expect(wrapper.find('.roomcount').map(x => x.text())).to.deep.equal(['12', '25', '87']);
  });
  it('should render the room names', () => {
    expect(wrapper.find('.lobby--roomname')).to.have.length(3);
    expect(wrapper.find('.lobby--roomname').map(x => x.text())).to.deep.equal(['rock', 'rap', 'dance']);
  });
  it('should render mini representations of the DJs', () => {
    expect(wrapper.find('.active-dj-slot')).to.have.length(4);
    expect(wrapper.find('.empty-dj-slot')).to.have.length(8);
  });
});
