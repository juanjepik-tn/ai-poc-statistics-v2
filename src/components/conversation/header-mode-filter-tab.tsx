import React from 'react';
import { Box as BoxNimbus, Text } from '@nimbus-ds/components';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@/redux/store';
import { BillingDTO } from '@/types/billingDTO';

type ConversationTabsProps = {
  selectedFilter: string;
  handleFilterChange: (value: string) => void;
  unreadMessagesCount: number;
};

const ConversationTabs: React.FC<ConversationTabsProps> = ({ selectedFilter, handleFilterChange, unreadMessagesCount }) => {
  const { t } = useTranslation('translations');
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);
  return (
    <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between">
      <Tabs value={selectedFilter} onChange={(_event: any, value: any) => handleFilterChange(value)}>
        <Tab
          style={{ textTransform: 'none' }}
          label={<Text fontSize="base" color={selectedFilter === 'all' ? 'primary-interactive' : 'neutral-textHigh'}>{t('conversations.all')}</Text>}
          key={t('conversations.all')}
          disabled={!billingData?.activeStatus}
          value="all"
        />
        <Tab
          style={{ textTransform: 'none' }}
          label={<Text fontSize="base" color={selectedFilter === 'priority' ? 'primary-interactive' : 'neutral-textHigh'}>{`${t('conversations.unreads')} ${unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}`}</Text>}
          key={t('conversations.priority')}
          disabled={!billingData?.activeStatus}
          value="priority"
        />
      </Tabs>
    </BoxNimbus>
  );
};

export default ConversationTabs;