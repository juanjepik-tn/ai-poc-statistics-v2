/**
 * StatisticDonutChart Component
 * Donut chart for showing distribution data (e.g., topic distribution)
 * Follows Nimbus DS styling patterns
 */

import { Box, Card, Text } from '@nimbus-ds/components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface StatisticDonutChartProps {
  data: DonutChartDataPoint[];
  title?: string;
  subtitle?: string;
  totalLabel?: string;
  showTotal?: boolean;
  colors?: string[];
}

// Default color palette following Nimbus-like colors
const DEFAULT_COLORS = [
  '#4285F4', // Blue
  '#EA4335', // Red
  '#FBBC04', // Yellow
  '#34A853', // Green
  '#9334E6', // Purple
  '#9E9E9E', // Gray
  '#FF6D01', // Orange
  '#46BDC6', // Teal
  '#7BAAF7', // Light Blue
  '#F07B72', // Light Red
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box
        backgroundColor="neutral-background"
        padding="3"
        borderRadius="2"
        boxShadow="2"
        style={{ border: '1px solid #e0e0e0' }}
      >
        <Box display="flex" alignItems="center" gap="2">
          <Box
            width="12px"
            height="12px"
            borderRadius="1"
            style={{ backgroundColor: data.color || payload[0].payload.fill }}
          />
          <Text fontSize="caption" fontWeight="medium" color="neutral-textHigh">
            {data.name}
          </Text>
        </Box>
        <Text fontSize="base" fontWeight="bold" color="neutral-textHigh">
          {data.value}%
        </Text>
      </Box>
    );
  }
  return null;
};

function StatisticDonutChart({
  data,
  title,
  subtitle,
  totalLabel = 'Total',
  showTotal = true,
  colors = DEFAULT_COLORS,
}: StatisticDonutChartProps) {
  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Assign colors to data points
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }));

  return (
    <Card>
      {title && (
        <Card.Header title={title} />
      )}
      <Box padding="4">
        {subtitle && (
          <Box marginBottom="4">
            <Text fontSize="caption" color="neutral-textLow">
              {subtitle}
            </Text>
          </Box>
        )}
        
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="center"
          gap="6"
        >
          {/* Donut Chart */}
          <Box width="200px" height="200px" position="relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithColors}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ outline: 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Legend */}
          <Box flex="1" display="flex" flexDirection="column" gap="3">
            {dataWithColors.map((item, index) => (
              <Box 
                key={index} 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                gap="3"
              >
                <Box display="flex" alignItems="center" gap="2">
                  <Box
                    width="16px"
                    height="16px"
                    borderRadius="1"
                    style={{ backgroundColor: item.color, flexShrink: 0 }}
                  />
                  <Text fontSize="base" color="neutral-textHigh">
                    {item.name}
                  </Text>
                </Box>
                <Text fontSize="base" fontWeight="bold" color="neutral-textHigh">
                  {item.value}%
                </Text>
              </Box>
            ))}

            {/* Total */}
            {showTotal && (
              <>
                <Box 
                  borderTopWidth="1" 
                  borderStyle="solid" 
                  borderColor="neutral-surfaceHighlight"
                  marginTop="2"
                  paddingTop="3"
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text fontSize="base" color="neutral-textLow">
                      {totalLabel}
                    </Text>
                    <Text fontSize="base" fontWeight="bold" color="neutral-textLow">
                      {total}
                    </Text>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default StatisticDonutChart;

