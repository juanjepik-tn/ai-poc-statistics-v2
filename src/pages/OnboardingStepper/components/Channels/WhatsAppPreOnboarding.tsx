import React, { useState, useCallback } from 'react';
import { Box, Button, Icon, Link, Modal, Text } from '@nimbus-ds/components';
import { ExternalLinkIcon } from '@nimbus-ds/icons';
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
  link?: {
    hrefKey: string;
    hrefFallback: string;
    labelKey: string;
    labelFallback: string;
  };
}

const TOTAL_STEPS = 7;

/**
 * Visual onboarding stepper — WhatsApp Business connection.
 *
 * Layout order (matches Figma):
 *   Modal.Header  → title
 *   Modal.Body    → illustration → description → link → dots
 *   Modal.Footer  → buttons
 */
export const WhatsAppPreOnboarding: React.FC<WhatsAppPreOnboardingProps> = ({
  onContinue,
  onCancel,
}) => {
  const { t } = useTranslation('translations');
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  /* ─── Steps ─── */
  const steps: StepData[] = [
    {
      illustration: '/imgs/pre-onboard-flow.svg',
      illustrationMaxWidth: '320px',
      titleKey: 'whatsappPreOnboarding.intro-title',
      titleFallback: 'Vamos preparar tudo',
      descKey: 'whatsappPreOnboarding.intro-desc',
      descFallback:
        'São só alguns passos rápidos antes de conectar. A gente te guia.',
    },
    {
      illustration: '/imgs/pre-onboard-app.svg',
      titleKey: 'whatsappPreOnboarding.block1-title',
      titleFallback: 'Instale o WhatsApp Business',
      descKey: 'whatsappPreOnboarding.block1-desc',
      descFallback:
        'Você vai precisar ter ele em seu celular para escanear o QR Code no final.',
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
      descFallback:
        'Ele precisa estar vinculado ao portfólio comercial que você vai usar na Meta.',
      link: {
        hrefKey: 'whatsappPreOnboarding.meta-business-link',
        hrefFallback:
          'https://www.facebook.com/business/help/2087193751603668',
        labelKey: 'whatsappPreOnboarding.block2-link',
        labelFallback: 'Saiba mais',
      },
    },
    {
      illustration: '/imgs/pre-onboard-2fa.svg',
      illustrationMaxWidth: '300px',
      titleKey: 'whatsappPreOnboarding.block3-title',
      titleFallback: 'Desative a verificação em duas etapas',
      descKey: 'whatsappPreOnboarding.block3-desc',
      descFallback:
        'É só por um momento, no WhatsApp Business. Depois você pode reativar.',
      link: {
        hrefKey: 'whatsappPreOnboarding.meta-business-link',
        hrefFallback:
          'https://www.facebook.com/business/help/2087193751603668',
        labelKey: 'whatsappPreOnboarding.block3-link',
        labelFallback: 'Saiba mais',
      },
    },
    {
      illustration: '/imgs/pre-onboard-admin.svg',
      titleKey: 'whatsappPreOnboarding.block4-title',
      titleFallback: 'Confira se você é administrador',
      descKey: 'whatsappPreOnboarding.block4-desc',
      descFallback:
        'Você precisa ter acesso de admin no portfólio comercial da Meta.',
      link: {
        hrefKey: 'whatsappPreOnboarding.meta-business-link',
        hrefFallback:
          'https://www.facebook.com/business/help/2087193751603668',
        labelKey: 'whatsappPreOnboarding.block4-link',
        labelFallback: 'Saiba mais',
      },
    },
    {
      illustration: '/imgs/pre-onboard-conflict.svg',
      titleKey: 'whatsappPreOnboarding.block5-title',
      titleFallback: 'Seu número está conectado em outro lugar?',
      descKey: 'whatsappPreOnboarding.block5-desc',
      descFallback:
        'Se já usa esse número em outra plataforma, desconectar antes.',
      link: {
        hrefKey: 'whatsappPreOnboarding.meta-business-link',
        hrefFallback:
          'https://www.facebook.com/business/help/2087193751603668',
        labelKey: 'whatsappPreOnboarding.block5-link',
        labelFallback: 'Saiba mais',
      },
    },
    {
      illustration: '/imgs/pre-onboard-portfolio.svg',
      titleKey: 'whatsappPreOnboarding.block6-title',
      titleFallback: 'Selecione o portfólio certo',
      descKey: 'whatsappPreOnboarding.block6-desc',
      descFallback:
        'Se o número já foi usado, escolha o mesmo portfólio de antes.',
      link: {
        hrefKey: 'whatsappPreOnboarding.meta-business-link',
        hrefFallback:
          'https://www.facebook.com/business/help/2087193751603668',
        labelKey: 'whatsappPreOnboarding.block6-link',
        labelFallback: 'Saiba mais',
      },
    },
  ];

  const step = steps[currentStep];
  const isIntro = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  /* ─── Render ─── */
  return (
    <>
      {/* ── Header ── */}
      <Modal.Header title={t(step.titleKey, step.titleFallback)} />

      {/* ── Body ── */}
      <Modal.Body padding="none">
        <Box
          padding="4"
          paddingTop="none"
          display="flex"
          flexDirection="column"
          gap="4"
          alignItems="center"
        >
          {/* 1) Illustration — comes first, matching Figma */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            style={{
              background: '#eef5ff',
              borderRadius: '20px',
              height: '200px',
              overflow: 'hidden',
            }}
          >
            <img
              key={step.illustration}
              src={step.illustration}
              alt=""
              role="presentation"
              style={{
                width: '100%',
                maxWidth: step.illustrationMaxWidth || '240px',
                height: 'auto',
              }}
            />
          </Box>

          {/* 2) Description text */}
          <Box width="100%">
            <Text fontSize="base" color="neutral-textLow">
              {t(step.descKey, step.descFallback)}
            </Text>
          </Box>

          {/* 3) Optional link */}
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
                <Icon
                  source={<ExternalLinkIcon size={12} />}
                  color="currentColor"
                />
              </Box>
            </Link>
          )}

          {/* 4) Dot indicators — 6px, gap 6px, active 24px */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="1-5"
          >
            {steps.map((_, idx) => (
              <Box
                key={idx}
                as="button"
                width={idx === currentStep ? '24px' : '6px'}
                height="6px"
                borderRadius="full"
                style={{
                  background:
                    idx === currentStep ? '#0059D5' : '#D1D5DB',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'width 0.3s ease, background 0.3s ease',
                  padding: 0,
                  flexShrink: 0,
                }}
                onClick={() => setCurrentStep(idx)}
              />
            ))}
          </Box>
        </Box>
      </Modal.Body>

      {/* ── Footer ── */}
      <Modal.Footer>
        {isIntro ? (
          <>
            <Button appearance="neutral" onClick={onCancel}>
              {t('whatsappPreOnboarding.cta-skip', 'Pular')}
            </Button>
            <Button appearance="primary" onClick={goNext}>
              {t('whatsappPreOnboarding.cta-start', 'Começar')}
            </Button>
          </>
        ) : isLastStep ? (
          <>
            <Button appearance="neutral" onClick={goPrev}>
              {t('common.back', 'Voltar')}
            </Button>
            <Button appearance="primary" onClick={onContinue}>
              {t('whatsappPreOnboarding.cta-connect', 'Conectar')}
            </Button>
          </>
        ) : (
          <>
            <Button appearance="neutral" onClick={goPrev}>
              {t('common.back', 'Voltar')}
            </Button>
            <Button appearance="primary" onClick={goNext}>
              {t('common.next', 'Próximo')}
            </Button>
          </>
        )}
      </Modal.Footer>
    </>
  );
};

export default WhatsAppPreOnboarding;
