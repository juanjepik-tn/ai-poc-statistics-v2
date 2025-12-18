import React from 'react';
import { Box, Card, Text } from '@nimbus-ds/components';
import { thousandSeparator } from '@/common/utils/thousandSeparator';

interface TooltipProps {
  payload: any[];
  label: string;
  isPercentage?: boolean;
  isCurrency?: boolean;
  currencySymbol?: string;
}

const StatisticLineChartTooltip: React.FC<TooltipProps> = ({
  payload,
  isPercentage = false,
  isCurrency = false,
  currencySymbol = '$',
}) => {
  const formatValue = (value: number): string => {
    if (isPercentage) return `${value.toFixed(1)}%`;
    if (isCurrency) return `${currencySymbol}${thousandSeparator(value)}`;
    return thousandSeparator(value);
  };

  return (
    <Card padding="small">
      <Box display="flex" flexDirection="column" gap="2" padding="none">
        <Text fontSize="caption" fontWeight="bold">
          {payload[0]?.payload?.label || payload[0]?.payload?.name}
        </Text>
        {payload.map((entry, index) => (
          <Box
            key={`tooltip-${index}`}
            display="flex"
            flexDirection="row"
            padding="none"
            gap="1"
            alignItems="center"
          >
            <Box
              display="flex"
              width="12px"
              height="12px"
              borderRadius="1"
              backgroundColor={entry.stroke}
            />
            <Text fontSize="caption" fontWeight="regular">
              {entry.name}:
            </Text>
            <Text fontSize="caption" fontWeight="bold">
              {formatValue(entry.value)}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default StatisticLineChartTooltip;

