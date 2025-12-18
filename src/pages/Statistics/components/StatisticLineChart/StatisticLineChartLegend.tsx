import React from 'react';
import { Box, Text } from '@nimbus-ds/components';

interface LegendProps {
  payload?: any[];
}

const StatisticLineChartLegend: React.FC<LegendProps> = ({ payload = [] }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      gap="6"
      alignSelf="center"
      justifyContent="center"
      paddingTop="4"
    >
      {payload.map((entry, index) => (
        <Box key={`legend-${index}`} display="flex" flexDirection="row">
          <Box display="flex" flexDirection="row" gap="1" alignItems="center">
            <Box
              display="flex"
              width="16px"
              height="3px"
              borderRadius="1"
              backgroundColor={entry.color}
            />
            <Text fontSize="caption">{entry.value}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default StatisticLineChartLegend;

