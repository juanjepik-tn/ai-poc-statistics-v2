import { Box, Button, Card, Icon, Text } from "@nimbus-ds/components";
import { SlidersIcon } from "@nimbus-ds/icons";
import { format, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StatisticsFilterForm from "./StatisticsFilterForm";

interface StatisticCardProps {
  onFiltersChange: (filters: any) => void;
}

const StatisticsFilter: React.FC<StatisticCardProps> = ({ onFiltersChange }) => {
  
  const { t } = useTranslation('translations');
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen((prevState: boolean) => !prevState);
  const [filters, setFilters] = useState<any>({
    dateFrom: subDays(new Date(), 7),
    dateTo: new Date(),            
});
  const handleFilters = (filters: any) => {
    setFilters(filters);
    onFiltersChange(filters);
  };
 useEffect(() => {
  onFiltersChange(filters);
 }, []);
  return (
    <>
      <Card>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text>
            {t('statistics.data-range', { startDate:format(filters?.dateFrom, "dd-MM-yyyy"), endDate: format(filters?.dateTo, "dd-MM-yyyy") })}
          </Text>
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
