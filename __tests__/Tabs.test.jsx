import React from 'react';
import { mount } from 'enzyme';
import nock from 'nock';
import Cookies from 'js-cookie';
import Parser from 'rss-parser';
import fs from 'fs';
import App from '../src/components/App';

jest.mock('js-cookie');

const tabSelector = 'li[data-test="tab"]';
const tabListSelector = 'ul[data-test="tabList"]';
const tabPanelSelector = 'div[data-test="tabPanel"]';
const tabContentSelector = 'div[data-test="tabContent"]';
const tabRemoveSelector = '[data-test="removeTab"]';
const tabAddSelector = '[data-test="addTab"]';
const urlInputSelector = '[data-test="urlInput"]';
const tabNameInputSelector = '[data-test="tabNameInput"]';
const formSelector = '[data-test="addForm"]';
const rssElemSelector = '[data-test="tabContentElem"]';

const appSelector = wrapper => ({
  getTabs: () => wrapper.find(tabSelector),
  getTabsList: () => wrapper.find(tabListSelector),
  getTabsPanels: () => wrapper.find(tabPanelSelector),
  getLastTab: () => wrapper.find(tabSelector).last(),
  getLastTabPanel: () => wrapper.find(tabPanelSelector).last(),
  getLastTabPanelContent: () => wrapper.find(tabPanelSelector).last().find(tabContentSelector),
  getNthTab: n => wrapper.find(tabSelector).at(n),
  getNthTabPanel: n => wrapper.find(tabPanelSelector).at(n),
  getNthTabRemove: n => wrapper.find(tabSelector).at(n).find(tabRemoveSelector),
  getAddTab: () => wrapper.find(tabAddSelector),
  clickElement: elem => elem.simulate('click'),
  changeInput: (elem, value) => elem.simulate('change', { target: { value } }),
  submitForm: elem => elem.simulate('submit'),
  getUrlInput: () => wrapper.find(urlInputSelector),
  getTabNameInput: () => wrapper.find(tabNameInputSelector),
  getForm: () => wrapper.find(formSelector),
});

const delay = t => new Promise((resolve) => {
  setTimeout(() => resolve(), t);
});

describe('Tabs Actions', () => {
  it('tab has activated', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const lastTab = page.getLastTab();
    lastTab.simulate('click');
    const newLastTab = page.getLastTab();
    expect(newLastTab).toHaveProp('aria-selected', 'true');
  });

  it('content is visible', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const tab = page.getNthTab(3);
    tab.simulate('click');
    const needleContent = page.getNthTabPanel(3);
    expect(needleContent).toContainMatchingElements(1, tabContentSelector);
  });

  it('tab has added', async () => {
    const CORS_URL = 'https://cors.io';
    const RSS_SAMPLE_URL = 'sample_url';
    const fixtures = fs.readFileSync('./__fixtures__/rss.xml', 'utf-8');
    const P = new Parser();
    const parsedFixtures = await P.parseString(fixtures);
    const parsedItemsCount = parsedFixtures.items.length;

    nock(CORS_URL)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get(`/?${RSS_SAMPLE_URL}`)
      .reply(200, fixtures);

    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const urlInput = page.getUrlInput();
    const tabNameInput = page.getTabNameInput();
    const addTabButton = page.getAddTab();
    const rssForm = page.getForm();
    const tabs = page.getTabs();
    const tabsCount = tabs.length;
    urlInput.simulate('change', { target: { value: 'sample_url' } });
    tabNameInput.simulate('change', { target: { value: 'New async tab' } });
    addTabButton.simulate('click');
    rssForm.simulate('submit');
    await delay(100);
    wrapper.update();
    const newTabs = page.getTabsList();
    const prevTab = page.getNthTab(tabsCount - 1);
    const lastTab = page.getLastTab();
    const lastTabPanel = page.getLastTabPanel();
    const lastTabPanelContent = page.getLastTabPanelContent();
    expect(newTabs).toContainMatchingElements(tabsCount + 1, tabSelector);
    expect(prevTab).toHaveProp('aria-selected', 'false');
    expect(lastTab).toHaveProp('aria-selected', 'true');
    expect(lastTab).toIncludeText('New async tab');
    expect(lastTabPanel).toContainMatchingElements(1, tabContentSelector);
    expect(lastTabPanelContent).toContainMatchingElements(parsedItemsCount, rssElemSelector);
  });

  it('tab has removed', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const tabs = page.getTabs();
    const tabsCount = tabs.length;
    const removeTab = page.getNthTabRemove(2);
    page.clickElement(removeTab);
    const tabList = page.getTabsList();
    expect(tabList).toContainMatchingElements(tabsCount - 1, tabSelector);
  });

  it('exact tab has removed', () => {
    const wrapper = mount(<App />);
    const page = appSelector(wrapper);
    const needleTabRemove = page.getNthTabRemove(2);
    page.clickElement(needleTabRemove);
    const needleTab = page.getNthTab(2);
    expect(needleTab).not.toIncludeText('Tab header 3');
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
