import React from 'react';
import Tabs from '..';
import { shallow, mount } from 'enzyme';

describe('Tabs', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Tabs />);
    expect(wrapper).toMatchSnapshot();
  });

  it('select 3rd tab', () => {
    const wrapper = mount(<Tabs />);
    const elemToClick = wrapper.find('Tab').at(2);
    elemToClick.simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
