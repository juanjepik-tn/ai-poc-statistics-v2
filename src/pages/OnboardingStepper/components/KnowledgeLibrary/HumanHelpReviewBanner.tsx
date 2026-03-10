import React from 'react';
import { Alert, Box, Button, Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';

interface HumanHelpReviewBannerProps {
  scenariosCreatedCount: number;
  onDismiss: () => void;
}

const HumanHelpReviewBanner: React.FC<HumanHelpReviewBannerProps> = ({ scenariosCreatedCount, onDismiss }) => {
  const { t } = useTranslation('translations');

  if (scenariosCreatedCount === 0) {
    return null;
  }

  const handleGoToHumanSupport = () => {
    window.location.hash = '#/configurations/2';
  };

  return (
    <Box marginBottom="4">
      <Alert 
        appearance="warning"
        title={t('settings.step2.scenarioBanner.title')}
        onRemove={onDismiss}
      >
        <Box display="flex" flexDirection="column" gap="3">
          <Text>
            {t('settings.step2.scenarioBanner.description', { count: scenariosCreatedCount })}
          </Text>
          <Box display="flex" justifyContent="flex-start">
            <Button appearance="neutral" onClick={handleGoToHumanSupport}>
              {t('settings.step2.scenarioBanner.goToHumanSupport')}
            </Button>
          </Box>
        </Box>
      </Alert>
    </Box>
  );
};

export default HumanHelpReviewBanner;
