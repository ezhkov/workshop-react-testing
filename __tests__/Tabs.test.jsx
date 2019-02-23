import React from 'react';
import { shallow, mount } from 'enzyme';
import Tabs from '../src/components/Tabs';

describe('Check if tabs renders', () => {
  it('render', () => {
    const wrapper = shallow(<Tabs />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Check if renders exact tab', () => {
    const wrapper = mount(<Tabs />);
    const tabs = wrapper.find('[role="tab"]');
    tabs.filterWhere(n => n.text() === 'Tab header 2').simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Check if tabs can be changed', () => {
  it('Check if tab 3 content not rendering', () => {
    const wrapper = mount(<Tabs />);
    const contentWrapper = wrapper.find('[role="tabpanel"]');
    expect(contentWrapper.filterWhere(n => n.text() === 'Tab panel 3 content')).toHaveLength(0);
  });

  it('Check if tab 3 content is rendering', () => {
    const wrapper = mount(<Tabs />);
    const tabs = wrapper.find('[role="tab"]');
    const contentWrapper = wrapper.find('[role="tabpanel"]');
    tabs.filterWhere(n => n.text() === 'Tab header 3').simulate('click');
    expect(contentWrapper.filterWhere(n => n.text() === 'Tab panel 3 content')).toHaveLength(1);
  });
});
