import React from 'react';
import { Box, Button, Card, Icon, Link, Text, Title } from '@nimbus-ds/components';
import { UserIcon, AppsIcon, LockIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { ExpandableSection } from '@/components';

export interface WhatsAppPreOnboardingProps {
  onContinue: () => void;
  onCancel: () => void;
}

export const WhatsAppPreOnboarding: React.FC<WhatsAppPreOnboardingProps> = ({ 
  onContinue, 
  onCancel 
}) => {
  const { t } = useTranslation('translations');

  // 3 essential cards - usando ícones Nimbus disponíveis
  const essentialItems = [
    {
      icon: <Icon source={<UserIcon size={24} />} color="success-interactive" />,
      title: t('whatsappPreOnboarding.essential-1-title', 'Admin Meta'),
      description: t('whatsappPreOnboarding.essential-1-desc', 'Permiso de administrador'),
    },
    {
      icon: <Icon source={<AppsIcon size={24} />} color="success-interactive" />,
      title: t('whatsappPreOnboarding.essential-2-title', 'WhatsApp Business'),
      description: t('whatsappPreOnboarding.essential-2-desc', 'App instalado'),
    },
    {
      icon: <Icon source={<LockIcon size={24} />} color="success-interactive" />,
      title: t('whatsappPreOnboarding.essential-3-title', '2FA Desactivado'),
      description: t('whatsappPreOnboarding.essential-3-desc', 'Temporariamente'),
    },
  ];

  // Complete checklist (all 7 items for those who want details)
  const completeChecklistItems = [
    t('whatsappPreOnboarding.checklist-1', 'Use um computador para fazer este processo'),
    t('whatsappPreOnboarding.checklist-2', 'Tenha o WhatsApp Business App instalado no seu celular'),
    t('whatsappPreOnboarding.checklist-3', 'Desative temporariamente a verificação em 2 passos no WhatsApp'),
    t('whatsappPreOnboarding.checklist-4', 'Verifique se há espaço disponível em "Dispositivos Conectados" no WhatsApp'),
    t('whatsappPreOnboarding.checklist-5', 'Tenha acesso de administrador ao Meta Business Portfolio da sua empresa'),
    t('whatsappPreOnboarding.checklist-6', 'Desconecte seu número de outros provedores de API (se aplicável)'),
    t('whatsappPreOnboarding.checklist-7', 'Selecione o portfólio correto durante o processo da Meta'),
  ];

  const helpLink = t('whatsappPreOnboarding.help-link', 'https://atendimento.nuvemshop.com.br/pt_BR/nuvem-chat');

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      gap="6" 
      padding="6" 
      maxWidth="680px" 
      margin="0 auto"
    >
      {/* Hero Visual - ícone WhatsApp maior e mais impactante */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="4">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="96px"
          height="96px"
          borderRadius="full"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
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
            <img 
              src="/imgs/whatsapp-icon.svg" 
              alt="WhatsApp" 
              style={{ width: '48px', height: '48px' }} 
            />
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" gap="1">
          <Title as="h2" textAlign="center">
            {t('whatsappPreOnboarding.hero-title', 'Conectar WhatsApp Business')}
          </Title>
          <Text color="neutral-textLow" textAlign="center" fontSize="base">
            {t('whatsappPreOnboarding.hero-subtitle', '3 minutos para comenzar')}
          </Text>
        </Box>
      </Box>

      {/* 3 Essential Cards - tamanhos seguindo escala de 8 */}
      <Box 
        display="grid" 
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
        gap="4" 
        width="100%"
      >
        {essentialItems.map((item, index) => (
          <Card key={index} padding="base">
            <Box display="flex" flexDirection="column" alignItems="center" gap="3" textAlign="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="48px"
                height="48px"
                borderRadius="base"
                backgroundColor="success-surface"
              >
                {item.icon}
              </Box>
              <Box display="flex" flexDirection="column" gap="1">
                <Text fontWeight="bold" fontSize="base">
                  {item.title}
                </Text>
                <Text fontSize="caption" color="neutral-textLow">
                  {item.description}
                </Text>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Expandable Complete Checklist */}
      <ExpandableSection 
        title={t('whatsappPreOnboarding.complete-checklist-toggle', 'Ver checklist completo')}
      >
        <Box display="flex" flexDirection="column" gap="3">
          {completeChecklistItems.map((item, index) => (
            <Box key={index} display="flex" alignItems="flex-start" gap="3">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minWidth="24px"
                height="24px"
                borderRadius="full"
                backgroundColor="primary-surface"
                flexShrink="0"
              >
                <Text fontSize="caption" fontWeight="bold" color="primary-interactive">
                  {index + 1}
                </Text>
              </Box>
              <Text fontSize="base" color="neutral-textLow">
                {item}
              </Text>
            </Box>
          ))}
        </Box>
      </ExpandableSection>

      {/* Primary CTA - largura consistente */}
      <Box display="flex" flexDirection="column" gap="2" width="100%" maxWidth="400px" alignItems="center">
        <Button 
          appearance="primary" 
          onClick={onContinue}
        >
          {t('whatsappPreOnboarding.cta-continue', 'Iniciar conexión')}
        </Button>
      </Box>

      {/* Secondary Actions */}
      <Box display="flex" flexDirection="column" gap="3" alignItems="center">
        <Link 
          as="a" 
          href={helpLink}
          target="_blank"
          appearance="primary"
        >
          <Text fontSize="caption" color="currentColor">
            {t('whatsappPreOnboarding.help-link-text', '¿Necesitas ayuda?')}
          </Text>
        </Link>
        
        <Link as="button" appearance="neutral" onClick={onCancel}>
          <Text fontSize="caption">
            {t('common.back', 'Volver')}
          </Text>
        </Link>
      </Box>
    </Box>
  );
};

export default WhatsAppPreOnboarding;
