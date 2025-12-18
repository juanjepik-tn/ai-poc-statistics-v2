import {
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

import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import { setBillingData } from '@/redux/slices/billing';
import { trackingStartTrial } from '@/tracking';
import { BillingDTO } from '@/types/billingDTO';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CurrentCycle } from './components/CurrentCycle/CurrentCycle';
import { CurrentPlanInfo } from './components/CurrentPlanInfo/CurrentPlanInfo';
import { LastPayments } from './components/LastPayments/LastPayments';


const Costs: React.FC = () => {
  
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const { request } = useFetch();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  return (
    <>
      <Page.Header
        title={t('costs.title')}   
      />      
      <Page.Body>
        <Layout columns="1" marginBottom="4">
          <Layout.Section>
          <CurrentPlanInfo />                
          </Layout.Section>
        </Layout>
        <Layout columns="2 - symmetric">
          <Layout.Section>
          <CurrentCycle />
          </Layout.Section>
          <Layout.Section>
          <LastPayments />
          </Layout.Section>
        </Layout>
      </Page.Body>
    </>
  );
};
export default Costs;
