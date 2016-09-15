import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MyComponent from '../../client/components/App';

describe('<App />', () => {
  it('renders an h1 with the text "Cool!"', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('h1').html()).to.equal('<h1>Cool!</h1>');
  });
});
