import React from 'react';
import {
  Tab, Tabs as TabsContainer, TabList, TabPanel,
} from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

export default function Tabs() {
  return (
    <TabsContainer>
      <TabList>
        <Tab><span data-test="tab">Tab header 1</span></Tab>
        <Tab><span data-test="tab">Tab header 2</span></Tab>
        <Tab><span data-test="tab">Tab header 3</span></Tab>
        <Tab><span data-test="tab">Tab header 4</span></Tab>
      </TabList>

      <TabPanel>
        <div data-test="tabContent">Tab panel 1 content</div>
      </TabPanel>
      <TabPanel>
        <div data-test="tabContent">Tab panel 2 content</div>
      </TabPanel>
      <TabPanel>
        <div data-test="tabContent">Tab panel 3 content</div>
      </TabPanel>
      <TabPanel>
        <div data-test="tabContent">Tab panel 4 content</div>
      </TabPanel>
    </TabsContainer>
  );
}
