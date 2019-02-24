import React from 'react';
import {
  Tab, Tabs as TabsContainer, TabList, TabPanel,
} from 'react-tabs';
import Rodal from 'rodal';
import nanoid from 'nanoid';
import Cookies from 'js-cookie';
import Parser from 'rss-parser';
import getRSS from '../../utils/apiClient';

import 'react-tabs/style/react-tabs.css';
import 'rodal/lib/rodal.css';


export default class Tabs extends React.Component {
  state = {
    activeTab: this.getActiveTab(),
    showModal: false,
    rssAddress: '',
    loadingRss: false,
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

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false,
    });
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

  handleAddTab = () => {
    this.showModal();
  };

  handleTabSelect = (index) => {
    this.setActiveTab(index);
  };

  handleInputChange = (e) => {
    this.setState({
      rssAddress: e.target.value,
    });
  };

  handleFormSubmit = async (e) => {
    const { rssAddress } = this.state;
    e.preventDefault();
    const parser = new Parser();
    const result = await getRSS(rssAddress);
    const parsed = await parser.parseString(result.data);
    const newTab = this.makeTab({
      title: parsed.title,
      items: parsed.items,
    });
    this.setState(prevState => ({
      tabs: [
        ...prevState.tabs,
        newTab,
      ],
      showModal: false,
      rssAddress: '',
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
      <TabPanel key={elem.uid} data-test="tabContent">
        <div>
          { elem.content.map(el => (
            <p key={nanoid()}>{ el }</p>
          )) }
        </div>
      </TabPanel>
    ));
  }

  render() {
    const { activeTab, showModal, rssAddress } = this.state;
    return (
      <>
        <div>
          <button data-test="addTab" type="button" onClick={this.handleAddTab}>Add tab</button>
        </div>
        <TabsContainer onSelect={this.handleTabSelect} selectedIndex={activeTab}>
          <TabList data-test="tabList">
            { this.renderTabsList() }
          </TabList>
          { this.renderTabsPanels() }
        </TabsContainer>
        <Rodal visible={showModal} onClose={this.hideModal} data-test="modal">
          <form
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            action=""
            onSubmit={this.handleFormSubmit}
          >
            <input
              style={{
                padding: [0, 8, 0, 0],
                fontSize: 16,
              }}
              required
              type="text"
              name="rssAddress"
              value={rssAddress}
              onChange={this.handleInputChange}
            />
            <button
              style={{

              }}
              type="submit"
            >
              Save RSS
            </button>
          </form>
        </Rodal>
      </>
    );
  }
}
