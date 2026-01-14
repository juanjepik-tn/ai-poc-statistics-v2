import React from 'react';
import { Box, Button, Icon, Link, Text, Title } from '@nimbus-ds/components';
import { CheckCircleIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { InstagramAccount } from '@/mocks/mock-channels';
import { ChannelIcon } from '@/components';

export interface Step3SelectAccountProps {
  accounts: InstagramAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Stepper component
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

export const Step3SelectAccount: React.FC<Step3SelectAccountProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onContinue,
  onBack,
}) => {
  const { t } = useTranslation('translations');

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M seguidores`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k seguidores`;
    }
    return `${count} seguidores`;
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Progress indicator */}
      <StepIndicator currentStep={3} totalSteps={3} />

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h2" textAlign="center">
          {t('instagramOnboarding.step3.title', 'Seleccioná tu cuenta de Instagram')}
        </Title>
        <Text color="neutral-textLow" textAlign="center">
          {t(
            'instagramOnboarding.step3.description',
            'Encontramos estas cuentas vinculadas a tu Facebook:'
          )}
        </Text>
      </Box>

      {/* Account list */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="420px">
        {accounts.map((account) => {
          const isSelected = selectedAccountId === account.id;
          
          return (
            <Box
              key={account.id}
              onClick={() => onSelectAccount(account.id)}
              padding="4"
              borderRadius="base"
              style={{ 
                cursor: 'pointer',
                border: isSelected 
                  ? '2px solid transparent'
                  : '2px solid var(--color-neutral-surfaceHighlight)',
                background: isSelected 
                  ? 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888) border-box'
                  : 'var(--color-neutral-background)',
                boxShadow: isSelected 
                  ? '0 4px 16px rgba(225, 48, 108, 0.2)'
                  : 'none',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <Box display="flex" alignItems="center" gap="4">
                {/* Selection indicator */}
                <Box
                  width="24px"
                  height="24px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    border: isSelected 
                      ? 'none'
                      : '2px solid var(--color-neutral-surfaceHighlight)',
                    background: isSelected 
                      ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
                      : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSelected && (
                    <Icon source={<CheckCircleIcon size={14} />} color="neutral-background" />
                  )}
                </Box>
                
                {/* Profile picture with Instagram gradient ring */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="56px"
                  height="56px"
                  borderRadius="full"
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
                      : 'var(--color-neutral-surfaceHighlight)',
                    padding: '2px',
                  }}
                >
                  <img
                    src={account.profilePicture}
                    alt={account.username}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid white',
                    }}
                  />
                </Box>
                
                {/* Account info */}
                <Box display="flex" flexDirection="column" gap="0-5" flex="1">
                  <Box display="flex" alignItems="center" gap="1">
                    <ChannelIcon channel="instagram" size="small" />
                    <Text fontWeight="bold" fontSize="base">{account.username}</Text>
                  </Box>
                  <Text fontSize="caption" color="neutral-textLow">
                    {account.name}
                  </Text>
                  <Text fontSize="caption" color="neutral-textLow">
                    {formatFollowers(account.followers)}
                  </Text>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="420px" gap="4">
        <Link as="button" appearance="neutral" onClick={onBack}>
          ← {t('common.back', 'Volver')}
        </Link>
        <Button
          appearance="primary"
          onClick={onContinue}
          disabled={!selectedAccountId}
        >
          <Box display="flex" alignItems="center" gap="2">
            <Text color="currentColor">{t('instagramOnboarding.step3.cta', 'Conectar cuenta')}</Text>
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default Step3SelectAccount;
