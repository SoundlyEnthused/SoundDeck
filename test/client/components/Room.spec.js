import jquery from 'jquery';
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Room from '../../../client/components/Room';
//import ServerAPI from '../../../client/models/ServerAPI';
import seeds from '../seeds';

global.jQuery = jquery;
global.$ = jquery;
require('bootstrap-sass');  // import doesn't work for some reason
/* globals describe it before beforeEach expect */
describe('<Room />', () => {
  // create new room with seed data (roomName, djNum, usernNum, track)
  const roomData = seeds.createRoom('Vallenato', 2, 15, 266280036);
  const djs = roomData.djs;
  const users = roomData.users;
  const name = roomData.name;
  const djMaxNum = roomData.djMaxNum;
  const track = roomData.track;
  const currentDJ = roomData.currentDj;
 
  //Room.widget = roomData.widget;

  let wrapper = null;

  beforeEach('Reset', () => {
    wrapper = mount(
      <Room
        userId={roomData.userId}
        name={roomData.name}
        track={roomData.track}
        djs={roomData.djs}
        djMaxNum={roomData.djMaxNum}
        currentDj={roomData.currentDj}
        users={roomData.users}
        ServerAPI={roomData.ServerAPI}
      />
    );
  });

  describe('Rooms', () => {
    it('renders all components', () => {
      expect(wrapper.find('.room').length).to.equal(1);
      expect(wrapper.find('.stage').length).to.equal(1);
      expect(wrapper.find('.stage--djs').length).to.equal(1);
      // expect(wrapper.find('.soundcloudPlayer').length).to.equal(1);
      expect(wrapper.find('.player').length).to.equal(1);
      expect(wrapper.find('#upvote').length).to.equal(1);
      expect(wrapper.find('#downvote').length).to.equal(1);
      expect(wrapper.find('.vote--djQueue').length).to.equal(1);
      expect(wrapper.find('.crowd').length).to.equal(1);
    });
    it('renders props', () => {
      expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
      expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - djs.length);
      expect(wrapper.find('.dj--seat').first().find('.avatar').src).to.equal(djs[0].avatat_url);
      expect(wrapper.find('.crowd--user').length).to.equal(users.length);
    });
    it('renders room name change', () => {
      const nameNew = 'CLASSICAL';
      const nextProps = { name: nameNew };
      wrapper.setProps(nextProps);
      expect(wrapper.find('h1').text().trim()).to.equal(nameNew);
    });
  });

  describe('Player', () => {
    it('should have an iframe element', () => {
      const iframe = wrapper.find('iframe');
      expect(iframe).to.be.defined;
      // expect(wrapper.find('#soundcloudPlayer').is('iframe')).to.equal(true);
    });
  });

  describe('DJs', () => {
    describe('renders DJ list change', () => {
      let nextProps;
      it('drop DJ', () => {
        const djsNew = djs.slice(0, djs.length - 1);
        nextProps = { djs: djsNew };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
      it('add DJ', () => {
        const djsNew = djs.slice();
        djsNew.push(seeds.user);
        nextProps = { djs: djsNew };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
      it('switch DJ', () => {
        const djsNew = djs.slice(0, djs.length - 1);
        djsNew.push(seeds.user);
        nextProps = { djs: djsNew };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
      it('set room state when user becomes/drops DJ', () => {
        let djsNew = djs.slice(0, djs.length - 1);
        djsNew.push(seeds.user);
        nextProps = { djs: djsNew };
        wrapper.setProps(nextProps);
        expect(wrapper.state('isDJ')).to.equal(true);
        djsNew = djsNew.filter(dj => dj.id !== wrapper.props().userId);
        nextProps = { djs: djsNew };

        wrapper.setProps(nextProps);
        expect(wrapper.state('isDJ')).to.equal(false);
      });
      it('renders current DJ change', () => {
        const currentDjNew = 1;
        const nextProps = { currentDj: currentDjNew };
        wrapper.setProps(nextProps);
        // add test to check DJ is active
      });
    });
    describe('DJ Queue', () => {
      it('enqueue DJ', () => {
        sinon.spy(wrapper.props().ServerAPI, 'enqueue');
        expect(wrapper.state('isDJ')).to.equal(false);
        wrapper.find('.vote--djqueueBtn').simulate('click');
        expect(wrapper.props().ServerAPI.enqueue.calledOnce).to.equal(true);
      });
      it('dequeue DJ', () => {
        sinon.spy(wrapper.props().ServerAPI, 'dequeue');
        wrapper.setState({ isDJ: true });
        expect(wrapper.state('isDJ')).to.equal(true);
        wrapper.find('.vote--djqueueBtn').simulate('click');
        expect(wrapper.props().ServerAPI.dequeue.calledOnce).to.equal(true);
      });
    });
  });

  describe('Upvote', () => {
    it('displays a button to upvote a DJ', () => {
      expect(wrapper.find('#upvote')).to.exist;
    });
    it('allows the user to upvote a DJ', () => {
      // console.log('ServerAPI: ', Object.keys(wrapper.props().ServerAPI));
      sinon.spy(wrapper.props().ServerAPI, 'upvote');
      wrapper.setState({ currentDjID: djs[currentDJ].id, currentTrackID: track });
      expect(wrapper.state('currentDjID')).to.equal(djs[currentDJ].id);
      expect(wrapper.state('currentTrackID')).to.equal(track);
      wrapper.find('#upvote').simulate('click');
      expect(wrapper.props().ServerAPI.upvote.calledOnce).to.equal(true);
    });
  });

  describe('Downvote', () => {
    it('displays a button to downvote a song', () => {
      expect(wrapper.find('#downvote')).to.exist;
    });
    it('allows the user to downvote a song', () => {
      //console.log('ServerAPI: ', Object.keys(wrapper.props().ServerAPI));
      sinon.spy(wrapper.props().ServerAPI, 'downvote');
      wrapper.setState({ currentDjID: djs[currentDJ].id, currentTrackID: track });
      expect(wrapper.state('currentDjID')).to.equal(djs[currentDJ].id);
      expect(wrapper.state('currentTrackID')).to.equal(track);
      wrapper.find('#downvote').simulate('click');
      expect(wrapper.props().ServerAPI.downvote.calledOnce).to.equal(true);
    });
    /*
    it('calls function updateDownvoteProgressBar on button click', () => {
      wrapper.find('#downvote').simulate('click');
      expect(Room.updateDownvoteProgressBar.calledOnce).to.equal(true);
    });
    */
  });

  describe('Crowd', () => {
    it('renders crowd change', () => {
      const usersNew = seeds.users.slice(10, 30);
      const nextProps = { users: usersNew };
      wrapper.setProps(nextProps);
      expect(wrapper.find('.crowd--user').length).to.equal(usersNew.length);
    });
  });
});
