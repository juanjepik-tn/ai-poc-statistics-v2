import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch, useStoreDetails } from '@/hooks';
import { useToast } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const OnboardingDataProvider: React.FC<any> = ({ children }) => {
  const { addToast, closeToast } = useToast();
  const { request } = useFetch();
  const [responsesLength, setResponsesLength] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('translations');
  const { storeDetails } = useStoreDetails();

  useEffect(() => {    
    onGetResponsesLength();    
  }, []);

  const onGetResponsesLength = () => {
    request<any[]>({
      url: API_ENDPOINTS.iaConfig.responsesLength,
      method: 'GET',
    })
      .then(({ content }) => {        
        setResponsesLength(content);
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-config-responses-length',
        });
      });
  };
  const updateResponseLength = (responseLength: any) => {
    return request<any>({
      url: API_ENDPOINTS.iaConfig.updateResponseLength(responseLength),
      method: 'PUT',      
    })
      .then(() => {         
        closeToast('update-response-customization');
        addToast({
          type: 'success',
          text: t('settings.success'),
          duration: 4000,
          id: 'update-response-customization',
        });
        return true;
      })
      .catch((error) => {
        setLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-ia-configurations',
        });
        return false;
      });
  };
  const updateEmojis = () => {
    return request<any>({
      url: API_ENDPOINTS.iaConfig.toggleEmojis,
      method: 'PUT',      
    })
      .then(() => {       
        closeToast('update-response-customization');
        addToast({
          type: 'success',
          text: t('settings.success'),
          duration: 4000,
          id: 'update-response-customization',
        });
        return true;
      })
      .catch((error) => {
        setLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-ia-configurations',
        });
        return false;
      });
  };
  const updatePersonalization = (data: string) => {
    return request<any>({
      url: API_ENDPOINTS.iaConfig.personalization,
      method: 'PUT',      
      data: {
        personalization: data
      }
    })
      .then(() => {       
        addToast({
          type: 'success',
          text: t('settings.success'),
          duration: 4000,
          id: 'update-response-customization',
        });
        return true;
      })
      .catch((error) => {
        setLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-ia-configurations',
        });
        return false;
      });
  };
  const updateTraits = (data: string) => {
    return request<any>({
      url: API_ENDPOINTS.iaConfig.traits,
      method: 'PUT',      
      data: {
        personality_traits: data
      }
    })
      .then(() => {       
        closeToast('update-response-customization');
        addToast({
          type: 'success',
          text: t('settings.success'),
          duration: 4000,
          id: 'update-response-customization',
        });
        return true;
      })
      .catch((error) => {
        setLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-ia-configurations',
        });
        return false;
      });
  };

  return children({
    responsesLength,
    loading,
    storeDetails,
    updateResponseLength,
    updateEmojis,
    updatePersonalization,
    updateTraits
  });
};

export default OnboardingDataProvider;
