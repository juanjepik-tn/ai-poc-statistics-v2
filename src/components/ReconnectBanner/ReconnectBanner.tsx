import React from 'react';
import { Alert, Box, Button, Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { ChannelType } from '@/types/conversation';
import { ChannelIcon } from '../ChannelIcon';

export interface ReconnectBannerProps {
  channel: ChannelType;
  onReconnect: () => void;
  onDismiss?: () => void;
}

export const ReconnectBanner: React.FC<ReconnectBannerProps> = ({
  channel,
  onReconnect,
  onDismiss,
}) => {
  const { t } = useTranslation('translations');
  const channelName = channel === 'whatsapp' ? 'WhatsApp' : 'Instagram';

  return (
    <Alert appearance="warning" title="">
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="4">
        <Box display="flex" alignItems="center" gap="2" flexGrow="1">
          <ChannelIcon channel={channel} size="medium" />
          <Text>
            {t('reconnectBanner.message', {
              channel: channelName,
              defaultValue: `Tu cuenta de ${channelName} necesita reconectarse para seguir recibiendo mensajes.`,
            })}
          </Text>
        </Box>
        <Box display="flex" gap="2" flexShrink="0">
          <Button appearance="primary" onClick={onReconnect}>
            {t('reconnectBanner.reconnect', 'Reconectar ahora')}
          </Button>
          {onDismiss && (
            <Button appearance="neutral" onClick={onDismiss}>
              {t('reconnectBanner.later', 'Después')}
            </Button>
          )}
        </Box>
      </Box>
    </Alert>
  );
};

export default ReconnectBanner;




