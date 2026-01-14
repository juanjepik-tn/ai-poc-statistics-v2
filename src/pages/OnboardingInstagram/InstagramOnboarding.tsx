import React, { useState } from 'react';
import { Box, Card, Spinner } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Step1Welcome } from './Step1Welcome';
import { Step2FacebookConnect } from './Step2FacebookConnect';
import { Step3SelectAccount } from './Step3SelectAccount';
import { Step4Confirmation } from './Step4Confirmation';
import {
  selectInstagramOnboarding,
  setOnboardingStep,
  selectInstagramAccount,
  closeInstagramOnboarding,
  addChannel,
  setInstagramConnecting,
} from '@/redux/slices/channels';
import { mockInstagramAccounts, InstagramAccount } from '@/mocks/mock-channels';
import { IChannelConfig } from '@/types/conversation';

const InstagramOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State from Redux
  const { currentStep, selectedAccountId, isConnecting } = useSelector(selectInstagramOnboarding);

  // Local state for mock accounts (would come from OAuth in real implementation)
  const [accounts] = useState<InstagramAccount[]>(mockInstagramAccounts);
  const [isLoading, setIsLoading] = useState(false);

  // Step handlers
  const handleCancel = () => {
    dispatch(closeInstagramOnboarding());
    navigate('/admin/chat#/configurations');
  };

  const handleStep1Continue = () => {
    dispatch(setOnboardingStep(2));
  };

  const handleStep2Connect = async () => {
    dispatch(setInstagramConnecting(true));
    
    // Simulate OAuth flow with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    dispatch(setInstagramConnecting(false));
    dispatch(setOnboardingStep(3));
  };

  const handleStep2Back = () => {
    dispatch(setOnboardingStep(1));
  };

  const handleSelectAccount = (accountId: string) => {
    dispatch(selectInstagramAccount(accountId));
  };

  const handleStep3Continue = async () => {
    if (!selectedAccountId) return;

    setIsLoading(true);

    // Simulate connecting the account
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find the selected account
    const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

    if (selectedAccount) {
      // Add the channel to Redux store
      const newChannel: IChannelConfig = {
        id: `ig-${Date.now()}`,
        channelType: 'instagram',
        username: selectedAccount.username,
        displayName: selectedAccount.name,
        status: 'connected',
        chatEnabled: true,
        marketingAutomationEnabled: false,
        createdAt: new Date().toISOString(),
        avatar: selectedAccount.profilePicture,
        followers: selectedAccount.followers,
      };

      dispatch(addChannel(newChannel));
    }

    setIsLoading(false);
    dispatch(setOnboardingStep(4));
  };

  const handleStep3Back = () => {
    dispatch(setOnboardingStep(2));
  };

  const handleGoToConversations = () => {
    dispatch(closeInstagramOnboarding());
    navigate('/conversations');
  };

  const handleGoToChannels = () => {
    dispatch(closeInstagramOnboarding());
    navigate('/admin/chat#/configurations');
  };

  // Get selected account for confirmation
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  // Render current step
  const renderStep = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <Spinner size="large" />
        </Box>
      );
    }

    switch (currentStep) {
      case 1:
        return <Step1Welcome onContinue={handleStep1Continue} onCancel={handleCancel} />;
      case 2:
        return (
          <Step2FacebookConnect
            onConnect={handleStep2Connect}
            onBack={handleStep2Back}
            isConnecting={isConnecting}
          />
        );
      case 3:
        return (
          <Step3SelectAccount
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelectAccount={handleSelectAccount}
            onContinue={handleStep3Continue}
            onBack={handleStep3Back}
          />
        );
      case 4:
        return (
          <Step4Confirmation
            username={selectedAccount?.username || '@cuenta'}
            onGoToConversations={handleGoToConversations}
            onGoToChannels={handleGoToChannels}
          />
        );
      default:
        return <Step1Welcome onContinue={handleStep1Continue} onCancel={handleCancel} />;
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

export default InstagramOnboarding;


