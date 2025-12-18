import React from 'react';
import { Box, Card, Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
interface TooltipProps {
  payload: any[];
  label: string;
}
const StatisticChartTooltip: React.FC<TooltipProps> = ({ payload }) => {
  const { t } = useTranslation('translations');
  return (
    <Card padding="small">
    <Box display="flex" flexDirection="column" gap="2" padding="none">
        <Text fontSize="caption" fontWeight="bold">{payload[0]?.payload?.label}</Text>
        <Box display="flex" flexDirection="row" padding="none" gap="1">
        <Box
              display="flex"
              width="16px"
              height="16px"
              borderRadius="1"
              borderColor={payload[1]?.stroke}
              borderWidth={payload[1]?.strokeWidth}
              backgroundColor={payload[1]?.color}
            /> <Text fontSize="caption" fontWeight="regular">{t('statistics.total-messages')}:</Text> <Text fontSize="caption" fontWeight="bold">{payload[1]?.value + payload[0]?.value}</Text>
        </Box>
        <Box display="flex" flexDirection="row" padding="none" gap="1">
        <Box
              display="flex"
              width="16px"
              height="16px"
              borderRadius="1"
              borderColor={payload[0]?.stroke}
              borderWidth={payload[0]?.strokeWidth}
              backgroundColor={payload[0]?.color}
            /><Text fontSize="caption" fontWeight="regular" style={{ color: payload[0]?.color }}>{payload[0]?.name}:</Text> <Text fontSize="caption" fontWeight="bold">{payload[0]?.value}</Text>
        </Box>
        {/*<Box display="flex" flexDirection="row" padding="none" gap="1">
            <Text fontSize="caption" fontWeight="regular">{payload[1].name}:</Text> <Text fontSize="caption" fontWeight="bold">{payload[1].value}</Text>
        </Box>}*/}
      </Box>
    </Card>
  );
};
export default StatisticChartTooltip;