import jquery from 'jquery';
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Room from '../../../client/components/Room';
import seeds from '../seeds';

global.jQuery = jquery;
global.$ = jquery;
require('bootstrap-sass');  // import doesn't work for some reason

describe('<Room />', () => {
  const roomData = seeds.createRoom('METAL', 2, 15);
  let djs = roomData.djs;
  let users = roomData.users;
  let name = roomData.name;
  let djMaxNum = roomData.djMaxNum;
  let track = roomData.track;
  let currentDj = roomData.currentDj;
  Room.widget = roomData.widget;

  const wrapper = mount(
    <Room
      name={roomData.name}
      track={roomData.track}
      djs={roomData.djs}
      djMaxNum={roomData.djMaxNum}
      currentDj={roomData.currentDj}
      users={roomData.users}
      ServerAPI={roomData.ServerAPI}
    />);

  describe('initial rendering', () => {
    it('renders all components', () => {
      expect(wrapper.find('.room').length).to.equal(1);
      expect(wrapper.find('.stage').length).to.equal(1);
      expect(wrapper.find('.stage--djs').length).to.equal(1);
      expect(wrapper.find('.soundcloudPlayer').length).to.equal(1);
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
  });

  describe('dynamically renders props', () => {
    // it('renders track change', () => {
    //   const nextProps = {
    //   };
    //   wrapper.setProps(nextProps);
    // });
    describe('renders DJ list change', () => {
      let nextProps;
      it('drop DJ', () => {
        djs = [
          { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
          { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
        ];
        nextProps = { djs };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
      it('add DJ', () => {
        djs = [
          { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
          { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
          { id: 39, username: 'bruceroos', avatar_url: 'https://i1.sndcdn.com/avatars-000000000155-3ef288-large.jpg' },
        ];
        nextProps = { djs };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
      it('switch DJ', () => {
        nextProps = {
          djs: [
            { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
            { id: 57, username: '@trancepoetry', avatar_url: 'https://i1.sndcdn.com/avatars-000072444692-u66l5c-large.jpg' },
          ],
        };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
    });
    it('renders current DJ change', () => {
      currentDj = 172873;
      const nextProps = { currentDj };
      wrapper.setProps(nextProps);
      // add test to check DJ is active
    });
    it('renders crowd change', () => {
      users = [
          { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
          { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
          { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
          { id: 11, username: 'robert', avatar_url: 'https://i1.sndcdn.com/avatars-000000000050-56eb60-large.jpg' },
          { id: 46, username: 'bjornjeffery', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
          { id: 58, username: 'lukas', avatar_url: 'https://i1.sndcdn.com/avatars-000001916005-iinh3e-large.jpg' },
          { id: 51, username: 'mikaelpersson', avatar_url: 'https://i1.sndcdn.com/avatars-000000000330-627e91-large.jpg' },
          { id: 41, username: 'tools', avatar_url: 'https://i1.sndcdn.com/avatars-000000000162-6284df-large.jpg' },
      ];
      const nextProps = { users };
      wrapper.setProps(nextProps);
      expect(wrapper.find('.crowd--user').length).to.equal(users.length);
    });
    it('renders room name change', () => {
      name = 'CLASSICAL';
      const nextProps = { name };
      wrapper.setProps(nextProps);
      expect(wrapper.find('h1').text().trim()).to.equal(name);
    });
  });
  describe('enqueue and dequeue for DJ', () => {
    it('enqueue DJ', () => {
      // sinon.spy(wrapper.props().ServerAPI.enqueue);
      sinon.spy(wrapper.props().ServerAPI, 'enqueue');
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', wrapper.props().ServerAPI.enqueue, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      expect(wrapper.state('isDJ')).to.equal(false);
      wrapper.find('.vote--djqueueBtn').simulate('click');
      expect(wrapper.props().ServerAPI.enqueue.calledOnce).to.equal(true);

      // sinon.spy(Room.prototype, 'handleMute');
      // console.log(wrapper.find('.vote--muteBtn').html(), 'mmmmmmmmmmmmmmmm')
      // wrapper.find('.vote--muteBtn').simulate('click');
      // expect(Room.prototype.handleMute.calledOnce).to.equal(true);
    });
  });
});

