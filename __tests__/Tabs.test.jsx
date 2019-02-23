import React from 'react';
import { mount } from 'enzyme';
import App from '../src/components/App';

describe('Check if app renders', () => {
  it('render', () => {
    const wrapper = mount(<App />);
    const tabs = wrapper.find('[data-test="tab"]');
    const lastTab = tabs.last();
    lastTab.simulate('click');
    const lastTabContent = wrapper.find('[data-test="tabContent"]').last();
    expect(lastTabContent).toMatchSnapshot();
  });
});
