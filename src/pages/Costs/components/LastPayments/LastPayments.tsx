import { nexo } from '@/app';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import { PricingCard } from '@/pages/OnboardingStepper/components/Pricing/PricingCard';
import { Box, Card, Icon, Link, Tag, Text, useToast } from '@nimbus-ds/components';
import { BoxUnpackedIcon, ChevronDownIcon, ClockIcon, CreditCardIcon, ExternalLinkIcon } from '@nimbus-ds/icons';
import { getStoreInfo, goTo } from '@tiendanube/nexo';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CycleCardData from './components/PaymenItem';
import { DataList, HelpLink } from '@nimbus-ds/patterns';
import PaymentItem from './components/PaymenItem';
import { BillingContext } from '../../providers/BillingDataProvider';


type PricingCard = {
    id: number;
    name: string;
}
type PaymentDTO = {
    amount: number;
    end_date: string;
    start_date: string;
    status: string;
    description: string;
}

export function LastPayments() {
    const { t } = useTranslation('translations');
    const { request } = useFetch();
    const { addToast } = useToast();    
    const [payments, setPayments] = useState<PaymentDTO[]>([]);
    const { currentPlan, storeCountry } = useContext(BillingContext);
    useEffect(() => {
        onGetPayments();        
    }, []);
    const onGetPayments = () => {
        return request<any>({
            url: API_ENDPOINTS.billing.payments,
            method: 'GET',
        })
            .then(({ content }: any) => {
                setPayments(content);
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

    return (
        <>
            <Card>
                <Card.Header title={t('costs.lastPayments.title')} />
                <Card.Body>

                    <DataList>
                        {payments.map((payment, index) => (
                            <DataList.Row key={index} gap="1">
                                <PaymentItem payment={payment} currentPlan={currentPlan} storeCountry={storeCountry} />
                            </DataList.Row>
                        ))}
                        <DataList.Row>

                            <Link
                                as="a"
                                onClick={() => goTo(nexo, '/account/checkout/charges/')}
                                target="_blank"
                                appearance="primary"
                                textDecoration="none"
                            >
                                <Icon source={<ExternalLinkIcon />} color="currentColor" />
                                {t('costs.lastPayments.paymentCTA')}
                            </Link>

                        </DataList.Row>
                    </DataList>
                </Card.Body>
            </Card>

        </>
    );
}
