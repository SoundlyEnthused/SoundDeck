import jquery from 'jquery';
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import App from '../../../client/components/App';
import seeds from '../seeds';
// describe() is a strictly visual function => it formats output to
// be more readable; can organize tests with different describe() functions

describe('<App>', () => {
  let wrapper = null;
  beforeEach('Clear', () => {
    wrapper = mount(<App />);
  });

  describe('<Nav>', () => {
    it('renders a nav bar', () => {
      expect(wrapper.find('nav').length).to.equal(1);
    });
    it('renders a login button when user is not signed in', () => {
      expect(wrapper.find('#LoginButton').length).to.equal(1);
    });
    it('does NOT render lobby button when user is not signed in', () => {
      expect(wrapper.find('#LobbyButton').length).to.equal(0);
    });
    it('does NOT render playlist button when user is not signed in', () => {
      expect(wrapper.find('#PlaylistButton').length).to.equal(0);
    });
    const me = seeds.user;
    wrapper.setState({ userData: me });

    it('does NOT render a login button when user is signed in', () => {
      expect(wrapper.find('#LoginButton').length).to.equal(0);
    });
    it('does NOT render lobby button when user is signed in', () => {
      expect(wrapper.find('#LobbyButton').length).to.equal(1);
    });
    it('does NOT render playlist button when user is signed in', () => {
      expect(wrapper.find('#PlaylistButton').length).to.equal(1);
    });
  });

});

// describe('App functions', () => {
//   describe('joinRoom', () => {
//     const app = new App();
//     it('should be a function', () => {
//       expect(app.joinRoom).to.be.a('function');
//     });

//     it('should have props for the current room', () => {
//       const wrapper = mount(<App />);
//       expect(wrapper.props().currentRoom).to.be.defined;
//     });
//   });

//   describe('loggingIn', () => {
//     const app = new App();
//     it('should be a function', () => {
//       expect(app.joinRoom).to.be.a('function');
//     });

//     it('should have props for the current user data', () => {
//       const wrapper = mount(<App />);
//       expect(wrapper.props().userData).to.be.defined;
//     });
//   });

// });
