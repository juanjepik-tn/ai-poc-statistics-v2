import { nexo } from '@/app';
import { thousandSeparator } from '@/common/utils/thousandSeparator';
import { formatPrice } from '@/pages/Costs/utils/formatPrice';
import { Accordion, Box, Button, Card, Skeleton, Text, Title } from '@nimbus-ds/components';
import { goTo } from '@tiendanube/nexo';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BillingContext } from '../../providers/BillingDataProvider';
import { CardPlan } from './components/CardPlan';



export function CurrentPlanInfo() {
    const { t } = useTranslation('translations');
    const [width] = useState<number>(window.innerWidth);
    const isMobile = width <= 768;
    const { currentPlan, storeCountry, loading, currentTier, plans, getTierOrder } = useContext(BillingContext);

    const getTierTitle = (tier: string) => {
        if (tier == 'tier-top') {
            if (['BR', 'AR', 'MX'].includes(storeCountry)) {                
                return (storeCountry === 'BR' ? 'Next' : 'Evolución')
            }
            return '';
        } else {
            return t(`pricing.plans.${tier}`);
        }
    }
 
    const isTopTier = (): boolean => {
        return currentTier === plans[plans.length - 1]?.name;
    }; 
    const calculateSavings = (targetPlan: any): number => {
        if (!currentPlan?.costPerChat || !targetPlan?.costPerChat) {
            return 0;
        }
        const savings = currentPlan.costPerChat - targetPlan.costPerChat;
        return savings > 0 ? savings : 0;
    };
    const formatCurrencyValue = (value: number) => {
        return formatPrice(
            storeCountry, 
            currentPlan?.country?.currency ?? '', 
            thousandSeparator(value)
        );
    };

    return (
        <>
            <Card>
                <Box display="flex" flexDirection="column" alignItems="center" gap="4">
                    <Box width="100%" height="auto" flexDirection={isMobile ? 'column' : 'row'} display="flex" justifyContent="space-between">
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-start"
                            gap="2"
                        >
                            {loading ? (
                                <>
                                    <Skeleton
                                        height="20px"
                                        width="200px"
                                        borderRadius="50"
                                    />
                                    <Skeleton
                                        height="20px"
                                        width="300px"
                                        borderRadius="50"
                                    />
                                </>
                            ) : (
                                <>
                                    <Title as="h4" textAlign="left">
                                        {t('costs.currentPlan.title')}: {getTierTitle(currentPlan?.name)}
                                    </Title>
                                    <Title as="h3" textAlign="left">
                                        {t('costs.currentPlan.pricePerConversation', { price: formatCurrencyValue(currentPlan?.costPerChat) })}
                                    </Title>
                                </>
                            )}
                        </Box>
                        {!isTopTier() && !loading && <Box display="flex" flexDirection="column" gap="2" alignItems={isMobile ? 'flex-start' : 'flex-end'}>
                            <Text fontSize="caption" color="success-textLow" textAlign="left">
                                {t('costs.currentPlan.savingsPerConversationEstimate', { economy: formatCurrencyValue(calculateSavings(plans[plans.length - 1])) })}
                            </Text>
                            <Button appearance="primary" onClick={() => goTo(nexo, '/account/plans/')}>
                                {t('costs.currentPlan.upgradeCTA')}
                            </Button>

                        </Box>}
                    </Box>
                </Box>
                {!isTopTier() && !loading && <Box
                    display="flex"
                    flexDirection="column"
                    gap="4"
                >

                    <Accordion>
                        <Card padding="none">
                            <Accordion.Item index="0">
                                <Accordion.Header
                                    borderTop="none"
                                    subtitle={t('costs.currentPlan.comparePlans')}
                                />

                                <Accordion.Body padding="none">
                                    <Box display="flex" flexDirection="column" gap="2" width="100%" padding="2" cursor="auto">
                                        {plans
                                            .filter((card: any) =>
                                                card.name !== 'tier-default' &&
                                                getTierOrder(card.name) > getTierOrder(currentTier)
                                            )
                                            .map((card: any) => {
                                                const price = formatCurrencyValue(card.costPerChat);
                                                return (
                                                    <CardPlan
                                                        key={card.id}
                                                        title={getTierTitle(card.name)}
                                                        price={price}
                                                        currentPlan={card.name === currentTier}
                                                        savings={formatCurrencyValue(calculateSavings(card))}
                                                    />
                                                );
                                            })}
                                    </Box>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Card>
                    </Accordion>


                </Box>}
            </Card>

        </>
    );
}
