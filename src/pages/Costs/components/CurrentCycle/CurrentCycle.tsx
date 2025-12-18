import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { thousandSeparator } from '@/common/utils/thousandSeparator';
import { useFetch } from '@/hooks';
import { Box, Card, Text, useToast } from '@nimbus-ds/components';
import { format, parseISO } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BillingContext } from '../../providers/BillingDataProvider';
import { formatPrice } from '../../utils/formatPrice';
import CycleCardData from './components/CycleCardData';

type CycleDTO = {
    startCycle: string;
    endCycle: string;
    paymentDay: string;
    conversationsCount: number;
    amount: number;
    costPerConversation: number;
}
export function CurrentCycle() {
    const { t } = useTranslation('translations');
    const { request } = useFetch();
    const { addToast } = useToast();
    const { currentPlan, storeCountry } = useContext(BillingContext);
    const [cycleData, setCycleData] = useState<CycleDTO>({
        startCycle: '',
        endCycle: '',
        paymentDay: '',
        conversationsCount: 0,
        amount: 0,
        costPerConversation: 0
    });

    useEffect(() => {
        onGetCurrentCycle();
       
    }, []);

 

    const onGetCurrentCycle = () => {
        return request<any>({
            url: API_ENDPOINTS.billing.currentCycle,
            method: 'GET',
        })
            .then(({ content }: any) => {
                const { 
                    cycleStartDate, 
                    cycleEndDate, 
                    paymentDate, 
                    conversationCount, 
                    totalAmount, 
                    costPerConversation 
                } = content;                
                setCycleData({
                    startCycle: format(parseISO(cycleStartDate), "dd/MM/yyyy"),
                    endCycle: format(parseISO(cycleEndDate), "dd/MM/yyyy"),
                    paymentDay: format(parseISO(paymentDate), "dd/MM/yyyy"),
                   conversationsCount: conversationCount,
                    amount: totalAmount,
                    costPerConversation: costPerConversation,
                });
            })
            .catch((error: any) => {
                addToast({
                    type: 'danger',
                    text: error.message.description ?? error.message,
                    duration: 4000,
                    id: 'error-products',
                });
            });
    };

    const formatCurrencyValue = (value: number) => {
        return formatPrice(
            storeCountry, 
            currentPlan?.country?.currency ?? '', 
            thousandSeparator(value)
        );
    };

    return (
        <Card>
            <Card.Header title={t('costs.currentCycle.title')} />
            <Card.Body>
                <Box display="flex" flexDirection="column" gap="2">
                    <Text fontSize="caption" textAlign="left">                        
                    {t('costs.currentCycle.cycle', { 
                            startCycle: cycleData.startCycle, 
                            endCycle: cycleData.endCycle,
                            interpolation: { escapeValue: false }
                        })}
                    </Text>
                    <Text fontSize="caption" textAlign="left">
                        {t('costs.currentCycle.nextPayment', { 
                            paymentDay: cycleData.paymentDay,
                            interpolation: { escapeValue: false }
                        })}
                    </Text>
                    
                    <CycleCardData 
                        title={t('costs.currentCycle.conversations')} 
                        value={cycleData.conversationsCount} 
                        helpText={t('costs.currentCycle.conversationsHelpText')} 
                    />
                    
                    <CycleCardData 
                        title={t('costs.currentCycle.costPerConversation')} 
                        value={formatCurrencyValue(cycleData.costPerConversation)} 
                        leyend={
                            <Text fontSize="caption" textAlign="left">
                                <Trans
                                    t={t}
                                    i18nKey="pricing.plans.help-text"
                                    components={{ bold: <strong /> }}
                                />
                            </Text>
                        } 
                    />
                    
                    <CycleCardData 
                        title={t('costs.currentCycle.amount')} 
                        value={formatCurrencyValue(cycleData.amount)} 
                    />
                </Box>
            </Card.Body>
        </Card>
    );
}
