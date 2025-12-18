import React, { ReactNode } from "react";
import { Box, Card, Icon, Text, Title, Tooltip } from "@nimbus-ds/components";
import { InfoCircleIcon } from "@nimbus-ds/icons";
interface CycleCardDataProps {
    title: string;
    value: string | number;
    helpText?: string;
    leyend?: ReactNode;
}
const CycleCardData: React.FC<CycleCardDataProps> = ({ title, value, helpText, leyend }) => {
    return (
        <Box width="100%" justifyContent="flex-start" alignItems="flex-start" display="flex">
            <Card>
                <Card.Header>
                    <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" gap="2">
                        <Box display="flex" flexDirection="row" gap="1" alignItems="center">
                            <Text fontSize="caption" lineHeight="base" textAlign="center">
                                {title}
                            </Text>
                            {/*@ts-ignore*/}
                            {helpText && <Tooltip content={<span style={{ whiteSpace: 'pre' }}>{helpText}</span>} position="top">            <Icon color="primary-interactive" source={<InfoCircleIcon size="small" />} />
                             </Tooltip>}
                        </Box>

                        <Title as="h4">
                            {value}
                        </Title>

                        {leyend}
                    </Box>
                </Card.Header>

            </Card>
        </Box>
    );
};
export default CycleCardData;