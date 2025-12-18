import React, { useMemo, useState } from 'react';
import { Alert, Text } from '@nimbus-ds/components';
import { Trans, useTranslation } from 'react-i18next';
import { HealthStatusResponse } from '@/types/instancesDTO';

interface WhatsAppChannel {
  id: number;
  name: string;
  whatsapp_status: string;
}

interface HealthStatusAlertProps {
  healthStatusResults: Array<HealthStatusResponse | null>;
  whatsappBusinessChannels: WhatsAppChannel[];
}

const HealthStatusAlert: React.FC<HealthStatusAlertProps> = ({ 
  healthStatusResults, 
  whatsappBusinessChannels 
}) => {
  const { t } = useTranslation('translations');
  const [isVisible, setIsVisible] = useState(true);
  const PERCENTAGE_FAILURE_RATE = 100;

  const showAlert = useMemo(() => {
    let failedChannelId: string | null = null;
    const has100PercentFailureRate = healthStatusResults.some((response, index) => {
      if (!response) return false;
      const failureRate = response.failure_rate?.last_10_messages?.failure_rate || 0;
      if (failureRate === PERCENTAGE_FAILURE_RATE) {
        failedChannelId = whatsappBusinessChannels[index]?.id?.toString();
        return true;
      }
      return false;
    });

    if (has100PercentFailureRate && failedChannelId) {
      localStorage.setItem('failedChannelId', failedChannelId);
    } else {
      localStorage.removeItem('failedChannelId');
    }

    return has100PercentFailureRate;
  }, [healthStatusResults, whatsappBusinessChannels]);

  const handleRemove = () => {
    setIsVisible(false);
  };

  const renderAlertContent = () => {
    return (
      <Text>
        <Trans
          i18nKey="instances.health-status-alert-description"
          components={{
            Meta: <a
              href="https://business.facebook.com/business-support-home"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', fontWeight: 'bold' }}
            />
          }}
        />
      </Text>
    );
  };


  
  if (!showAlert || !isVisible) {
    return null;
  }
  return (
    <Alert
      appearance="danger"
      show={true}
      title={t('instances.health-status-alert-title')}
      onRemove={handleRemove}
    >
      {renderAlertContent()}
    </Alert>
  );
};

export default HealthStatusAlert;