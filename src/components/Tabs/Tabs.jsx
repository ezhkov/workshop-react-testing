import React from 'react';
import {
  Tab, Tabs as TabsContainer, TabList, TabPanel,
} from 'react-tabs';
import nanoid from 'nanoid';

import 'react-tabs/style/react-tabs.css';

export default class Tabs extends React.Component {
  state = {
    tabs: [
      {
        title: 'Tab header 1',
        content: 'Tab panel 1 content',
        uid: nanoid(),
      },
      {
        title: 'Tab header 2',
        content: 'Tab panel 2 content',
        uid: nanoid(),
      },
      {
        title: 'Tab header 3',
        content: 'Tab panel 3 content',
        uid: nanoid(),
      },
      {
        title: 'Tab header 4',
        content: 'Tab panel 4 content',
        uid: nanoid(),
      },
    ],
  };

  makeTab = () => {
    const { tabs } = this.state;
    return {
      title: `Tab header ${tabs.length + 1}`,
      content: `Tab panel ${tabs.length + 1} content`,
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

  handleAddTab = () => {
    const newTab = this.makeTab();
    this.setState(prevState => ({
      tabs: [
        ...prevState.tabs,
        newTab,
      ],
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
          { elem.content }
        </div>
      </TabPanel>
    ));
  }

  render() {
    return (
      <>
        <div>
          <button data-test="addTab" type="button" onClick={this.handleAddTab}>Add tab</button>
        </div>
        <TabsContainer>
          <TabList data-test="tabs-box">
            { this.renderTabsList() }
          </TabList>
          { this.renderTabsPanels() }
        </TabsContainer>
      </>
    );
  }
}
