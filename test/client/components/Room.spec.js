import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Room from '../../../client/components/Room';
import $ from 'jquery';

describe('<Room />', () => {
  describe('initial rendering', () => {
    it('renders all components', () => {
      let room = {
        track: '',
        users: users,
        djs: djs,
        djMaxNum: 4,
        currentDj: 4973508,
        name: 'Pop',
      };
      const wrapper = mount(<Room room={room} />);
      expect(wrapper.find('.room').length).to.equal(1);
      expect(wrapper.find('.stage').length).to.equal(1);
      expect(wrapper.find('.stage--djs').length).to.equal(1);
      expect(wrapper.find('.dj--seat').length).to.equal(4);
      expect(wrapper.find('.soundcloudPlayer').length).to.equal(1);
      expect(wrapper.find('#upvote').length).to.equal(1);
      expect(wrapper.find('#downvote').length).to.equal(1);
      expect(wrapper.find('.vote--djQueue').length).to.equal(1);
      expect(wrapper.find('.crowd').length).to.equal(1);
    });
    it('renders props', () => {
      const djs = [
          { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
          { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
          { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
          {}];
      const users = [
          { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
          { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
          { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
      ];
      let room = {
        track: '',
        users: users,
        djs: djs,
        djMaxNum: 4,
        currentDj: 4973508,
        name: 'Rock',
      };
      const wrapper = mount(<Room room={room} />);
      expect(wrapper.find('.dj--seat').length).to.equal(room.djMaxNum);
      expect(wrapper.find('.dj--seat empty').length).to.equal(room.djMaxNum - 3);
      expect(wrapper.find('.dj--seat').first().find('.avatar').src).to.equal(djs[0].avatat_url);
      expect(wrapper.find('.crowd--user').length).to.equal(users.length);
    });
  });

  xdescribe('props rendering', () => {
      let djs = [
          { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
          { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
          { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
          {}];
      let users = [
          { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
          { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
          { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
      ];
      let room = {
        track: '',
        users: users,
        djs: djs,
        currentDj: null,
        name: 'Rock',
      };
    it('renders djs', () => {
      const wrapper = mount(<Room room={room} />);
    });
    it('renders current dj', () => {
      const wrapper = mount(<Room room={room} />);
    });
    it('renders users', () => {
      const wrapper = mount(<Room room={room} />);
    });
    it('change tracks', () => {
      const wrapper = mount(<Room room={room} />);
    });
  });
});

