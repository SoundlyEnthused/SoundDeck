import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MyComponent from '../../client/components/App';

describe('<App />', () => {

  it('renders a nav bar', () => {
    const wrapper = mount(<MyComponent />);
    expect(wrapper.find('nav').length).to.equal(1);
  });

});
