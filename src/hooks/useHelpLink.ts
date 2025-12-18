import { getStoreInfo } from '@tiendanube/nexo';
import { useEffect, useState } from 'react';

import { nexo } from '@/app';
import { HELP_LINK_CONFIG, OnboardingStep } from '@/constants/helpLinkConfig';

interface UseHelpLinkReturn {
  link: string | null;
  textKey: string;
  loading: boolean;
  error: string | null;
}

export const useHelpLink = (step: OnboardingStep): UseHelpLinkReturn => {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stepConfig = HELP_LINK_CONFIG[step];
  const textKey = stepConfig.textKey;

  useEffect(() => {
    const getCountry = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { country } = await getStoreInfo(nexo);
        const countryLink = stepConfig.links[country as keyof typeof stepConfig.links];
        
        // Fallback a ES si no encuentra el país
        setLink(countryLink || stepConfig.links.ES);
      } catch (err) {
        console.error('Error getting store info:', err);
        setError('Error getting country information');
        // Fallback a ES en caso de error
        setLink(stepConfig.links.ES);
      } finally {
        setLoading(false);
      }
    };

    getCountry();
  }, [step]);

  return {
    link,
    textKey,
    loading,
    error
  };
};
