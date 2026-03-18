import React from 'react';
import { Badge, Box as BoxNimbus, Button, SegmentedControl } from '@nimbus-ds/components';
import { SlidersIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BillingDTO } from '@/types/billingDTO';
import Announcement from '@/components/Announcement/Announcement';

type ConversationTabsProps = {
  selectedFilter: string;
  handleFilterChange: (value: string) => void;
  unreadMessagesCount: number;
  onFilterClick?: () => void;
  filtersActive?: boolean;
  activeFilterCount?: number;
};

const ConversationTabs: React.FC<ConversationTabsProps> = ({ 
  selectedFilter, 
  handleFilterChange, 
  unreadMessagesCount,
  onFilterClick,
  filtersActive = false,
  activeFilterCount = 0,
}) => {
  const { t } = useTranslation('translations');
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);
  
  const handleSegmentChange = (segments: string[]) => {
    if (segments.length === 0) return;
    const newSegment = segments.length === 1
      ? segments[0]
      : segments.find(s => s !== selectedFilter) || segments[segments.length - 1];
    handleFilterChange(newSegment);
  };

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" paddingTop="2">
      <Announcement position="bottom-start">
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
      </Announcement>
      
      <Button
        appearance={hasActiveFilters ? 'neutral' : 'transparent'}
        onClick={onFilterClick}
        disabled={!billingData?.activeStatus}
      >
        <SlidersIcon size={16} />
        {t('conversations.filter')}
        {hasActiveFilters && <Badge appearance="primary" count={activeFilterCount} />}
      </Button>
    </BoxNimbus>
  );
};

export default ConversationTabs;
