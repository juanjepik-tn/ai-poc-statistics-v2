import {
  Box,
  Text
} from '@nimbus-ds/components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PlaygroundView } from '@/components/playground/view';

const ConfigurationsTest: React.FC = () => {  
  const { t } = useTranslation('translations');

  return (
    <Box gap="6" display='flex' flexDirection='column' >
    <Text>{t('settings.step4.description')}</Text>    
    <PlaygroundView source='settings' />
  </Box>
  );
};
export default ConfigurationsTest;
