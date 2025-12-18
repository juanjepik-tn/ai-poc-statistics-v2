import { nexo } from '@/app';
import { Box, Card, Text, Title, useToast } from '@nimbus-ds/components';
import { getStoreInfo, goTo } from '@tiendanube/nexo';
import { Trans, useTranslation } from 'react-i18next';
import { PricingCard } from './PricingCard';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';

type Country = {
    country: string;
    currency: string;
    id: number;
}
type PricingCard = {
    id: number;
    name: string;
    costPerChat: string;
    country: Country;
    chatsMax: number;
    chatsMin: number;        
}
export function PricingsCards() {
    const { t } = useTranslation('translations');
    const [width] = useState<number>(window.innerWidth);
    const isMobile = width <= 768;
    const { request } = useFetch();
    const { addToast } = useToast();
    const [pricingCards, setPricingCards] = useState<PricingCard[]>([]);
    const [currentTier, setCurrentTier] = useState<string>('');
    const [storeCountry, setStoreCountry] = useState<string>('');
    useEffect(() => {
        onGetStorePlan();
        const fetchStoreInfo = async () => {
            const { country } = await getStoreInfo(nexo);
            setStoreCountry(country);
        };
        fetchStoreInfo();
    }, []);
    const onGetStorePlan = () => {
        return request<any>({
          url: API_ENDPOINTS.plan.list,
          method: 'GET',
        })
          .then(( {content }: any) => {
            setCurrentTier(content?.plansSelected?.tier);
            setPricingCards(content.plans);     
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

    const getTopImage = (tier: string) => {
        if  (tier == 'tier-top') {
            if (['BR', 'AR', 'MX'].includes(storeCountry)) {     
                console.log('storeCountry', storeCountry);             
                return (storeCountry === 'BR' ? '/imgs/nuvemshop-next.svg' : '/imgs/tienda-nube-evolucion.svg')
            }
            return '';
        }        
    }
    return (
        <>
            <Card>
                <Box display="flex" flexDirection="column" alignItems="center" gap="4">
                    <Box width="100%" height="auto" justifyContent="center">
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-start"
                            gap="2"                            
                        >
                            <Title as="h2"textAlign="left">
                                {t('pricing.plans.title')}
                            </Title>
                            <Text fontSize="base" color="neutral-textHigh" textAlign="left">
                                <Trans
                                    i18nKey="pricing.plans.subtitle"
                                    components={{
                                        bold: <strong />,
                                        a: <a onClick={() => goTo(nexo, '/account/checkout/charges/')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'primary' }} />
                                    }}
                                />
                            </Text>
                        </Box>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap="4"
                >
                    <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap="2">
                     {pricingCards.map((card: any) => {
                        if(card.name==='tier-default') return;                        
                        const price = storeCountry === 'BR' ? `${card.country.currency}$${card.costPerChat} ` : `$${card.costPerChat} ${card.country.currency}`;
                        return (
                            <PricingCard key={card.id} title={t(`pricing.plans.${card.name}`)} price={price} currentPlan={card.name === currentTier} topImage={getTopImage(card?.name)} />
                        );
                     })}
                    </Box>
                    <Text fontSize="base" color="neutral-textHigh" textAlign="left">
                        <Trans
                            t={t}
                            i18nKey="pricing.plans.help-text"
                            components={{ bold: <strong /> }}
                        />
                    </Text>
                </Box>
            </Card>
           
        </>
    );
}
