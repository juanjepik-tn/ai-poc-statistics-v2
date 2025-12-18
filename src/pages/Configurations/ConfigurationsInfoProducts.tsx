import { Box, Text, useToast } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ProductInfoCard from '../OnboardingStepper/components/InfoProducts/ProductInfoCard';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useStoreDetails } from '@/hooks/useStoreDetails';
import { useFetch } from '@/hooks';

const ConfigurationsInstances: React.FC = () => {
  const { t } = useTranslation('translations');  
  const [isChecked, setIsChecked] = useState(true); 
  const { storeDetails } = useStoreDetails();
  const { request } = useFetch();
  const { addToast } = useToast();  
  useEffect(() => {
    setIsChecked(storeDetails?.agree_to_use_information_from_store || false);
  }, [storeDetails]);
  const updateAgreeToUseInformationFromStore = () => {
    return request<any>({
      url: API_ENDPOINTS.iaConfig.toggleAgreeToUseInformationFromStore,
      method: 'PUT',      
    })
      .then(() => {       
        addToast({
          type: 'success',
          text: t('settings.success'),
          duration: 4000,
          id: 'update-messages',
        });
        return true;
      })
      .catch((error) => {        
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-ia-configurations',
        });
        return false;
      });
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    updateAgreeToUseInformationFromStore();
  };

  return (
     <Box gap="6" display="flex" flexDirection="column">
        <Text>{t('settings.info-products.description')}</Text>
        <ProductInfoCard t={t} isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} />
     </Box>
  );
};
export default ConfigurationsInstances;
