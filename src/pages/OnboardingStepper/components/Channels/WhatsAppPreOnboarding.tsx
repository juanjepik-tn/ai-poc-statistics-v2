import React, { useState, useCallback } from 'react';
import { Box, Button, Checkbox, Icon, Link, Text, Title } from '@nimbus-ds/components';
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';

export interface WhatsAppPreOnboardingProps {
  onContinue: () => void;
  onCancel: () => void;
}

/* ─── Step data shape ─── */
interface StepData {
  illustration: string;
  illustrationMaxWidth?: string;
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
  /** Optional secondary lines (block 7 bullets) */
  extraDescKeys?: Array<{ key: string; fallback: string }>;
  /** External link */
  link?: { hrefKey: string; hrefFallback: string; labelKey: string; labelFallback: string };
  /** Distinct background for warning-type steps */
  background?: string;
}

const TOTAL_STEPS = 7;

/**
 * Visual onboarding stepper for WhatsApp Business connection.
 * Shows one step at a time with large illustration, title, short text,
 * navigation arrows and dot indicators — like Airbnb / Notion onboarding.
 */
export const WhatsAppPreOnboarding: React.FC<WhatsAppPreOnboardingProps> = ({
  onContinue,
  onCancel,
}) => {
  const { t } = useTranslation('translations');
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmed(e.target.checked);
  };

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const helpLink = t(
    'whatsappPreOnboarding.help-link',
    'https://atendimento.nuvemshop.com.br/pt_BR/nuvem-chat',
  );

  /* ─── Steps definition ─── */
  const steps: StepData[] = [
    {
      illustration: '/imgs/pre-onboard-flow.svg',
      illustrationMaxWidth: '320px',
      titleKey: 'whatsappPreOnboarding.intro-title',
      titleFallback: 'Vamos preparar tudo',
      descKey: 'whatsappPreOnboarding.intro-desc',
      descFallback: 'São só alguns passos rápidos antes de conectar. A gente te guia.',
    },
    {
      illustration: '/imgs/pre-onboard-app.svg',
      titleKey: 'whatsappPreOnboarding.block1-title',
      titleFallback: 'Instale o WhatsApp Business',
      descKey: 'whatsappPreOnboarding.block1-desc',
      descFallback: 'Você vai precisar dele pra escanear um QR Code no final.',
      link: {
        hrefKey: 'whatsappPreOnboarding.whatsapp-business-app-link',
        hrefFallback: 'https://business.whatsapp.com/',
        labelKey: 'whatsappPreOnboarding.block1-link',
        labelFallback: 'Baixar o app',
      },
    },
    {
      illustration: '/imgs/pre-onboard-number.svg',
      titleKey: 'whatsappPreOnboarding.block2-title',
      titleFallback: 'Use seu número Business',
      descKey: 'whatsappPreOnboarding.block2-desc',
      descFallback: 'Ele precisa estar vinculado ao portfólio comercial que você vai usar na Meta.',
    },
    {
      illustration: '/imgs/pre-onboard-2fa.svg',
      illustrationMaxWidth: '300px',
      titleKey: 'whatsappPreOnboarding.block3-title',
      titleFallback: 'Desative a verificação em duas etapas',
      descKey: 'whatsappPreOnboarding.block3-desc',
      descFallback: 'É só por um momento, no WhatsApp Business. Depois você reativa.',
    },
    {
      illustration: '/imgs/pre-onboard-admin.svg',
      titleKey: 'whatsappPreOnboarding.block4-title',
      titleFallback: 'Confira se você é administrador',
      descKey: 'whatsappPreOnboarding.block4-desc',
      descFallback: 'Você precisa ter acesso de admin no portfólio comercial da Meta.',
      link: {
        hrefKey: 'whatsappPreOnboarding.meta-business-link',
        hrefFallback: 'https://www.facebook.com/business/help/2087193751603668',
        labelKey: 'whatsappPreOnboarding.block4-link',
        labelFallback: 'Saiba mais',
      },
    },
    {
      illustration: '/imgs/pre-onboard-conflict.svg',
      titleKey: 'whatsappPreOnboarding.block5-title',
      titleFallback: 'Número conectado em outro lugar?',
      descKey: 'whatsappPreOnboarding.block5-desc',
      descFallback: 'Se já usa esse número em outra plataforma, desconecte antes.',
      background: 'linear-gradient(180deg, #FFF8E6 0%, #FFF1CC 100%)',
    },
    {
      illustration: '/imgs/pre-onboard-portfolio.svg',
      titleKey: 'whatsappPreOnboarding.block6-title',
      titleFallback: 'Selecione o portfólio certo',
      descKey: 'whatsappPreOnboarding.block6-desc',
      descFallback: 'Se o número já foi usado, escolha o mesmo portfólio de antes.',
    },
  ];

  const step = steps[currentStep];
  const isIntro = currentStep === 0;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="540px"
      marginLeft="auto"
      marginRight="auto"
      style={{ minHeight: '480px' }}
    >
      {/* ── Illustration area ── */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding="6"
        borderRadius="base"
        style={{
          background: step.background || '#F5F8FC',
          minHeight: '220px',
          transition: 'background 0.3s ease',
        }}
      >
        <img
          key={step.illustration}
          src={step.illustration}
          alt=""
          role="presentation"
          style={{
            width: '100%',
            maxWidth: step.illustrationMaxWidth || '260px',
            height: 'auto',
            transition: 'opacity 0.25s ease',
          }}
        />
      </Box>

      {/* ── Content area ── */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="3"
        padding="6"
        paddingTop="5"
        style={{ flex: '1 1 auto' }}
      >
        <Title as="h3" textAlign="center">
          {t(step.titleKey, step.titleFallback)}
        </Title>

        <Box display="flex" flexDirection="column" gap="1" alignItems="center">
          <Text fontSize="base" color="neutral-textLow" textAlign="center">
            {t(step.descKey, step.descFallback)}
          </Text>
          {step.extraDescKeys?.map((extra) => (
            <Text key={extra.key} fontSize="base" color="neutral-textLow" textAlign="center">
              {t(extra.key, extra.fallback)}
            </Text>
          ))}
        </Box>

        {/* Optional link */}
        {step.link && (
          <Link
            as="a"
            href={t(step.link.hrefKey, step.link.hrefFallback)}
            target="_blank"
            appearance="primary"
          >
            <Box display="flex" alignItems="center" gap="1">
              <Text fontSize="caption" color="currentColor">
                {t(step.link.labelKey, step.link.labelFallback)}
              </Text>
              <Icon source={<ExternalLinkIcon size={12} />} color="currentColor" />
            </Box>
          </Link>
        )}
      </Box>

      {/* ── Navigation: arrows + dots (hidden on intro) ── */}
      {!isIntro && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="4"
          paddingBottom="4"
          paddingLeft="6"
          paddingRight="6"
        >
          {/* Prev arrow */}
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="40px"
            height="40px"
            borderRadius="full"
            style={{
              border: '1px solid #D1D5DB',
              background: currentStep <= 1 ? '#F9FAFB' : '#FFFFFF',
              cursor: currentStep <= 1 ? 'default' : 'pointer',
              opacity: currentStep <= 1 ? 0.4 : 1,
              transition: 'opacity 0.2s, background 0.2s',
              flexShrink: 0,
            }}
            onClick={currentStep <= 1 ? undefined : goPrev}
          >
            <Icon source={<ChevronLeftIcon size={20} />} color="neutral-textLow" />
          </Box>

          {/* Dots (skip intro dot) */}
          <Box display="flex" alignItems="center" gap="2">
            {steps.slice(1).map((_, idx) => (
              <Box
                key={idx}
                as="button"
                width={idx + 1 === currentStep ? '24px' : '8px'}
                height="8px"
                borderRadius="full"
                style={{
                  background: idx + 1 === currentStep ? '#0050C3' : '#D1D5DB',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'width 0.3s ease, background 0.3s ease',
                  padding: 0,
                  flexShrink: 0,
                }}
                onClick={() => setCurrentStep(idx + 1)}
              />
            ))}
          </Box>

          {/* Next arrow */}
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="40px"
            height="40px"
            borderRadius="full"
            style={{
              border: '1px solid #D1D5DB',
              background: isLastStep ? '#F9FAFB' : '#FFFFFF',
              cursor: isLastStep ? 'default' : 'pointer',
              opacity: isLastStep ? 0.4 : 1,
              transition: 'opacity 0.2s, background 0.2s',
              flexShrink: 0,
            }}
            onClick={isLastStep ? undefined : goNext}
          >
            <Icon source={<ChevronRightIcon size={20} />} color="neutral-textLow" />
          </Box>
        </Box>
      )}

      {/* ── Footer ── */}
      <Box
        display="flex"
        flexDirection="column"
        gap="3"
        alignItems="center"
        padding="6"
        paddingTop="3"
        borderRadius="base"
        style={{
          borderTop: '1px solid #E5E7EB',
        }}
      >
        {/* Checkbox only on the last step */}
        {isLastStep && (
          <Box display="flex" alignItems="center" width="100%">
            <Checkbox
              name="pre-onboarding-confirmation"
              label={t(
              'whatsappPreOnboarding.confirmation-label',
              'Entendi, estou pronto pra conectar',
              )}
              checked={confirmed}
              onChange={handleCheckboxChange}
            />
          </Box>
        )}

        <Box display="flex" gap="3" width="100%" justifyContent="center">
          {isIntro ? (
            /* Intro: single CTA "Começar" */
            <Button appearance="primary" onClick={goNext}>
                {t('whatsappPreOnboarding.cta-start', 'Começar')}
            </Button>
          ) : isLastStep ? (
            /* Last step: Voltar + Continuar */
            <>
              <Button appearance="neutral" onClick={onCancel}>
                {t('common.back', 'Voltar')}
              </Button>
              <Button
                appearance="primary"
                onClick={onContinue}
                disabled={!confirmed}
              >
                {t('whatsappPreOnboarding.cta-continue', 'Conectar WhatsApp')}
              </Button>
            </>
          ) : (
            /* Middle steps: Voltar + Próximo */
            <>
              <Button appearance="neutral" onClick={onCancel}>
                {t('common.back', 'Voltar')}
              </Button>
              <Button appearance="primary" onClick={goNext}>
                {t('common.next', 'Próximo')}
              </Button>
            </>
          )}
        </Box>

        {!isIntro && (
          <Link as="a" href={helpLink} target="_blank" appearance="primary">
            <Box display="flex" alignItems="center" gap="1">
              <Text fontSize="caption" color="currentColor">
                {t('whatsappPreOnboarding.help-link-text', 'Precisa de ajuda?')}
              </Text>
              <Icon source={<ExternalLinkIcon size={12} />} color="currentColor" />
            </Box>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default WhatsAppPreOnboarding;
