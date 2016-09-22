import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import App from '../../client/components/App';
import $ from 'jquery';

// describe() is a strictly visual function => it formats output to 
// be more readable; can organize tests with different describe() functions

describe('<App>', () => {
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

describe('joinRoom', () => {
  const app = new App();
  it('should be a function', () => {
    expect(app.joinRoom).to.be.a('function');
  });

  it('should have props for the current room', () => {
    const wrapper = mount (<App />);
    expect(wrapper.props().currentRoom).to.be.defined;
  });
});

describe('loggingIn', () => {
  const app = new App();
  it('should be a function', () => {
    expect(app.joinRoom).to.be.a('function');
  });

  it('should have props for the current user data', () => {
    const wrapper = mount (<App />);
    expect(wrapper.props().userData).to.be.defined;
  });
});

describe('<Lobby>', () => {
  it('selects a room when the join button is pressed', () => {
    const wrapper = mount(<App />);
    wrapper.find('.joinBtn').first().simulate('click');
    expect(wrapper.state('currentRoom')).to.not.equal(undefined);
  });
/*
  it('renders a room to the page when the join button is pressed', () => {
    const wrapper = mount(<App />);
    wrapper.find('.joinBtn').first().simulate('click');
    expect(wrapper.find('.room').length).to.equal(1);
  });
  */
});

describe('<Navigation Bar>', () => {
  it ('displays a login button', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('#LoginButton')).to.exist;
  });

  it ('displays a playlist button', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('#PlaylistButton')).to.exist;
  });
});