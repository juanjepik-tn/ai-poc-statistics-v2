import { Box, Card, Tag, Text, Title } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';

type CardPlanProps = {
    title: string;
    price: string;
    currentPlan: boolean;
    savings?: string;
}

export const CardPlan = ({ title, price, currentPlan, savings }: CardPlanProps) => {
    const { t } = useTranslation('translations');
    
  
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <Card >
                <Card.Body>
                <Box width="100%" height="auto" flexDirection="row" display="flex" justifyContent="space-between">
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-start"
                            gap="2"
                        >
                            <Title as="h5" textAlign="left">
                               {t('costs.currentPlan.plan')} {title}
                            </Title>

                            <Title as="h5" textAlign="left">
                                {t('costs.currentPlan.pricePerConversation', { price: price })}
                            </Title>
                            <Text fontSize="caption" color="success-textLow" textAlign="left">
                                {t('costs.currentPlan.savingsPerConversation', { economy: savings })}
                            </Text>   
                        </Box>                        
                    </Box>
                </Card.Body>
            </Card>
        </Box>
    );
};
