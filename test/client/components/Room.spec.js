import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Room from '../../../client/components/Room';
import $ from 'jquery';

describe('<Room />', () => {
  describe('initial rendering', () => {
    it('renders all components', () => {
      const wrapper = mount(<Room />);
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
      const currentRoom = {
        name: "Rock",
        track:"",
        djs:[],
        currentDj:,
        users: [],

      };
      const wrapper = mount(<Room currentRoom = {}/>);
      
    })
  });

  describe('props rendering', () => {
    it('renders djs', () => {
      const wrapper = mount(<Room />);
    });
    it('renders current dj', () => {
      const wrapper = mount(<Room />);
    });
    it('renders users', () => {
      const wrapper = mount(<Room />);
    });
    it('change tracks', () => {
      const wrapper = mount(<Room />);
    });
  });
});

