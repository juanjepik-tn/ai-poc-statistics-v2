import { Box, Button, Card, Icon, Text } from "@nimbus-ds/components";
import { SlidersIcon } from "@nimbus-ds/icons";
import { format, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import StatisticsFilterForm from "./StatisticsFilterForm";
import { ChannelFilter, ChannelFilterValue } from "@/components/ChannelFilter";
import { selectAvailableChannelTypes, selectActiveFilter, setActiveFilter } from "@/redux/slices/channels";

interface StatisticCardProps {
  onFiltersChange: (filters: any) => void;
}

const StatisticsFilter: React.FC<StatisticCardProps> = ({ onFiltersChange }) => {
  
  const { t } = useTranslation('translations');
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen((prevState: boolean) => !prevState);
  const [filters, setFilters] = useState<any>({
    dateFrom: subDays(new Date(), 7),
    dateTo: new Date(),            
  });
  
  // Channel filter state from Redux
  const availableChannelTypes = useSelector(selectAvailableChannelTypes);
  const channelFilter = useSelector(selectActiveFilter);
  
  const handleChannelFilterChange = (value: ChannelFilterValue) => {
    dispatch(setActiveFilter(value));
    // Update filters to include channel
    const newFilters = { ...filters, channel: value };
    onFiltersChange(newFilters);
  };
  
  const handleFilters = (filters: any) => {
    // Include current channel filter
    const filtersWithChannel = { ...filters, channel: channelFilter };
    setFilters(filters);
    onFiltersChange(filtersWithChannel);
  };
  
  useEffect(() => {
    onFiltersChange({ ...filters, channel: channelFilter });
  }, []);
  return (
    <>
      <Card>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap="4" flexWrap="wrap">
          <Box display="flex" alignItems="center" gap="4">
            <Text>
              {t('statistics.data-range', { startDate:format(filters?.dateFrom, "dd-MM-yyyy"), endDate: format(filters?.dateTo, "dd-MM-yyyy") })}
            </Text>
            {/* Channel Filter - only show if multiple channels are available */}
            {availableChannelTypes.length > 1 && (
              <ChannelFilter
                value={channelFilter}
                onChange={handleChannelFilterChange}
                availableChannels={availableChannelTypes}
              />
            )}
          </Box>
          <Button appearance="neutral" onClick={toggleOpen}>
            {t('common.filters')}
            <Icon color="currentColor" source={<SlidersIcon />} />
          </Button>
        </Box>
      </Card>    
    <StatisticsFilterForm open={open} toggleOpen={toggleOpen} filters={filters} setFilters={handleFilters} />
    </>
  );
};

export default StatisticsFilter;
