import React from 'react';
import { Box, Text } from '@nimbus-ds/components';

interface LegendProps {
  payload: any[];
}

const StatisticChartLegend: React.FC<LegendProps> = ({ payload }) => {
  return (
    <Box display="flex" flexDirection="row" gap="6" alignSelf="center" justifyContent="center">
      {payload.map((entry, index) => (
        <Box key={`item-${index}`} display="flex" flexDirection="row">
          <Box display="flex" flexDirection="row" gap="1" alignItems="center">
            <Box
              display="flex"
              width="16px"
              height="16px"
              borderRadius="1"
              borderColor={entry.payload.stroke}
              borderWidth={entry.payload.strokeWidth}
              backgroundColor={entry.color}
            />
            <Text>{entry.value}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default StatisticChartLegend;
