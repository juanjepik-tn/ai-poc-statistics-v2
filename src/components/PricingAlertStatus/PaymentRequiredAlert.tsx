import { nexo } from '@/app';
import { Alert, Box, Button, Text } from '@nimbus-ds/components';
import { goTo } from '@tiendanube/nexo';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


const PaymentRequiredAlert: React.FC = () => {
  const { t } = useTranslation('translations');  
  const [width] = useState<number>(window.innerWidth);
  const isMobile = width <= 768;
  return (
    <Box width={isMobile ? '90%' : '50%'} margin="auto">
    <Alert      
      appearance="danger"                      
    >
      <Text color="danger-textLow" fontWeight="bold" fontSize="highlight">
        {t('pricing.paymentRequired.title')}
      </Text>
      <Text color="danger-textLow">
        {t('pricing.paymentRequired.description')}
      </Text>
      <Box display="flex" flexWrap="wrap" gap="2">
      <Button onClick={() => goTo(nexo, '/account/checkout/charges/')}>{t('pricing.paymentRequired.cta')}</Button>      
    </Box>
    </Alert>
    </Box>
  );
};

export default PaymentRequiredAlert;