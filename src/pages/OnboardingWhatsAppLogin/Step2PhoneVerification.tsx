import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Icon, Input, Link, Spinner, Text, Title } from '@nimbus-ds/components';
import { ChevronLeftIcon, LockIcon } from '@nimbus-ds/icons';
import { ChannelIcon } from '@/components';

export interface Step2PhoneVerificationProps {
  onVerify: (phoneNumber: string) => void;
  onBack: () => void;
  isVerifying: boolean;
}

type VerificationPhase = 'phone' | 'code' | 'confirming';

const COUNTRY_CODES = [
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+54', country: 'AR', flag: '🇦🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+56', country: 'CL', flag: '🇨🇱' },
  { code: '+57', country: 'CO', flag: '🇨🇴' },
  { code: '+51', country: 'PE', flag: '🇵🇪' },
  { code: '+598', country: 'UY', flag: '🇺🇾' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
];

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <Box display="flex" alignItems="center" justifyContent="center" gap="2" marginBottom="2">
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
            background: index + 1 <= currentStep ? '#00D95F' : '#E5E7EB',
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
              background: index + 1 < currentStep ? '#00D95F' : '#E5E7EB',
            }}
          />
        )}
      </React.Fragment>
    ))}
  </Box>
);

export const Step2PhoneVerification: React.FC<Step2PhoneVerificationProps> = ({
  onVerify,
  onBack,
}) => {
  const [phase, setPhase] = useState<VerificationPhase>('phone');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isWaitingCode, setIsWaitingCode] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullPhoneNumber = `${selectedCountry.code}${phoneNumber.replace(/\D/g, '')}`;
  const isPhoneValid = phoneNumber.replace(/\D/g, '').length >= 8;
  const isCodeComplete = verificationCode.every(d => d !== '');

  const handleSendCode = () => {
    setIsWaitingCode(true);
    setTimeout(() => {
      setIsWaitingCode(false);
      setPhase('code');
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
    }, 1500);
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmCode = () => {
    setPhase('confirming');
    setTimeout(() => {
      onVerify(fullPhoneNumber);
    }, 2000);
  };

  useEffect(() => {
    if (isCodeComplete && phase === 'code') {
      handleConfirmCode();
    }
  }, [verificationCode, phase]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      <StepIndicator currentStep={2} totalSteps={3} />

      {/* WhatsApp icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="80px"
        height="80px"
        borderRadius="full"
        style={{
          background: 'linear-gradient(135deg, #00D95F 0%, #00B84D 100%)',
          boxShadow: '0 4px 16px rgba(0, 217, 95, 0.3)',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="64px"
          height="64px"
          borderRadius="full"
          backgroundColor="neutral-background"
        >
          <ChannelIcon channel="whatsapp" size="large" />
        </Box>
      </Box>

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h3" textAlign="center">
          {phase === 'phone' && 'Informe seu número do WhatsApp Business'}
          {phase === 'code' && 'Digite o código de verificação'}
          {phase === 'confirming' && 'Conectando...'}
        </Title>
        <Box maxWidth="420px">
          <Text color="neutral-textLow" textAlign="center">
            {phase === 'phone' && 'Enviaremos um código de verificação para o app WhatsApp Business no seu celular.'}
            {phase === 'code' && 'Abra o WhatsApp Business no celular e confirme a conexão com a Plataforma de WhatsApp Business. Depois, insira o código abaixo.'}
            {phase === 'confirming' && 'Estamos verificando e conectando seu número...'}
          </Text>
        </Box>
      </Box>

      {/* Phase: Phone input */}
      {phase === 'phone' && (
        <>
          <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="420px">
            <Text fontWeight="bold" fontSize="base">Número de telefone</Text>
            <Box display="flex" gap="2" width="100%">
              <Box flexShrink="0" style={{ width: '120px' }}>
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = COUNTRY_CODES.find(c => c.code === e.target.value);
                    if (country) setSelectedCountry(country);
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    padding: '0 8px',
                    fontSize: '14px',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </Box>
              <Box width="100%">
                <Input
                  type="tel"
                  placeholder="11 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Box>
            </Box>
          </Box>

          {/* How it works */}
          <Box
            display="flex"
            flexDirection="column"
            gap="3"
            padding="4"
            backgroundColor="primary-surface"
            borderRadius="base"
            width="100%"
            maxWidth="420px"
          >
            <Text fontWeight="bold" fontSize="base" color="primary-textHigh">
              Como funciona:
            </Text>
            <Box display="flex" flexDirection="column" gap="2">
              {[
                'Você receberá uma notificação no WhatsApp Business',
                'Confirme a conexão "Conectar à Plataforma de WhatsApp Business"',
                'Copie o código de verificação e insira aqui',
              ].map((step, i) => (
                <Box key={i} display="flex" alignItems="flex-start" gap="2">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minWidth="24px"
                    height="24px"
                    borderRadius="full"
                    backgroundColor="primary-surfaceHighlight"
                    flexShrink="0"
                  >
                    <Text fontSize="caption" fontWeight="bold" color="primary-interactive">{i + 1}</Text>
                  </Box>
                  <Text fontSize="caption" color="primary-textHigh">{step}</Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Security note */}
          <Box
            display="flex"
            alignItems="center"
            gap="3"
            padding="3"
            borderRadius="base"
            maxWidth="420px"
            width="100%"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 95, 0.05) 0%, rgba(0, 184, 77, 0.1) 100%)',
              border: '1px solid rgba(0, 217, 95, 0.2)',
            }}
          >
            <Icon source={<LockIcon size={20} />} color="success-interactive" />
            <Text fontSize="caption" color="neutral-textLow">
              A verificação é feita diretamente pelo WhatsApp. O Nuvem Chat não armazena sua senha.
            </Text>
          </Box>

          {/* Send code button */}
          <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="420px">
            <Button
              appearance="primary"
              onClick={handleSendCode}
              disabled={!isPhoneValid || isWaitingCode}
            >
              {isWaitingCode ? (
                <Box display="flex" alignItems="center" gap="2">
                  <Spinner size="small" />
                  <Text color="currentColor">Enviando código...</Text>
                </Box>
              ) : (
                <Text color="currentColor">Enviar código de verificação</Text>
              )}
            </Button>
          </Box>
        </>
      )}

      {/* Phase: Code input */}
      {phase === 'code' && (
        <>
          {/* Phone number display */}
          <Box
            display="flex"
            alignItems="center"
            gap="2"
            padding="3"
            borderRadius="base"
            backgroundColor="neutral-surface"
            style={{ border: '1px solid var(--color-neutral-surfaceHighlight)' }}
          >
            <Text fontSize="caption" color="neutral-textLow">
              Código enviado para
            </Text>
            <Text fontSize="caption" fontWeight="bold">
              {selectedCountry.flag} {fullPhoneNumber}
            </Text>
          </Box>

          {/* 6-digit code input */}
          <Box display="flex" gap="2" justifyContent="center">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={el => { codeInputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeInput(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: digit ? '2px solid #00D95F' : '2px solid #D1D5DB',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  background: digit ? 'rgba(0, 217, 95, 0.05)' : '#fff',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#00D95F'; }}
                onBlur={(e) => { if (!digit) e.target.style.borderColor = '#D1D5DB'; }}
              />
            ))}
          </Box>

          {/* Instructions in app */}
          <Box
            display="flex"
            alignItems="center"
            gap="3"
            padding="4"
            backgroundColor="warning-surface"
            borderRadius="base"
            maxWidth="420px"
            width="100%"
          >
            <Box flexShrink="0">
              <Text fontSize="highlight">📱</Text>
            </Box>
            <Text fontSize="caption" color="warning-textHigh">
              Verifique seu celular! Você deve ver uma mensagem no WhatsApp Business pedindo para confirmar a conexão.
            </Text>
          </Box>

          {/* Resend link */}
          <Link
            as="button"
            appearance="primary"
            onClick={() => {
              setVerificationCode(['', '', '', '', '', '']);
              handleSendCode();
            }}
          >
            <Text fontSize="caption" color="currentColor">Reenviar código</Text>
          </Link>
        </>
      )}

      {/* Phase: Confirming */}
      {phase === 'confirming' && (
        <Box display="flex" flexDirection="column" alignItems="center" gap="4">
          <Spinner size="large" />
          <Text color="neutral-textLow" fontSize="base">
            Verificando o código e configurando a conexão...
          </Text>
        </Box>
      )}

      {/* Back */}
      {phase !== 'confirming' && (
        <Link as="button" appearance="neutral" onClick={onBack}>
          <Box display="flex" alignItems="center" gap="1">
            <Icon source={<ChevronLeftIcon size={16} />} color="currentColor" />
            <Text color="currentColor">Voltar</Text>
          </Box>
        </Link>
      )}
    </Box>
  );
};

export default Step2PhoneVerification;
