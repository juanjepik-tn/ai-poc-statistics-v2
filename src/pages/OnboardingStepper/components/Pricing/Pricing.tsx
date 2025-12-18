import {
  Box,
  Button,
  Spinner,
  Tag,
  Text,
  useToast
} from '@nimbus-ds/components';
import {
  Layout,
  Page
} from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

import { nexo } from '@/app';

import { PricingsCards } from './PricingsCards';
import { PricingTermsCard } from './PricingTermsCard';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { trackingStartTrial } from '@/tracking';
import { BillingDTO } from '@/types/billingDTO';
import { setBillingData } from '@/redux/slices/billing';
import { useDispatch } from 'react-redux';

type PricingProps = {
  prevStep: () => void;
  nextStep: () => void;
}

const Pricing: React.FC<PricingProps> = ({ prevStep }) => {
  
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const { request } = useFetch();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);
  const startTrial = () => {
    setIsLoading(true);
    return request<any>({
      url: API_ENDPOINTS.billing.activate,
      method: 'POST',      
    })
      .then(async () => {
        trackingStartTrial();
        await onGetBillingData();
        setIsLoading(false);
        navigate('/conversations');
      })
      .catch((error) => {
        setIsLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-products',
        });
      });
  };
  const onGetBillingData = () => {
    return request<any>({
      url: API_ENDPOINTS.billing.billingData,
      method: 'GET',
    })
      .then(({ content }: { content: BillingDTO }) => {             
        dispatch(setBillingData(content));  
      })
      .catch((error) => {
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
      <Page.Header
        title={t('pricing.title')}        
      >
        <Tag appearance="primary">
          <Text color="primary-textLow">
            {t('settings.step', { step: 5, total: 5 })}
          </Text>
        </Tag>
      </Page.Header>
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <PricingsCards />            
            <PricingTermsCard />
            <Box display="flex" flexDirection="row" justifyContent="flex-end" gap="2">             
              <Box
                alignSelf="flex-end"
                display="flex"
                justifyContent="space-between"
                gap="2"
              >             
                <Button onClick={prevStep} appearance="neutral">
                  {t('settings.previous-step')}
                </Button>
                <Button onClick={startTrial} appearance="primary">
                  {isLoading && (
                    <Spinner color="currentColor" size="small" />
                  )}
                  {
                   t('pricing.start-trial')
                  } 
                </Button>
              </Box>
            </Box>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </>
  );
};
export default Pricing;
