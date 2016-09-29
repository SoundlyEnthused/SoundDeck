import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import App from '../../../client/components/App';
import $ from 'jquery';

// describe() is a strictly visual function => it formats output to
// be more readable; can organize tests with different describe() functions
/*
describe('<NAV>', () => {
  it('displays a login button', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('#LoginButton')).to.exist;
  });

  it('displays a playlist button', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('#PlaylistButton')).to.exist;
  });
});
*/

