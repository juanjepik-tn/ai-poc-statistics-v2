import {
  Box,
  Text
} from '@nimbus-ds/components';
import React from 'react';
import { useTranslation } from 'react-i18next';


import OnboardingDataProvider from '../OnboardingStepper/components/ResponseCustomization/OnboardingDataProvider';
import PreferencesForm from '../OnboardingStepper/components/ResponseCustomization/PreferencesForm';

const ConfigurationsPreferences: React.FC = () => {
  const { t } = useTranslation('translations');

  return (
    <Box gap="6" display='flex' flexDirection='column' >
    <Text>{t('config.preferences-description')}</Text>
    <OnboardingDataProvider>
    {({
      storeDetails,        
      responsesLength,
      loading,
      updateResponseLength,
      updateEmojis,
      updatePersonalization,
      updateTraits
    }: any) => (
    <>
      <PreferencesForm source='settings' content={storeDetails} responsesLength={responsesLength} loading={loading}updateResponseLength={(value: any) => { updateResponseLength(value) }} updateEmojis={updateEmojis} updatePersonalization={updatePersonalization} updateTraits={updateTraits} />

    </>
    )}
    </OnboardingDataProvider>
  </Box>
  );
};
export default ConfigurationsPreferences;
