import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import App from '../../../client/components/App';
import $ from 'jquery';

describe('<Lobby>', () => {
  it('selects a room when the join button is pressed', () => {
    const wrapper = mount(<App />);
    wrapper.find('.joinBtn').first().simulate('click');
    expect(wrapper.state('currentRoom')).to.not.equal(undefined);
  });
});
