import React from 'react';
import { Alert, Box, Button, Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';

interface HumanHelpReviewBannerProps {
  itemsToReviewCount: number;
  showLibraryButton?: boolean;
}

const HumanHelpReviewBanner: React.FC<HumanHelpReviewBannerProps> = ({ itemsToReviewCount, showLibraryButton = false }) => {
  const { t } = useTranslation('translations');

  if (itemsToReviewCount === 0) {
    return null;
  }

  const handleGoToLibrary = () => {
    window.location.href = '/admin/chat#/configurations/1';
  };

  return (
    <Box marginBottom="4">
      <Alert 
        appearance="warning"
        title={t('settings.step2.reviewBanner.title')}
      >
        <Box display="flex" flexDirection="column" gap="3">
          <Text>
            {showLibraryButton 
              ? t('settings.step2.reviewBanner.descriptionWithLink', { count: itemsToReviewCount })
              : t('settings.step2.reviewBanner.description', { count: itemsToReviewCount })
            }
          </Text>
          {showLibraryButton && (
            <Box display="flex" justifyContent="flex-start">
              <Button appearance="neutral" onClick={handleGoToLibrary}>
                {t('settings.step2.reviewBanner.goToLibrary')}
              </Button>
            </Box>
          )}
        </Box>
      </Alert>
    </Box>
  );
};

export default HumanHelpReviewBanner;
