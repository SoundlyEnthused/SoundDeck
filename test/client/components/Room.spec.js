import jquery from 'jquery';
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Room from '../../../client/components/Room';
global.jQuery = jquery;
global.$ = jquery;
require('bootstrap-sass');  // import doesn't work for some reason

describe('<Room />', () => {
  const djs = [
        { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
        { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
        { id: 965552, username: 'Floex', avatar_url: 'https://i1.sndcdn.com/avatars-000215636887-z69ica-large.jpg' },
  ];
  const users = [
        { id: 1, username: '"alexis"', avatar_url: 'https://i1.sndcdn.com/avatars-000000000141-2d728f-large.jpg' },
        { id: 2, username: 'Eric 🔥', avatar_url: 'https://i1.sndcdn.com/avatars-000153316546-tqxejr-large.jpg' },
        { id: 3, username: 'emil', avatar_url: 'https://i1.sndcdn.com/avatars-000019102368-0eum50-large.jpg' },
        { id: 11, username: 'robert', avatar_url: 'https://i1.sndcdn.com/avatars-000000000050-56eb60-large.jpg' },
        { id: 46, username: 'bjornjeffery', avatar_url: 'https://a1.sndcdn.com/images/default_avatar_large.png' },
        { id: 58, username: 'lukas', avatar_url: 'https://i1.sndcdn.com/avatars-000001916005-iinh3e-large.jpg' },
        { id: 51, username: 'mikaelpersson', avatar_url: 'https://i1.sndcdn.com/avatars-000000000330-627e91-large.jpg' },
  ];
  const name = 'metal';
  const djMaxNum = 4;
  const track = 168240777;
  const currentDj = 4973508;
  const wrapper = mount(
    <Room
      name={name}
      track={track}
      djs={djs}
      djMaxNum={djMaxNum}
      currentDj={currentDj}
      users={users}
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
      expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - 3);
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
        nextProps = {
          djs: [
            { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
          ],
        };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
      it('add DJ', () => {
        nextProps = {
          djs: [
            { id: 172873, username: 'Mr. Bill', avatar_url: 'https://i1.sndcdn.com/avatars-000244632868-hkkhs2-large.jpg' },
            { id: 4973508, username: 'Macabre!', avatar_url: 'https://i1.sndcdn.com/avatars-000218947088-qgg05p-large.jpg' },
            { id: 39, username: 'bruceroos', avatar_url: 'https://i1.sndcdn.com/avatars-000000000155-3ef288-large.jpg' },
          ],
        };
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
            { id: 39, username: 'bruceroos', avatar_url: 'https://i1.sndcdn.com/avatars-000000000155-3ef288-large.jpg' },
          ],
        };
        wrapper.setProps(nextProps);
        expect(wrapper.find('.dj--seat').length).to.equal(djMaxNum);
        expect(wrapper.find('.dj--seat.empty').length).to.equal(djMaxNum - nextProps.djs.length);
        // add test to check if dj name match
      });
    });
    it('renders current DJ change', () => {
      const nextProps = {

      };
      wrapper.setProps(nextProps);
    });
    it('renders crowd change', () => {
      const nextProps = {

      };
      wrapper.setProps(nextProps);
    });
    it('renders room change', () => {
      const nextProps = {

      };
      wrapper.setProps(nextProps);
    });
  });
});

