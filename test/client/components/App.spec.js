import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import App from '../../../client/components/App';
import $ from 'jquery';

// describe() is a strictly visual function => it formats output to
// be more readable; can organize tests with different describe() functions

describe('<App>', () => {
  it('renders a nav bar', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('nav').length).to.equal(1);
  });
});

describe('App functions', () => {
  describe('joinRoom', () => {
    const app = new App();
    it('should be a function', () => {
      expect(app.joinRoom).to.be.a('function');
    });

    it('should have props for the current room', () => {
      const wrapper = mount(<App />);
      expect(wrapper.props().currentRoom).to.be.defined;
    });
  });

  describe('loggingIn', () => {
    const app = new App();
    it('should be a function', () => {
      expect(app.joinRoom).to.be.a('function');
    });

    it('should have props for the current user data', () => {
      const wrapper = mount(<App />);
      expect(wrapper.props().userData).to.be.defined;
    });
  });

});
