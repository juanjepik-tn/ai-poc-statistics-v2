/**
 * POC UI Playground - Billing Data Provider
 * Uses mock data instead of Nexo
 */

import React, { createContext, useEffect, useState } from 'react';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { mockStoreInfo } from '@/mocks/mock-data';

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

const BillingDataProvider: React.FC<any> = ({ children }) => {
  const { addToast } = useToast();
  const { request } = useFetch();
  const [currentPlan, setCurrentPlan] = useState<any>([]);
  const [currentTier, setCurrentTier] = useState<any>([]);
  const [plans, setPlans] = useState<PricingCard[]>([]);
  const [storeCountry, setStoreCountry] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getTierOrder = (tier: string): number => {
    const tierOrder = {
        'tier-free': 0,
        'tier-1': 1,
        'tier-2': 2,
        'tier-3': 3,
        'tier-top': 4
    };
    return tierOrder[tier as keyof typeof tierOrder] || -1;
  };

  useEffect(() => {
    // POC: Use mock store info instead of Nexo
    setStoreCountry(mockStoreInfo.country);
    onGetCurrentPlan();
  }, []);

  const onGetCurrentPlan = () => {
    setLoading(true);
    return request<any>({
      url: API_ENDPOINTS.plan.list,
      method: 'GET',
    })
      .then(({ content }: any) => {        
        setLoading(false);        
        setCurrentPlan(content?.plans.find((plan: any) => plan.name === content?.plansSelected?.tier));  
        setCurrentTier(content?.plansSelected?.tier);
        setPlans(content?.plans.sort((a: any, b: any) => getTierOrder(a.name) - getTierOrder(b.name)));                  
      })
      .catch((error) => {
        setLoading(false);
        addToast({
          type: 'danger',
          text: error?.message?.description ?? error?.message ?? 'Error loading plans',
          duration: 4000,
          id: 'error-update-operation-mode',
        });
      });
  };

  return (
    <BillingContext.Provider
      value={{ currentPlan, storeCountry, loading, currentTier, plans, getTierOrder }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export default BillingDataProvider;
export const BillingContext = createContext<any>(null);
