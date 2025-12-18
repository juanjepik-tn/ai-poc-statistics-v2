import {
    Box,
    Text
} from '@nimbus-ds/components';
import React from 'react';
import { useTranslation } from 'react-i18next';


import OnboardingDataProvider from '../OnboardingStepper/components/ResponseCustomization/OnboardingDataProvider';
import HumanInterventionForm from '../OnboardingStepper/components/ResponseCustomization/HumanInterventionForm';


const ConfigurationsHumanIntervention: React.FC = () => {
    const { t } = useTranslation('translations');
    
    return (
        <Box gap="6" display='flex' flexDirection='column' >
            <Text>{t('settings.step3.config-5.description')}</Text>
            <OnboardingDataProvider>
                {({
                    loading,
                    onUpdateIaConfigurations,
                    iaConfigurations
                }: any) => (
                    <>
                        <HumanInterventionForm content={iaConfigurations} loading={loading} onUpdateIaConfigurations={onUpdateIaConfigurations} />
                    </>
                )}
            </OnboardingDataProvider>
        </Box>

    );
};
export default ConfigurationsHumanIntervention;
