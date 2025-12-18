import React, { useState, useMemo, useEffect } from 'react';
import { Alert, Text, Box, Button, Link } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { HealthStatusResponse } from '@/types/instancesDTO';
import { useRegisterLog } from '@/hooks';
import { trackingBusinessVerificationClick } from '@/tracking';

const META_VERIFICATION_BASE_URL = 'https://business.facebook.com/latest/settings/security_center';
const META_LEARN_MORE_URL = 'https://www.facebook.com/business/help/2058515294227817?id=180505742745347';
const DISMISS_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
const DISMISS_STORAGE_KEY = 'businessVerificationAlertDismissedAt';

interface BusinessVerificationAlertProps {
  healthStatusResults: Array<HealthStatusResponse | null>;
}

const BusinessVerificationAlert: React.FC<BusinessVerificationAlertProps> = ({ 
  healthStatusResults 
}) => {
  const { t } = useTranslation('translations');
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const registerLog = useRegisterLog();

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (dismissedAt) {
      const dismissedTimestamp = parseInt(dismissedAt, 10);
      const now = Date.now();
      const timeSinceDismiss = now - dismissedTimestamp;
      
      if (timeSinceDismiss < DISMISS_DURATION_MS) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(DISMISS_STORAGE_KEY);
      }
    }
  }, []);

  // Find unverified business
  const verificationInfo = useMemo(() => {
    for (const response of healthStatusResults) {
      if (!response) continue;
      
      const verificationStatus = response.business_verification?.business_verification_status;
      const businessId = response.business_verification?.business_id || null;
      const wabaId = response.business_verification?.waba_id || null;

      if (verificationStatus && verificationStatus !== 'verified') {
        return {
          isUnverified: true,
          businessId: businessId,
          wabaId: wabaId
        };
      }
    }
    return { isUnverified: false, businessId: null, wabaId: null };
  }, [healthStatusResults]);

  const verificationUrl = useMemo(() => {
    if (verificationInfo.businessId) {
      return `${META_VERIFICATION_BASE_URL}?business_id=${verificationInfo.businessId}`;
    }
    return META_VERIFICATION_BASE_URL;
  }, [verificationInfo.businessId]);

  const handleRemove = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
    
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleVerificationClick = () => {
    try {
      trackingBusinessVerificationClick(verificationInfo.businessId, verificationInfo.wabaId);
      registerLog({
        data: { business_id: verificationInfo.businessId, waba_id: verificationInfo.wabaId },
          message: "BUSINESS_VERIFICATION_CLICK",
          level: "info",
      });
    } catch (error) {
      // avoid blocking the user
    }
  };

  if (!verificationInfo.isUnverified) {
    return null;
  }

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Alert
      appearance="warning"
      show={true}
      title={t('instances.business-verification-alert-title')}
      onRemove={handleRemove}
    >
      <Text>
        {t('instances.business-verification-alert-description')}
      </Text>
      <Box display="flex" gap="2" mt="2" alignItems="center">
        <Button
          as="a"
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleVerificationClick}
        >
          {t('instances.business-verification-alert-action')}
        </Button>
        <Link
          appearance="neutral"
          as="a"
          href={META_LEARN_MORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('instances.business-verification-alert-learn-more')}
        </Link>
      </Box>
    </Alert>
  );
};

export default BusinessVerificationAlert;

