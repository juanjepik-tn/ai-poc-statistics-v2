import { nexo } from '@/app';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch, useStoreDetails } from '@/hooks';
import { Box, Button, Tag, Text, useToast } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductInfoCard from './ProductInfoCard';

type InfoProductsProps = {
  cancelOnboarding?: () => void;
  nextStep?: () => void;
  prevStep?: () => void;
};
const InfoProducts: React.FC<InfoProductsProps> = ({ cancelOnboarding, nextStep, prevStep }) => {
  const { t } = useTranslation('translations');
  const [isChecked, setIsChecked] = React.useState(true);
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

  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  return (
    <>
      <Page.Header
        title={t('settings.info-products.title')}
        subtitle={t('settings.info-products.description')}
      >
        <Tag appearance="primary">
          <Text color="primary-textLow">
            {t('settings.step', { step: 2, total: 5 })}
          </Text>
        </Tag>
      </Page.Header>
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <ProductInfoCard 
              t={t} 
              isChecked={isChecked} 
              handleCheckboxChange={handleCheckboxChange} 
            />
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Box
                alignSelf="flex-start"
                display="flex"
              >
                <Button onClick={cancelOnboarding} appearance="neutral">
                  {t('settings.cancel')}
                </Button>
              </Box>
              <Box
                alignSelf="flex-end"
                display="flex"
                justifyContent="space-between"
                gap="2"
              >
                <Button onClick={prevStep} appearance="neutral">
                  {t('settings.previous-step')}
                </Button>
                <Button onClick={nextStep} appearance="primary">
                  {t('settings.next-step')}
                </Button>
              </Box>
            </Box>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </>
  );
};
export default InfoProducts;
