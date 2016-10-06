import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CrowdList from '../../../client/components/CrowdList';
/* globals describe it beforeEach */
describe('<CrowdList />', () => {
  let wrapper;
  const users = [
    { username: 'Rachel', avatar_url: '/some_url1.jpg', likes: 100 },
    { username: 'Nate', avatar_url: '/some_url2.jpg', likes: 0 },
    { username: 'Russ', avatar_url: '/some_url3.jpg', likes: 12 },
  ];
  beforeEach('Setup CrowdList Component', () => {
    wrapper = shallow(
      <CrowdList
        users={[{ username: 'Rachel', avatar_url: '/some_url1.jpg', likes: 100 }]}
      />
    );
  });
  it('should render the crowd', () => {
    expect(wrapper.find('CrowdUser').length).to.equal(1);
  });
  it('should render the crowd change', () => {
    wrapper.setProps({ users });
    expect(wrapper.find('CrowdUser').length).to.equal(users.length);
  });
});
