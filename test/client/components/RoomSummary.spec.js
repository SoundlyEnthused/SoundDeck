import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoomSummary from '../../../client/components/RoomSummary';

/* globals describe it $ beforeEach expect */
describe('<RoomSummary>', () => {
  let wrapper;
  let onJoinClickCalled = false;
  beforeEach(() => {
    wrapper = shallow(
      <RoomSummary
        name={'Rock'}
        count={12}
        djs={[1, null, null, 2]}
        onJoinClick={() => { onJoinClickCalled = true; }}
      />
    );
    onJoinClickCalled = false;
  });
  it('should render the room count', () => {
    expect(wrapper.find('.roomcount')).to.have.length(1);
    expect(wrapper.find('.roomcount').text()).to.equal('12');
  });
  it('should render the room name', () => {
    expect(wrapper.find('.roomname')).to.have.length(1);
    expect(wrapper.find('.roomname').text()).to.equal('Rock');
  });
  it('should call onJoinClick prop when button is pressed', () => {
    wrapper.find('.joinBtn').simulate('click');
    expect(onJoinClickCalled).to.equal(true);
  });
  it('should render a mini representation of the DJs', () => {
    expect(wrapper.find('.empty-dj-slot')).to.have.length(2);
    expect(wrapper.find('.active-dj-slot')).to.have.length(2);
  });
});
