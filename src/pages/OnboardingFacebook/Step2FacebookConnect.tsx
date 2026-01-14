import React from 'react';
import { Box, Button, Icon, Link, Text, Title, Spinner } from '@nimbus-ds/components';
import { ChevronLeftIcon, LockIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';

export interface Step2FacebookConnectProps {
  onConnect: () => void;
  onBack: () => void;
  isConnecting: boolean;
  hasInstagramConnected: boolean;
}

// Stepper indicator component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <Box display="flex" alignItems="center" justifyContent="center" gap="2" marginBottom="4">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <React.Fragment key={index}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: index + 1 <= currentStep 
              ? '#1877F2'
              : '#E5E7EB',
            color: index + 1 <= currentStep ? '#fff' : '#9CA3AF',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {index + 1}
        </div>
        {index < totalSteps - 1 && (
          <div
            style={{
              width: '40px',
              height: '2px',
              background: index + 1 < currentStep 
                ? '#1877F2'
                : '#E5E7EB',
            }}
          />
        )}
      </React.Fragment>
    ))}
  </Box>
);

export const Step2FacebookConnect: React.FC<Step2FacebookConnectProps> = ({
  onConnect,
  onBack,
  isConnecting,
  hasInstagramConnected,
}) => {
  const { t } = useTranslation('translations');

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Step indicator */}
      <StepIndicator currentStep={2} totalSteps={hasInstagramConnected ? 3 : 4} />

      {/* Facebook icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="80px"
        height="80px"
        borderRadius="full"
        style={{
          background: '#1877F2',
          boxShadow: '0 4px 16px rgba(24, 119, 242, 0.3)',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </Box>

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h3" textAlign="center">
          {hasInstagramConnected 
            ? 'Autorizar permiso de mensajería' 
            : 'Conectar con Facebook'}
        </Title>
        <Text color="neutral-textLow" textAlign="center" maxWidth="400px">
          {hasInstagramConnected
            ? 'Como ya tenés Instagram conectado, solo necesitamos un permiso adicional para Messenger.'
            : 'Iniciá sesión con tu cuenta de Facebook para conectar Messenger a Chat Nube.'}
        </Text>
      </Box>

      {/* Permission info */}
      <Box
        display="flex"
        flexDirection="column"
        gap="3"
        padding="4"
        backgroundColor="neutral-surface"
        borderRadius="base"
        maxWidth="400px"
        width="100%"
      >
        <Text fontWeight="bold" fontSize="base">
          {hasInstagramConnected ? 'Permiso adicional requerido:' : 'Permisos que solicitaremos:'}
        </Text>
        <Box display="flex" alignItems="center" gap="2">
          <Box
            width="8px"
            height="8px"
            borderRadius="full"
            style={{ background: '#1877F2' }}
          />
          <Text fontSize="base" color="neutral-textLow">
            <strong>pages_messaging</strong> - Para recibir y enviar mensajes
          </Text>
        </Box>
        {!hasInstagramConnected && (
          <Box display="flex" alignItems="center" gap="2">
            <Box
              width="8px"
              height="8px"
              borderRadius="full"
              style={{ background: '#1877F2' }}
            />
            <Text fontSize="base" color="neutral-textLow">
              <strong>pages_manage_metadata</strong> - Para gestionar tu página
            </Text>
          </Box>
        )}
      </Box>

      {/* Security note */}
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="3"
        borderRadius="base"
        maxWidth="400px"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.05) 0%, rgba(13, 101, 217, 0.1) 100%)',
          border: '1px solid rgba(24, 119, 242, 0.2)',
        }}
      >
        <Icon source={<LockIcon size={20} />} color="primary-interactive" />
        <Text fontSize="caption" color="neutral-textLow">
          Tus credenciales son procesadas directamente por Meta. Chat Nube no almacena tu contraseña.
        </Text>
      </Box>

      {/* Connect button */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="400px">
        <Button
          appearance="primary"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Box display="flex" alignItems="center" gap="2">
              <Spinner size="small" />
              <Text color="currentColor">Conectando...</Text>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap="2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <Text color="currentColor">
                {hasInstagramConnected ? 'Autorizar permiso' : 'Continuar con Facebook'}
              </Text>
            </Box>
          )}
        </Button>
      </Box>

      {/* Back link */}
      <Link as="button" appearance="neutral" onClick={onBack}>
        <Box display="flex" alignItems="center" gap="1">
          <Icon source={<ChevronLeftIcon size={16} />} color="currentColor" />
          <Text color="currentColor">Volver</Text>
        </Box>
      </Link>
    </Box>
  );
};

export default Step2FacebookConnect;

