import React from 'react';
import { Box, Button, Icon, Link, Text, Title } from '@nimbus-ds/components';
import { CheckCircleIcon, ChevronRightIcon, LightbulbIcon } from '@nimbus-ds/icons';
import { ChannelIcon } from '@/components';

export interface Step3SuccessProps {
  phoneNumber: string;
  onGoToConversations: () => void;
  onGoToChannels: () => void;
}

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
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        position="absolute"
        style={{
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          borderRadius: i % 2 === 0 ? '50%' : '2px',
          background: [
            '#00D95F', '#00B84D', '#25D366', '#128C7E',
            '#10b981', '#3b82f6', '#059669', '#00A884'
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

export const Step3Success: React.FC<Step3SuccessProps> = ({
  phoneNumber,
  onGoToConversations,
  onGoToChannels,
}) => {
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
      <ConfettiDecoration />

      {/* Success icon */}
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

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h2" textAlign="center">
          WhatsApp Business conectado!
        </Title>
      </Box>

      {/* Connected number badge */}
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="4"
        borderRadius="base"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 217, 95, 0.1) 0%, rgba(0, 184, 77, 0.1) 100%)',
          border: '1px solid rgba(0, 217, 95, 0.2)',
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
            background: 'linear-gradient(135deg, #00D95F 0%, #00B84D 100%)',
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
            <ChannelIcon channel="whatsapp" size="medium" />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="0-5">
          <Text fontWeight="bold" fontSize="highlight">{phoneNumber || '+55 11 99999-9999'}</Text>
          <Text fontSize="caption" color="success-textHigh">
            Conectado via WhatsApp Login
          </Text>
        </Box>
      </Box>

      {/* Description */}
      <Box maxWidth="400px">
        <Text color="neutral-textLow" textAlign="center">
          Seu número do WhatsApp Business já está pronto para receber e responder mensagens pelo Nuvem Chat.
        </Text>
      </Box>

      {/* Sync info */}
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="4"
        backgroundColor="primary-surface"
        borderRadius="base"
        maxWidth="420px"
        width="100%"
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
          <Text fontSize="highlight">🔄</Text>
        </Box>
        <Text fontSize="base" color="primary-textHigh">
          O histórico de conversas e contatos está sendo sincronizado. Pode demorar alguns minutos.
        </Text>
      </Box>

      {/* AI Agent info */}
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="4"
        backgroundColor="primary-surface"
        borderRadius="base"
        maxWidth="420px"
        width="100%"
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
          O AI Agent que você configurou responderá automaticamente as mensagens do WhatsApp.
        </Text>
      </Box>

      {/* Tip */}
      <Box
        display="flex"
        alignItems="flex-start"
        gap="3"
        padding="4"
        backgroundColor="warning-surface"
        borderRadius="base"
        maxWidth="420px"
        width="100%"
      >
        <Icon source={<LightbulbIcon size={20} />} color="warning-interactive" />
        <Text fontSize="caption" color="warning-textHigh">
          Dica: Você pode continuar usando o WhatsApp Business normalmente no celular. As mensagens serão sincronizadas automaticamente.
        </Text>
      </Box>

      {/* Actions */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="420px">
        <Button appearance="primary" onClick={onGoToConversations}>
          <Box display="flex" alignItems="center" gap="2">
            <Text color="currentColor">Ir para Conversas</Text>
            <Icon source={<ChevronRightIcon />} color="currentColor" />
          </Box>
        </Button>
        <Box display="flex" justifyContent="center">
          <Link as="button" appearance="neutral" onClick={onGoToChannels}>
            Ver configuração de canais
          </Link>
        </Box>
      </Box>

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

export default Step3Success;
