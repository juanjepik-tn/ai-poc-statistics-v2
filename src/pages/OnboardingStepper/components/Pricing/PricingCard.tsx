import { Box, Card, Tag, Text, Title } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';

type PricingCardProps = {
    title: string;
    price: string;
    currentPlan: boolean;
    topImage?: string;
}

export const PricingCard = ({ title, price, currentPlan, topImage }: PricingCardProps) => {
    const { t } = useTranslation('translations');
    
  
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-end">

            <Card padding="none">
                <Card.Body>
                    {currentPlan && (
                        <Box
                            backgroundColor="primary-interactive"
                            padding="1"
                            gap="none"
                        >
                            <Text color="neutral-background" fontSize="base" textAlign="center">
                                {t('pricing.plans.currentPlan')}
                            </Text>
                        </Box>

                    )}
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap="4"
                        padding="4"
                    >  
                            {title === 'top' ? (
                                <Box display="flex" alignItems="center">
                                    <img src={topImage} alt="top" width="100px"/>
                                </Box>
                            ) : (
                                <Tag appearance="primary">
                                <Text color="neutral-textHigh" fontSize="caption">
                                    {title}
                                </Text>
                                </Tag>
                            )}
                     
                        <Box
                            flexDirection="row"
                        >
                            <Title as="h5">{price}</Title>
                            <Text fontSize="caption">{t('pricing.plans.detail')}</Text>
                        </Box>
                    </Box>
                </Card.Body>
            </Card>
        </Box>
    );
};
