import React from 'react';
import {
  Tab, Tabs as TabsContainer, TabList, TabPanel,
} from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

export default function Tabs() {
  return (
    <TabsContainer>
      <TabList>
        <Tab>Tab header 1</Tab>
        <Tab>Tab header 2</Tab>
        <Tab>Tab header 3</Tab>
        <Tab>Tab header 4</Tab>
      </TabList>

      <TabPanel>
        Tab panel 1 content
      </TabPanel>
      <TabPanel>
        Tab panel 2 content
      </TabPanel>
      <TabPanel>
        Tab panel 3 content
      </TabPanel>
      <TabPanel>
        Tab panel 4 content
      </TabPanel>
    </TabsContainer>
  );
}
