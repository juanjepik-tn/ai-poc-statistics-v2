import React, { useState } from 'react';
import { Box, Card, Spinner } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import { useNavigate } from 'react-router-dom';
import { Step1MethodSelection } from './Step1MethodSelection';
import { Step2PhoneVerification } from './Step2PhoneVerification';
import { Step3Success } from './Step3Success';

type OnboardingStep = 'method-selection' | 'phone-verification' | 'success';

const WhatsAppLoginOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('method-selection');
  const [connectedPhone, setConnectedPhone] = useState('');
  const [isLoading] = useState(false);

  const handleCancel = () => {
    navigate('/admin/chat#/configurations');
  };

  const handleSelectWhatsAppLogin = () => {
    setCurrentStep('phone-verification');
  };

  const handleSelectEmbeddedSignup = () => {
    navigate('/admin/chat#/onboarding/4');
  };

  const handleVerify = (phoneNumber: string) => {
    setConnectedPhone(phoneNumber);
    setCurrentStep('success');
  };

  const handleBack = () => {
    setCurrentStep('method-selection');
  };

  const handleGoToConversations = () => {
    navigate('/admin/chat#/conversations');
  };

  const handleGoToChannels = () => {
    navigate('/admin/chat#/configurations');
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <Spinner size="large" />
        </Box>
      );
    }

    switch (currentStep) {
      case 'method-selection':
        return (
          <Step1MethodSelection
            onSelectWhatsAppLogin={handleSelectWhatsAppLogin}
            onSelectEmbeddedSignup={handleSelectEmbeddedSignup}
            onCancel={handleCancel}
          />
        );
      case 'phone-verification':
        return (
          <Step2PhoneVerification
            onVerify={handleVerify}
            onBack={handleBack}
            isVerifying={isLoading}
          />
        );
      case 'success':
        return (
          <Step3Success
            phoneNumber={connectedPhone}
            onGoToConversations={handleGoToConversations}
            onGoToChannels={handleGoToChannels}
          />
        );
      default:
        return (
          <Step1MethodSelection
            onSelectWhatsAppLogin={handleSelectWhatsAppLogin}
            onSelectEmbeddedSignup={handleSelectEmbeddedSignup}
            onCancel={handleCancel}
          />
        );
    }
  };

  return (
    <Page maxWidth="800px">
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <Card>
              <Card.Body>{renderStep()}</Card.Body>
            </Card>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default WhatsAppLoginOnboarding;
