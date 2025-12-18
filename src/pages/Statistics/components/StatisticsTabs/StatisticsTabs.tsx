import React from 'react';
import { Tabs, Box } from '@nimbus-ds/components';
import { StatisticsTab } from '@/types/chatStatistics.types';

interface TabConfig {
  id: StatisticsTab;
  label: string;
  content: React.ReactNode;
}

interface StatisticsTabsProps {
  tabs: TabConfig[];
  activeTab: StatisticsTab;
  onTabChange: (tab: StatisticsTab) => void;
}

const StatisticsTabs: React.FC<StatisticsTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const handleTabSelect = (index: number) => {
    const selectedTab = tabs[index];
    if (selectedTab) {
      onTabChange(selectedTab.id);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="4">
      <Tabs
        fullWidth
        preSelectedTab={activeIndex >= 0 ? activeIndex : 0}
      >
        {tabs.map((tab) => (
          <Tabs.Item key={tab.id} label={tab.label}>
            <Box paddingTop="4">{tab.content}</Box>
          </Tabs.Item>
        ))}
      </Tabs>
    </Box>
  );
};

export default StatisticsTabs;

