import { Box, Icon, Link, Tag, Text } from '@nimbus-ds/components';
import { HelpLink, Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { nexo } from '@/app';
import { useHelpLink } from '@/hooks';
import OnboardingDataProvider from './OnboardingDataProvider';
import PreferencesForm from './PreferencesForm';
import { ExternalLinkIcon } from '@nimbus-ds/icons';
import { trackingHelpLink } from '@/tracking';
type ResponseCustomizationProps = {
  prevStep: () => void;
  nextStep: () => void;
  cancelOnboarding: () => void;
};
const ResponseCustomization: React.FC<ResponseCustomizationProps> = ({ prevStep, nextStep, cancelOnboarding }) => {
  // const navigate = useNavigate();
  const { t } = useTranslation('translations');
  
  const { link, textKey } = useHelpLink('ResponseCustomization');
  
  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  return (
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
          <Page.Header
            title={t('settings.step3.title')}
            subtitle={t('settings.step3.description')}
          >
            <Tag appearance="primary">
              <Text color="primary-textLow">
                {t('settings.step', { step: 1, total: 4 })}
              </Text>
            </Tag>
          </Page.Header>
          <Page.Body>
            <Layout columns="1">
              <Layout.Section>
                <PreferencesForm source='onboarding' content={storeDetails} responsesLength={responsesLength} loading={loading} nextStep={nextStep} updateResponseLength={(value: any) => { updateResponseLength(value) }} updateEmojis={updateEmojis} updatePersonalization={updatePersonalization} updateTraits={updateTraits} prevStep={prevStep} cancelOnboarding={cancelOnboarding} />
                {link && (
              <HelpLink>
                <Link
                  as="a"
                  onClick={(e) => {                    
                    trackingHelpLink({ source: 'ResponseCustomization' });                    
                  }}
                  href={link}
                  target="_blank"
                  appearance="primary"
                  textDecoration="none"
                >
                  {t(textKey)}
                  <Icon source={<ExternalLinkIcon />} color="currentColor" />
                </Link>
              </HelpLink>
            )}
              </Layout.Section>
            </Layout>
          </Page.Body>
        </>
      )}
    </OnboardingDataProvider>
  );
};
export default ResponseCustomization;
