import jquery from 'jquery';
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import App from '../../../client/components/App';
import seeds from '../seeds';

// describe() is a strictly visual function => it formats output to
// be more readable; can organize tests with different describe() functions

// describe 
describe('<App>', () => {
  let wrapper = null;
  describe('<Nav>', () => {
    // mount <App/> before running each describe statement below:
    before(() => {
      wrapper = mount(<App />);
    });
    describe('user not signed in:', () => {
      it('displays a navigation bar', () => {
        expect(wrapper.find('nav').length).to.equal(1);
      });
      it('displays a login button', () => {
        expect(wrapper.find('#LoginButton').length).to.equal(1);
      });
      it('does NOT display a lobby button', () => {
        expect(wrapper.find('#LobbyButton').length).to.equal(0);
      });
      it('does NOT display a playlist button', () => {
        expect(wrapper.find('#PlaylistButton').length).to.equal(0);
      });
    }); // end describe 'not signed in'

    describe('user signed in:', () => {
      let me = null;
      before(() => {
        me = seeds.user;
        wrapper.setState({ userData: me });
      });
        it('displays a navigation bar', () => {
          expect(wrapper.find('nav').length).to.equal(1);
        });
        it('does NOT display a login button', () => {
          expect(wrapper.find('#LoginButton').length).to.equal(0);
        });
        it('displays a lobby button', () => {
          expect(wrapper.find('#LobbyButton').length).to.equal(1);
        });
        it('displays a playlist button', () => {
          expect(wrapper.find('#PlaylistButton').length).to.equal(1);
        });
        it('displays the user\'s Soundcloud username', () => {
          expect(wrapper.find('.navbar--signedIn').length).to.equal(1);
          expect(wrapper.find('.navbar--signedIn').html()).to.include(me.username);
        });
    }); // end describe 'signed in'
  }); // end Nav()
  describe('<Lobby>', () => {
    before(() => {
      wrapper = mount(<App />);
    });
    describe('not signed in', () => {
      it('lobby should collapse', () => {
        expect(wrapper.find('#lobby').hasClass('collapse')).to.equal(true);
      })
    })
  }); // end Lobby()
}); // end App()

/* Enzyme test to see if a function is called on a button click and passed the right arguments
  it('calls onCompleteChange handler with the right arguments when clicked', () => {
    const spy = sinon.spy();
    const item = mockItem();
    const wrapper = shallow(<ToDoItem item={item} onCompleteChange={spy} />);
    wrapper.find('.item-button').simulate('click');
    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWith(item, false)).to.be.true;
  });
*/

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