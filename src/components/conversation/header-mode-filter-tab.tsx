import React from 'react';
import { Box as BoxNimbus, Button, SegmentedControl } from '@nimbus-ds/components';
import { SlidersIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@/redux/store';
import { BillingDTO } from '@/types/billingDTO';

type ConversationTabsProps = {
  selectedFilter: string;
  handleFilterChange: (value: string) => void;
  unreadMessagesCount: number;
  onFilterClick?: () => void;
  filtersActive?: boolean;
};

const ConversationTabs: React.FC<ConversationTabsProps> = ({ 
  selectedFilter, 
  handleFilterChange, 
  unreadMessagesCount,
  onFilterClick,
  filtersActive = false
}) => {
  const { t } = useTranslation('translations');
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);
  
  const handleSegmentChange = (segments: string[]) => {
    if (segments.length > 0) {
      handleFilterChange(segments[0]);
    }
  };

  return (
    <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" paddingTop="2">
      <SegmentedControl
        selectedSegments={[selectedFilter]}
        onSegmentsSelect={handleSegmentChange}
      >
        <SegmentedControl.Button
          id="all"
          label={t('conversations.all')}
          disabled={!billingData?.activeStatus}
        >
          {t('conversations.all')}
        </SegmentedControl.Button>
        <SegmentedControl.Button
          id="priority"
          label={t('conversations.unreads')}
          disabled={!billingData?.activeStatus}
        >
          {t('conversations.unreads')}
        </SegmentedControl.Button>
      </SegmentedControl>
      
      <Button
        appearance="transparent"
        onClick={onFilterClick}
        disabled={!billingData?.activeStatus}
      >
        <SlidersIcon size={16} />
        {t('conversations.filter')}
      </Button>
    </BoxNimbus>
  );
};

export default ConversationTabs;