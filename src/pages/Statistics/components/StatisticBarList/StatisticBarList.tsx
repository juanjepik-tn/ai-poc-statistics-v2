import React from 'react';
import { Box, Card, Text, Thumbnail } from '@nimbus-ds/components';
import { thousandSeparator } from '@/common/utils/thousandSeparator';

export interface BarListItem {
  name: string;
  count: number;
  percentage?: number;
  image?: string;
}

interface StatisticBarListProps {
  title: string;
  items: BarListItem[];
  maxItems?: number;
  showPercentage?: boolean;
  showImage?: boolean;
  barColor?: string;
}

const StatisticBarList: React.FC<StatisticBarListProps> = ({
  title,
  items,
  maxItems = 6,
  showPercentage = true,
  showImage = false,
  barColor = '#4483B9',
}) => {
  const displayItems = items.slice(0, maxItems);
  const maxCount = Math.max(...displayItems.map((item) => item.count));

  return (
    <Card>
      <Card.Header title={title} />
      <Card.Body>
        <Box display="flex" flexDirection="column" gap="3">
          {displayItems.map((item, index) => {
            const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const percentage = item.percentage ?? (maxCount > 0 ? (item.count / maxCount) * 100 : 0);

            return (
              <Box key={`bar-item-${index}`} display="flex" flexDirection="column" gap="1">
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                    {showImage && item.image && (
                      <Thumbnail
                        src={item.image}
                        alt={item.name}
                        width="32px"
                        aspectRatio="1/1"
                      />
                    )}
                    <Text fontSize="caption" fontWeight="medium">
                      {item.name}
                    </Text>
                  </Box>
                  <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                    <Text fontSize="caption" fontWeight="bold">
                      {thousandSeparator(item.count)}
                    </Text>
                    {showPercentage && (
                      <Text fontSize="caption" color="neutral-textDisabled">
                        ({percentage.toFixed(1)}%)
                      </Text>
                    )}
                  </Box>
                </Box>
                {/* Progress bar using native div for style support */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#E4E9F2',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      backgroundColor: barColor,
                      borderRadius: '3px',
                      transition: 'width 0.4s ease-out',
                    }}
                  />
                </div>
              </Box>
            );
          })}
        </Box>
      </Card.Body>
    </Card>
  );
};

export default StatisticBarList;
