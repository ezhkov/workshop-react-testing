import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../src/components/App';

Enzyme.configure({ adapter: new Adapter() });

const getTabsList = wrapper => wrapper.find('li[data-test="tab"]');
const getTabsContents = wrapper => wrapper.find('div[data-test="tabContent"]');

describe('Tabs Render', () => {
  it('select last tab', () => {
    const wrapper = mount(<App />);
    const tabs = getTabsList(wrapper);
    const lastTab = tabs.last();
    expect(wrapper.render()).toMatchSnapshot();
    lastTab.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});

describe('Tabs Actions', () => {
  it('tab has activated', () => {
    const wrapper = mount(<App />);
    const tabs = getTabsList(wrapper);
    const lastTab = tabs.last();
    lastTab.simulate('click');
    const newTabs = getTabsList(wrapper);
    const newLastTab = newTabs.last();
    expect(newLastTab).toMatchSelector('[aria-selected="true"]');
  });

  it('content is visible', () => {
    const wrapper = mount(<App />);
    const tabs = getTabsList(wrapper);
    const tab = tabs.at(3);
    tab.simulate('click');
    const tabContents = getTabsContents(wrapper);
    const needleContent = tabContents.at(3);
    expect(needleContent.children()).toExist();
  });

  it('tab has added', () => {
    const wrapper = mount(<App />);
    const tabs = getTabsList(wrapper);
    const lastIndexToAdd = tabs.length;
    const addTab = wrapper.find('[data-test="addTab"]');
    addTab.simulate('click');
    const newTabs = getTabsList(wrapper);
    expect(newTabs.at(lastIndexToAdd)).toExist();
  });

  it('tab has removed', () => {
    const wrapper = mount(<App />);
    const tabs = getTabsList(wrapper);
    const tabsCount = tabs.length;
    const removeTab = tabs.at(2).find('[data-test="removeTab"]');
    removeTab.simulate('click');
    const newTabs = getTabsList(wrapper);
    expect(newTabs.at(tabsCount - 1)).not.toExist();
  });

  it('exact tab has removed', () => {
    const wrapper = mount(<App />);
    const tabs = getTabsList(wrapper);
    const needleTab = tabs.at(2);
    const needleTabRemove = needleTab.find('[data-test="removeTab"]');
    needleTabRemove.simulate('click');
    const newTabs = getTabsList(wrapper);
    expect(newTabs.contains(needleTab)).toBeFalsy();
  });

});
