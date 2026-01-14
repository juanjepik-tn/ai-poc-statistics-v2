import React from 'react';
import { Box, Button, Icon, Link, Text, Title } from '@nimbus-ds/components';
import { CheckCircleIcon, LightbulbIcon, ChevronRightIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { ChannelIcon } from '@/components';

export interface Step4ConfirmationProps {
  username: string;
  onGoToConversations: () => void;
  onGoToChannels: () => void;
}

// Confetti-like decoration
const ConfettiDecoration: React.FC = () => (
  <Box
    position="absolute"
    width="100%"
    height="200px"
    style={{
      top: 0,
      left: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    {/* Decorative elements */}
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        position="absolute"
        style={{
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          borderRadius: i % 2 === 0 ? '50%' : '2px',
          background: [
            '#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888',
            '#10b981', '#3b82f6', '#8b5cf6'
          ][i % 8],
          top: `${20 + Math.random() * 60}%`,
          left: `${5 + (i * 12)}%`,
          opacity: 0.6,
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `float ${2 + Math.random()}s ease-in-out infinite`,
        }}
      />
    ))}
  </Box>
);

export const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({
  username,
  onGoToConversations,
  onGoToChannels,
}) => {
  const { t } = useTranslation('translations');

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      gap="6" 
      padding="6"
      position="relative"
      style={{ overflow: 'hidden' }}
    >
      {/* Celebration decoration */}
      <ConfettiDecoration />

      {/* Success icon with Instagram gradient */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100px"
        height="100px"
        borderRadius="full"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="80px"
          height="80px"
          borderRadius="full"
          backgroundColor="neutral-background"
        >
          <Icon source={<CheckCircleIcon size={48} />} color="success-interactive" />
        </Box>
      </Box>

      {/* Title with emoji */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h2" textAlign="center">
          🎉 {t('instagramOnboarding.step4.title', '¡Instagram conectado!')}
        </Title>
      </Box>

      {/* Connected account badge */}
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="4"
        borderRadius="base"
        style={{
          background: 'linear-gradient(135deg, rgba(240, 148, 51, 0.1) 0%, rgba(188, 24, 136, 0.1) 100%)',
          border: '1px solid rgba(225, 48, 108, 0.2)',
        }}
      >
        <Box
          width="48px"
          height="48px"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            padding: '2px',
          }}
        >
          <Box
            width="44px"
            height="44px"
            borderRadius="full"
            backgroundColor="neutral-background"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ChannelIcon channel="instagram" size="medium" />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="0-5">
          <Text fontWeight="bold" fontSize="highlight">{username}</Text>
          <Text fontSize="caption" color="success-textHigh">
            ✓ Conectado y listo
          </Text>
        </Box>
      </Box>

      {/* Description */}
      <Text color="neutral-textLow" textAlign="center" maxWidth="400px">
        {t('instagramOnboarding.step4.description', {
          username,
          defaultValue: `Tu cuenta ya está lista para recibir mensajes.`,
        })}
      </Text>

      {/* Info about AI Agent */}
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="4"
        backgroundColor="primary-surface"
        borderRadius="base"
        maxWidth="420px"
      >
        <Box
          width="40px"
          height="40px"
          borderRadius="full"
          backgroundColor="primary-surfaceHighlight"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
        >
          <Text fontSize="highlight">🤖</Text>
        </Box>
        <Text fontSize="base" color="primary-textHigh">
          {t(
            'instagramOnboarding.step4.info',
            'El AI Agent que configuraste para WhatsApp también responderá tus mensajes de Instagram.'
          )}
        </Text>
      </Box>

      {/* Tip card */}
      <Box
        display="flex"
        alignItems="flex-start"
        gap="3"
        padding="4"
        backgroundColor="warning-surface"
        borderRadius="base"
        maxWidth="420px"
      >
        <Icon source={<LightbulbIcon size={20} />} color="warning-interactive" />
        <Text fontSize="caption" color="warning-textHigh">
          {t(
            'instagramOnboarding.step4.tip',
            'Tip: Podés ver de qué canal viene cada mensaje en la lista de conversaciones.'
          )}
        </Text>
      </Box>

      {/* Actions */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="420px">
        <Button appearance="primary" onClick={onGoToConversations}>
          <Box display="flex" alignItems="center" gap="2">
            <Text color="currentColor">{t('instagramOnboarding.step4.cta', 'Ir a Conversaciones')}</Text>
            <Icon source={<ChevronRightIcon />} color="currentColor" />
          </Box>
        </Button>
        <Box display="flex" justifyContent="center">
          <Link as="button" appearance="neutral" onClick={onGoToChannels}>
            {t('instagramOnboarding.step4.secondary', 'Ver configuración de canales')}
          </Link>
        </Box>
      </Box>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </Box>
  );
};

export default Step4Confirmation;
