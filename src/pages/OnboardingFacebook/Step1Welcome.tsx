import React from 'react';
import { Box, Button, Icon, Link, Text, Title, Tag } from '@nimbus-ds/components';
import { CheckCircleIcon, ChevronRightIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { ChannelIcon } from '@/components';

export interface Step1WelcomeProps {
  onContinue: () => void;
  onCancel: () => void;
  hasInstagramConnected: boolean;
}

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({ 
  onContinue, 
  onCancel, 
  hasInstagramConnected 
}) => {
  const { t } = useTranslation('translations');

  const features = [
    'Recibí mensajes de tu página de Facebook',
    'Respondé automáticamente con tu AI Agent',
    'Gestioná todo desde un solo lugar',
  ];

  const requirements = [
    'Tener una Página de Facebook activa',
    'Ser administrador de la página',
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Facebook branded header with "Nuevo" tag */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Box position="relative">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100px"
            height="100px"
            borderRadius="base"
            style={{
              background: 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)',
              boxShadow: '0 8px 24px rgba(24, 119, 242, 0.3)',
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="80px"
              height="80px"
              borderRadius="base"
              backgroundColor="neutral-background"
            >
              <ChannelIcon channel="facebook" size="large" />
            </Box>
          </Box>
          <Box position="absolute" style={{ top: '-8px', right: '-24px' }}>
            <Tag appearance="primary">Nuevo</Tag>
          </Box>
        </Box>
      </Box>

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h2" textAlign="center">
          Conectá Facebook Messenger
        </Title>
        <Text color="neutral-textLow" textAlign="center" fontSize="base">
          Atendé a tus clientes de Facebook directamente desde Chat Nube, con el mismo agente de IA que ya tenés configurado.
        </Text>
      </Box>

      {/* Instagram connected notice */}
      {hasInstagramConnected && (
        <Box
          display="flex"
          alignItems="center"
          gap="3"
          padding="3"
          borderRadius="base"
          width="100%"
          maxWidth="420px"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <Icon source={<CheckCircleIcon size={20} />} color="success-interactive" />
          <Box display="flex" flexDirection="column" gap="0-5">
            <Text fontWeight="bold" fontSize="caption" color="success-textHigh">
              ¡Conexión simplificada!
            </Text>
            <Text fontSize="caption" color="success-textLow">
              Ya tenés Instagram conectado, así que solo necesitás seleccionar la página.
            </Text>
          </Box>
        </Box>
      )}

      {/* Features */}
      <Box 
        display="flex" 
        flexDirection="column" 
        gap="3" 
        width="100%" 
        maxWidth="420px"
        padding="4"
        backgroundColor="primary-surface"
        borderRadius="base"
      >
        {features.map((feature, index) => (
          <Box key={index} display="flex" alignItems="center" gap="3">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minWidth="24px"
              height="24px"
              borderRadius="full"
              backgroundColor="primary-surfaceHighlight"
            >
              <Icon source={<CheckCircleIcon size={16} />} color="primary-interactive" />
            </Box>
            <Text color="primary-textHigh" fontWeight="medium">{feature}</Text>
          </Box>
        ))}
      </Box>

      {/* Requirements */}
      <Box
        display="flex"
        flexDirection="column"
        gap="3"
        width="100%"
        maxWidth="420px"
        padding="4"
        backgroundColor="neutral-surface"
        borderRadius="base"
        style={{ border: '1px solid var(--color-neutral-surfaceHighlight)' }}
      >
        <Text fontWeight="bold" fontSize="base">
          Requisitos:
        </Text>
        <Box display="flex" flexDirection="column" gap="2">
          {requirements.map((req, index) => (
            <Box key={index} display="flex" alignItems="center" gap="2">
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                style={{ background: '#1877F2' }}
              />
              <Text fontSize="base" color="neutral-textLow">
                {req}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Actions */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="420px">
        <Button 
          appearance="primary" 
          onClick={onContinue}
        >
          <Box display="flex" alignItems="center" gap="2">
            <ChannelIcon channel="facebook" size="small" />
            <Text color="currentColor">Conectar Facebook Messenger</Text>
            <Icon source={<ChevronRightIcon />} color="currentColor" />
          </Box>
        </Button>
        <Box display="flex" justifyContent="center">
          <Link as="button" appearance="neutral" onClick={onCancel}>
            Cancelar
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Step1Welcome;

