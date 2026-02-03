import React from 'react';
import { Box, Button, Card, Icon, IconButton, Tag, Text, Title } from '@nimbus-ds/components';
import { CheckCircleIcon, MoreIcon } from '@nimbus-ds/icons';
import { ChannelIcon } from '@/components';

export type ChannelType = 'whatsapp' | 'instagram' | 'facebook';
export type ChannelStatus = 'connected' | 'disconnected';

export interface ChannelCardProps {
  channel: ChannelType;
  status: ChannelStatus;
  identifier?: string;
  isNew?: boolean;
  quickConnect?: boolean;
  onConnect?: () => void;
  onConfigure?: () => void;
  onMore?: () => void;
}

const CHANNEL_NAMES: Record<ChannelType, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Messenger',
};

const CHANNEL_GRADIENTS: Record<ChannelType, string> = {
  whatsapp: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  instagram: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  facebook: 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)',
};

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  status,
  identifier,
  isNew = false,
  quickConnect = false,
  onConnect,
  onConfigure,
  onMore,
}) => {
  const isConnected = status === 'connected';

  return (
    <Card 
      padding="base"
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isConnected ? '#00AB6B' : 'transparent',
        position: 'relative',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* New badge - moved outside for proper positioning */}
      {isNew && !isConnected && (
        <Tag appearance="primary">Nuevo</Tag>
      )}
      <Box 
        display="flex" 
        flexDirection="column" 
        gap="4"
        alignItems="center"
        justifyContent="flex-end"
        style={{ width: 'fit-content' }}
      >
        {/* Channel Icon - tamanho aumentado para melhor reconhecimento */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="80px"
          borderRadius="full"
          style={{
            background: CHANNEL_GRADIENTS[channel],
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
            height: '100%',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="64px"
            height="64px"
            borderRadius="full"
            backgroundColor="neutral-background"
          >
            <ChannelIcon channel={channel} size="large" />
          </Box>
        </Box>

        {/* Channel Name - hierarquia visual melhorada */}
        <Title as="h4" textAlign="center">
          {CHANNEL_NAMES[channel]}
        </Title>

        {/* Connected State */}
        {isConnected ? (
          <Box display="flex" flexDirection="column" gap="2" alignItems="center" width="100%">
            {/* Status Badge - usando ícone apropriado */}
            <Box
              display="flex"
              alignItems="center"
              gap="1"
              paddingTop="1"
              paddingBottom="1"
              paddingLeft="2"
              paddingRight="2"
              backgroundColor="success-surface"
              borderRadius="full"
            >
              <Text color="success-textHigh" fontSize="caption" fontWeight="medium">
                Conectado
              </Text>
            </Box>

            {/* Account Identifier */}
            {identifier && (
              <Text fontSize="caption" color="neutral-textLow" textAlign="center">
                {identifier}
              </Text>
            )}

            {/* Quick Connect Notice */}
            {quickConnect && (
              <Box display="flex" alignItems="center" gap="1">
                <Icon source={<CheckCircleIcon size={12} />} color="success-interactive" />
                <Text fontSize="caption" color="success-textHigh">
                  Conexión rápida
                </Text>
              </Box>
            )}

            {/* Action Buttons - espaçamento consistente */}
            <Box display="flex" gap="2" width="100%" flexDirection="column" paddingTop="1">
              {onConfigure && (
                <Button 
                  appearance="default" 
                  size="small"
                  onClick={onConfigure}
                >
                  Configurar
                </Button>
              )}
              {onMore && (
                <Box display="flex" justifyContent="center">
                  <IconButton 
                    appearance="transparent"
                    size="small"
                    onClick={onMore}
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          /* Disconnected State - botão com padding consistente */
          <Box paddingTop="1" width="100%" display="flex" justifyContent="center" alignItems="center">
            <Button
              appearance="primary"
              size="medium"
              onClick={onConnect}
            >
              Conectar
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ChannelCard;
