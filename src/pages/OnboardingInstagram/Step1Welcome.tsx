import React from 'react';
import { Box, Button, Icon, Link, Text, Title, Tag } from '@nimbus-ds/components';
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
    t('instagramOnboarding.step1.feature1', 'Receba mensagens diretas do Instagram'),
    t('instagramOnboarding.step1.feature2', 'Responda automaticamente com seu AI Agent'),
    t('instagramOnboarding.step1.feature3', 'Gerencie tudo em um só lugar'),
  ];

  const requirements = [
    t('instagramOnboarding.step1.req1', 'Conta de Instagram Business ou Creator'),
    t('instagramOnboarding.step1.req2', 'Conta vinculada a uma Página do Facebook'),
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Instagram branded header com badge "Nuevo" */}
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
              borderRadius="full"
              backgroundColor="neutral-background"
            >
              <ChannelIcon channel="instagram" size="large" />
            </Box>
          </Box>
          <Box position="absolute" style={{ top: '-8px', right: '-24px' }}>
            <Tag appearance="primary">Novo</Tag>
          </Box>
        </Box>
      </Box>

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="1">
        <Title as="h2" textAlign="center">
          {t('instagramOnboarding.step1.title', 'Conecte sua conta do Instagram')}
        </Title>
        <Text color="neutral-textLow" textAlign="center" fontSize="base">
          {t(
            'instagramOnboarding.step1.description',
            'Atenda seus clientes do Instagram diretamente pelo Nuvem Chat, com o mesmo agente de IA que você já tem configurado.'
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
                width="8px"
                height="8px"
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
