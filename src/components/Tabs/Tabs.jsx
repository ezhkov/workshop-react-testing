import React from 'react';
import {
  Tab,
  Tabs as TabsContainer,
  TabList,
  TabPanel,
} from 'react-tabs';

import nanoid from 'nanoid';
import Cookies from 'js-cookie';
import Parser from 'rss-parser';
import getRSS from '../../utils/apiClient';

import 'react-tabs/style/react-tabs.css';

export default class Tabs extends React.Component {
  state = {
    activeTab: this.getActiveTab(),
    rssAddress: '',
    tabName: '',
    tabs: [
      {
        title: 'Tab header 1',
        content: ['Tab panel 1 content'],
        uid: nanoid(),
      },
      {
        title: 'Tab header 2',
        content: ['Tab panel 2 content'],
        uid: nanoid(),
      },
      {
        title: 'Tab header 3',
        content: ['Tab panel 3 content'],
        uid: nanoid(),
      },
      {
        title: 'Tab header 4',
        content: ['Tab panel 4 content'],
        uid: nanoid(),
      },
    ],
  };

  getActiveTab() {
    const activeTab = Cookies.get('curTab') || 1;
    return Math.min(parseInt(activeTab, 10), 4);
  }

  setActiveTab(index) {
    this.setState({
      activeTab: index,
    });
    Cookies.set('curTab', index);
  }

  makeTab = (info) => {
    const { tabs } = this.state;
    if (!info) {
      return {
        title: `Tab header ${tabs.length + 1}`,
        content: [`Tab panel ${tabs.length + 1} content`],
        uid: nanoid(),
      };
    }
    return {
      title: info.title,
      content: info.items.map(el => el.title),
      uid: nanoid(),
    };
  };

  handleRemoveTab = index => () => {
    const { activeTabIndex } = this.state;
    if (index !== activeTabIndex) {
      this.setState((prevState) => {
        const newTabs = [...prevState.tabs];
        newTabs.splice(index, 1);
        return {
          tabs: newTabs,
        };
      });
    }
  };

  handleTabSelect = (index) => {
    this.setActiveTab(index);
  };

  handleInputRssChange = (e) => {
    this.setState({
      rssAddress: e.target.value,
    });
  };

  handleInputTabNameChange = (e) => {
    this.setState({
      tabName: e.target.value,
    });
  };

  handleFormSubmit = async (e) => {
    const { rssAddress, tabName } = this.state;
    e.preventDefault();
    const parser = new Parser();
    const result = await getRSS(rssAddress);
    const parsed = await parser.parseString(result.data);
    const newTab = this.makeTab({
      title: tabName,
      items: parsed.items,
    });
    this.setState(prevState => ({
      tabs: [
        ...prevState.tabs,
        newTab,
      ],
      rssAddress: '',
      tabName: '',
    }));
  };

  renderTabsList() {
    const { tabs } = this.state;
    return tabs.map((elem, index) => (
      <Tab key={elem.uid} data-test="tab">
        <button type="button" data-test="removeTab" onClick={this.handleRemoveTab(index)}>X</button>
        <span>{ elem.title }</span>
      </Tab>
    ));
  }

  renderTabsPanels() {
    const { tabs } = this.state;
    return tabs.map(elem => (
      <TabPanel key={elem.uid} data-test="tabPanel">
        <div data-test="tabContent">
          { elem.content.map(el => (
            <p key={nanoid()}>{ el }</p>
          )) }
        </div>
      </TabPanel>
    ));
  }

  render() {
    const { activeTab, rssAddress, tabName } = this.state;
    return (
      <>
        <form onSubmit={this.handleFormSubmit} style={{ marginBottom: 20, padding: 20, border: '1px solid #ececec', width: 300 }}>
          <div style={{ marginBottom: 10 }}>
            <input required style={{ width: 300, padding: 8, boxSizing: 'border-box' }} type="text" placeholder="Enter RSS address" name="rssAddress" id="rssAddress" value={rssAddress} onChange={this.handleInputRssChange} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input required style={{ width: 300, padding: 8, boxSizing: 'border-box' }} type="text" placeholder="Enter Tab name" name="tabName" id="tabName" value={tabName} onChange={this.handleInputTabNameChange} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <button data-test="addTab" type="submit">Add tab</button>
          </div>
        </form>
        <TabsContainer onSelect={this.handleTabSelect} selectedIndex={activeTab}>
          <TabList data-test="tabList">
            { this.renderTabsList() }
          </TabList>
          { this.renderTabsPanels() }
        </TabsContainer>
      </>
    );
  }
}
