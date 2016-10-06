import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CrowdUser from '../../../client/components/CrowdUser';
/* globals describe it beforeEach */
describe('<CrowdUser />', () => {
  let wrapper;
  beforeEach('Setup CrowdUser Component', () => {
    wrapper = shallow(
      <CrowdUser
        username="Rachel"
        avatar_url="/some_url1.jpg"
        likes={100}
      />
    );
  });
  it('should render the user', () => {
    expect(wrapper.find('.crowd--user').length).to.equal(1);
    expect(wrapper.find('.avatar').length).to.equal(1);
    expect(wrapper.find('.avatar').props()).to.have.property('title', 'Rachel');
    expect(wrapper.find('.avatar').props()).to.have.property('data-likes', 100);
    expect(wrapper.find('.crowd--user img').props()).to.have.property('src', '/some_url1.jpg');
  });
  it('should render user change', () => {
    wrapper.setProps({ likes: 120 });
    expect(wrapper.find('.avatar').props()).to.have.property('data-likes', 120);
  });
});
