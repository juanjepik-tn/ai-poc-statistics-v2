import React from 'react';
import { Box, Button, Icon, Link, Spinner, Text, Title } from '@nimbus-ds/components';
import { LockIcon, CheckCircleIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';

export interface Step2FacebookConnectProps {
  onConnect: () => void;
  onBack: () => void;
  isConnecting?: boolean;
}

// Stepper component for reuse
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  const getStepStyle = (step: number): React.CSSProperties => {
    if (step < currentStep) {
      return { background: '#10b981' }; // completed - green
    }
    if (step === currentStep) {
      return { background: '#3b82f6', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)' }; // active - blue
    }
    return { background: '#e5e7eb' }; // pending - gray
  };

  const getLineStyle = (step: number): React.CSSProperties => {
    return {
      background: step < currentStep ? '#10b981' : '#e5e7eb',
    };
  };
  
  return (
    <Box display="flex" alignItems="center" gap="2">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              ...getStepStyle(step),
            }}
          >
            {step < currentStep ? (
              <Icon source={<CheckCircleIcon size={16} />} color="neutral-background" />
            ) : (
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: step <= currentStep ? 'white' : '#6b7280',
                }}
              >
                {step}
              </span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div 
              style={{
                width: '32px',
                height: '3px',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                ...getLineStyle(step),
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export const Step2FacebookConnect: React.FC<Step2FacebookConnectProps> = ({
  onConnect,
  onBack,
  isConnecting = false,
}) => {
  const { t } = useTranslation('translations');

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Progress indicator */}
      <StepIndicator currentStep={2} totalSteps={3} />

      {/* Facebook icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="72px"
        height="72px"
        borderRadius="full"
        style={{
          background: '#1877F2',
          boxShadow: '0 4px 16px rgba(24, 119, 242, 0.3)',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </Box>

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h2" textAlign="center">
          {t('instagramOnboarding.step2.title', 'Conectá con tu cuenta de Facebook')}
        </Title>
        <Text color="neutral-textLow" textAlign="center" fontSize="base">
          {t(
            'instagramOnboarding.step2.description',
            'Necesitamos acceso a tu cuenta de Facebook para conectar tu Instagram Business.'
          )}
        </Text>
      </Box>

      {/* Facebook button */}
      <Box width="100%" maxWidth="320px">
        <button
          onClick={onConnect}
          disabled={isConnecting}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: isConnecting ? '#a3c9f7' : '#1877F2',
            border: 'none',
            borderRadius: '8px',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(24, 119, 242, 0.3)',
          }}
          onMouseOver={(e) => {
            if (!isConnecting) {
              e.currentTarget.style.background = '#166fe5';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!isConnecting) {
              e.currentTarget.style.background = '#1877F2';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 119, 242, 0.3)';
            }
          }}
        >
          {isConnecting ? (
            <Spinner size="small" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span style={{ 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: 600,
            fontFamily: 'inherit'
          }}>
            {isConnecting 
              ? 'Conectando...' 
              : t('instagramOnboarding.step2.cta', 'Continuar con Facebook')
            }
          </span>
        </button>
      </Box>

      {/* Security note */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap="2" 
        padding="3"
        backgroundColor="neutral-surface"
        borderRadius="base"
        maxWidth="320px"
      >
        <Icon source={<LockIcon size={16} />} color="neutral-textLow" />
        <Text fontSize="caption" color="neutral-textLow">
          {t(
            'instagramOnboarding.step2.security',
            'Solo pedimos los permisos necesarios para mensajería'
          )}
        </Text>
      </Box>

      {/* Back link */}
      <Link as="button" appearance="neutral" onClick={onBack}>
        ← {t('common.back', 'Volver')}
      </Link>
    </Box>
  );
};

export default Step2FacebookConnect;
