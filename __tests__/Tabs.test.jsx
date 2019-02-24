import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Cookies from 'js-cookie';
import App from '../src/components/App';

jest.mock('js-cookie');

Enzyme.configure({ adapter: new Adapter() });

const tabSelector = 'li[data-test="tab"]';
const tabListSelector = 'ul[data-test="tabList"]';
const tabContentSelector = 'div[data-test="tabContent"]';
const tabRemoveSelector = '[data-test="removeTab"]';
const tabAddSelector = '[data-test="addTab"]';

const appSelector = wrapper => ({
  getTabs: () => wrapper.find(tabSelector),
  getTabsList: () => wrapper.find(tabListSelector),
  getTabsContents: () => wrapper.find(tabContentSelector),
  getLastTab: () => wrapper.find(tabSelector).last(),
  getNthTab: n => wrapper.find(tabSelector).at(n),
  getNthTabContent: n => wrapper.find(tabContentSelector).at(n),
  getNthTabRemove: n => wrapper.find(tabSelector).at(n).find(tabRemoveSelector),
  getAddTab: () => wrapper.find(tabAddSelector),
  clickElement: elem => elem.simulate('click'),
});

describe('Tabs Actions', () => {
  it('tab has activated', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const lastTab = page.getLastTab();
    page.clickElement(lastTab);
    const newLastTab = page.getLastTab();
    expect(newLastTab).toHaveProp('aria-selected', 'true');
  });

  it('content is visible', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const tab = page.getNthTab(3);
    page.clickElement(tab);
    const needleContent = page.getNthTabContent(3);
    expect(needleContent.children()).toExist();
  });

  it('tab has added', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const tabs = page.getTabs();
    const lastIndexToAdd = tabs.length;
    const addTab = page.getAddTab();
    page.clickElement(addTab);
    expect(page.getNthTab(lastIndexToAdd)).toExist();
  });

  it('tab has removed', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const tabs = page.getTabs();
    const tabsCount = tabs.length;
    const removeTab = page.getNthTabRemove(2);
    page.clickElement(removeTab);
    expect(page.getNthTab(tabsCount - 1)).not.toExist();
  });

  it('exact tab has removed', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const needleTab = page.getNthTab(2);
    const needleTabRemove = page.getNthTabRemove(2);
    page.clickElement(needleTabRemove);
    const newTabs = page.getTabs();
    expect(newTabs.contains(needleTab)).toBeFalsy();
  });
});

describe('Work with cookies', () => {
  it('opens last visible tab on reload', () => {
    const TEST_INDEX = 2;
    function CookieContainer() {
      let selectedTab = 0;
      return {
        get() {
          return selectedTab;
        },
        set(i) {
          selectedTab = i;
        },
      };
    }
    const cooks = new CookieContainer();
    Cookies.set.mockImplementation((_, i) => cooks.set(i));
    Cookies.get.mockImplementation(() => cooks.get());

    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const needleTab = page.getNthTab(TEST_INDEX);
    page.clickElement(needleTab);

    const wrapper2 = mount(<App />);
    const page2 = appSelector(wrapper2);
    const needleTab2 = page2.getNthTab(TEST_INDEX);
    expect(needleTab2).toHaveProp('aria-selected', 'true');
  });
});
