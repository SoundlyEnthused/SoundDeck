import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import App from '../../client/components/App';
import $ from 'jquery';

describe('<App />', () => {

  it('renders a nav bar', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('nav').length).to.equal(1);
  });

  it('renders the lobby if there is no current room', () => {
    const wrapper = mount(<App />);
    wrapper.setState({ currentRoom: undefined });
    expect(wrapper.find('#lobby').hasClass('active')).to.equal(true);
  });

});

describe('<Lobby>', () => {
  it('selects a room when the join button is pressed', () => {
    const wrapper = mount(<App />);
    wrapper.find('.joinBtn').first().simulate('click');
    expect(wrapper.state('currentRoom')).to.not.equal(undefined);
  });

  it('renders a room to the page when the join button is pressed', () => {
    const wrapper = mount(<App />);
    wrapper.find('.joinBtn').first().simulate('click');
    expect(wrapper.find('.room').length).to.equal(1);
  });
});