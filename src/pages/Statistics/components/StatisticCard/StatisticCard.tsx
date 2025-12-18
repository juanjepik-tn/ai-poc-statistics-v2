import React from "react";
import { Box, Card, Icon, Text, Title, Tooltip } from "@nimbus-ds/components";
import { InfoCircleIcon } from "@nimbus-ds/icons";
interface StatisticCardProps {
  title: string;
  value: string | number;
  helpText: string;
}
const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, helpText }) => {    
  return (
    <Box height="80px" width="100%" justifyContent="flex-start" alignItems="flex-start" display="flex">
    <Card>
      <Card.Header>
        <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
          <Box display="flex" flexDirection="row" gap="1"  alignItems="center">
            <Text fontSize="caption" lineHeight="base" textAlign="center">
              {title}
            </Text>
            {/*@ts-ignore*/}
            <Tooltip content={<span style={{ whiteSpace: 'pre' }}>{helpText}</span>} position="top">            <Icon color="primary-interactive" source={<InfoCircleIcon size="small" />} />
            </Tooltip>
          </Box>
          <Title as="h4">
            {value}
          </Title>
        </Box>
      </Card.Header>
    </Card>
    </Box>
  );
};
export default StatisticCard;