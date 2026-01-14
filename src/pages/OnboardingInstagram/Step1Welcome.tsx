import React from 'react';
import { Box, Button, Icon, Link, Text, Title } from '@nimbus-ds/components';
import { CheckCircleIcon, ChevronRightIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { ChannelIcon } from '@/components';

export interface Step1WelcomeProps {
  onContinue: () => void;
  onCancel: () => void;
}

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({ onContinue, onCancel }) => {
  const { t } = useTranslation('translations');

  const features = [
    t('instagramOnboarding.step1.feature1', 'Recibí mensajes directos de Instagram'),
    t('instagramOnboarding.step1.feature2', 'Respondé automáticamente con tu AI Agent'),
    t('instagramOnboarding.step1.feature3', 'Gestioná todo desde un solo lugar'),
  ];

  const requirements = [
    t('instagramOnboarding.step1.req1', 'Cuenta de Instagram Business o Creator'),
    t('instagramOnboarding.step1.req2', 'Cuenta vinculada a una Página de Facebook'),
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Instagram branded header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100px"
        height="100px"
        borderRadius="base"
        style={{
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          boxShadow: '0 8px 24px rgba(225, 48, 108, 0.3)',
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
          <ChannelIcon channel="instagram" size="large" />
        </Box>
      </Box>

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h2" textAlign="center">
          {t('instagramOnboarding.step1.title', 'Conectá tu cuenta de Instagram')}
        </Title>
        <Text color="neutral-textLow" textAlign="center" fontSize="base">
          {t(
            'instagramOnboarding.step1.description',
            'Atendé a tus clientes de Instagram directamente desde Chat Nube, con el mismo agente de IA que ya tenés configurado.'
          )}
        </Text>
      </Box>

      {/* Features */}
      <Box 
        display="flex" 
        flexDirection="column" 
        gap="3" 
        width="100%" 
        maxWidth="420px"
        padding="4"
        backgroundColor="success-surface"
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
              backgroundColor="success-surfaceHighlight"
            >
              <Icon source={<CheckCircleIcon size={16} />} color="success-interactive" />
            </Box>
            <Text color="success-textHigh" fontWeight="medium">{feature}</Text>
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
          {t('instagramOnboarding.step1.requirements', 'Requisitos:')}
        </Text>
        <Box display="flex" flexDirection="column" gap="2">
          {requirements.map((req, index) => (
            <Box key={index} display="flex" alignItems="center" gap="2">
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                style={{ background: 'linear-gradient(45deg, #e6683c, #cc2366)' }}
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
            <ChannelIcon channel="instagram" size="small" />
            <Text color="currentColor">{t('instagramOnboarding.step1.cta', 'Conectar Instagram')}</Text>
            <Icon source={<ChevronRightIcon />} color="currentColor" />
          </Box>
        </Button>
        <Box display="flex" justifyContent="center">
          <Link as="button" appearance="neutral" onClick={onCancel}>
            {t('common.cancel', 'Cancelar')}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Step1Welcome;
