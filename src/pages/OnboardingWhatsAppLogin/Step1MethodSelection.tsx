import React from 'react';
import { Box, Icon, Link, Tag, Text, Title } from '@nimbus-ds/components';
import { CheckCircleIcon, ChevronRightIcon, StarIcon } from '@nimbus-ds/icons';
import { ChannelIcon } from '@/components';

export interface Step1MethodSelectionProps {
  onSelectWhatsAppLogin: () => void;
  onSelectEmbeddedSignup: () => void;
  onCancel: () => void;
}

export const Step1MethodSelection: React.FC<Step1MethodSelectionProps> = ({
  onSelectWhatsAppLogin,
  onSelectEmbeddedSignup,
  onCancel,
}) => {
  const whatsappLoginFeatures = [
    'Sem necessidade de conta do Facebook',
    'Verificação direta pelo app WhatsApp Business',
    'Processo mais rápido e simples',
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Header */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Box position="relative">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="96px"
            height="96px"
            borderRadius="full"
            style={{
              background: 'linear-gradient(135deg, #00D95F 0%, #00B84D 100%)',
              boxShadow: '0 8px 24px rgba(0, 217, 95, 0.3)',
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
              <ChannelIcon channel="whatsapp" size="large" />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap="1">
        <Title as="h2" textAlign="center">
          Conecte o WhatsApp Business
        </Title>
        <Text color="neutral-textLow" textAlign="center" fontSize="base">
          Escolha como você quer conectar seu número de WhatsApp Business ao Nuvem Chat.
        </Text>
      </Box>

      {/* Option A: WhatsApp Login (recommended) */}
      <Box
        as="button"
        width="100%"
        maxWidth="480px"
        padding="none"
        borderRadius="base"
        style={{
          background: 'none',
          border: '2px solid #00D95F',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          overflow: 'visible',
        }}
        onClick={onSelectWhatsAppLogin}
      >
        <Box
          position="absolute"
          display="flex"
          gap="2"
          style={{ top: '-12px', left: '16px', zIndex: 1 }}
        >
          <Tag appearance="success">Novo</Tag>
          <Tag appearance="primary">
            <Box display="flex" alignItems="center" gap="1">
              <Icon source={<StarIcon size={12} />} color="currentColor" />
              <Text fontSize="caption" color="currentColor" fontWeight="bold">Recomendado</Text>
            </Box>
          </Tag>
        </Box>

        <Box display="flex" flexDirection="column" gap="4" padding="5">
          <Box display="flex" alignItems="center" gap="3">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="48px"
              height="48px"
              borderRadius="full"
              style={{ background: 'linear-gradient(135deg, #00D95F 0%, #00B84D 100%)' }}
              flexShrink="0"
            >
              <ChannelIcon channel="whatsapp" size="small" />
            </Box>
            <Box display="flex" flexDirection="column" gap="0-5">
              <Text fontWeight="bold" fontSize="highlight">
                Conectar com WhatsApp Login
              </Text>
              <Text fontSize="caption" color="neutral-textLow">
                Autenticação direta pela app WhatsApp Business
              </Text>
            </Box>
            <Box marginLeft="auto" flexShrink="0">
              <Icon source={<ChevronRightIcon />} color="primary-interactive" />
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap="2">
            {whatsappLoginFeatures.map((feature, index) => (
              <Box key={index} display="flex" alignItems="center" gap="2">
                <Icon source={<CheckCircleIcon size={16} />} color="success-interactive" />
                <Text fontSize="caption" color="neutral-textLow">{feature}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Option B: Facebook Embedded Signup (existing) */}
      <Box
        as="button"
        width="100%"
        maxWidth="480px"
        padding="none"
        borderRadius="base"
        style={{
          background: 'none',
          border: '1px solid var(--color-neutral-surfaceHighlight)',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        onClick={onSelectEmbeddedSignup}
      >
        <Box display="flex" alignItems="center" gap="3" padding="4">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="48px"
            height="48px"
            borderRadius="full"
            style={{ background: '#1877F2' }}
            flexShrink="0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </Box>
          <Box display="flex" flexDirection="column" gap="0-5">
            <Text fontWeight="bold" fontSize="base">
              Conectar com Facebook
            </Text>
            <Text fontSize="caption" color="neutral-textLow">
              Embedded Signup via conta do Facebook
            </Text>
          </Box>
          <Box marginLeft="auto" flexShrink="0">
            <Icon source={<ChevronRightIcon />} color="neutral-textLow" />
          </Box>
        </Box>
      </Box>

      {/* Cancel */}
      <Box display="flex" justifyContent="center">
        <Link as="button" appearance="neutral" onClick={onCancel}>
          Cancelar
        </Link>
      </Box>
    </Box>
  );
};

export default Step1MethodSelection;
