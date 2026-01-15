import React, { useState } from 'react';
import { Box, Card, Spinner } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Step1Welcome } from './Step1Welcome';
import { Step2FacebookConnect } from './Step2FacebookConnect';
import { Step3SelectPage } from './Step3SelectPage';
import { Step4Confirmation } from './Step4Confirmation';
import {
  selectFacebookOnboarding,
  selectHasInstagramConnected,
  setFacebookOnboardingStep,
  selectFacebookPage,
  closeFacebookOnboarding,
  addChannel,
  setFacebookConnecting,
} from '@/redux/slices/channels';
import { mockFacebookPages, FacebookPage } from '@/mocks/mock-channels';
import { IChannelConfig } from '@/types/conversation';

const FacebookOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State from Redux
  const { currentStep, selectedPageId, isConnecting } = useSelector(selectFacebookOnboarding);
  const hasInstagramConnected = useSelector(selectHasInstagramConnected);

  // Local state for mock pages (would come from OAuth in real implementation)
  const [pages] = useState<FacebookPage[]>(mockFacebookPages);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total steps based on Instagram connection
  // If Instagram is connected: 3 steps (Welcome -> Select Page -> Confirmation)
  // If not connected: 4 steps (Welcome -> Facebook Connect -> Select Page -> Confirmation)
  const totalSteps = hasInstagramConnected ? 3 : 4;

  // Step handlers
  const handleCancel = () => {
    dispatch(closeFacebookOnboarding());
    navigate('/admin/chat#/configurations');
  };

  const handleStep1Continue = () => {
    if (hasInstagramConnected) {
      // Skip Facebook connect step, go directly to page selection
      dispatch(setFacebookOnboardingStep(3));
    } else {
      dispatch(setFacebookOnboardingStep(2));
    }
  };

  const handleStep2Connect = async () => {
    dispatch(setFacebookConnecting(true));
    
    // Simulate OAuth flow with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    dispatch(setFacebookConnecting(false));
    dispatch(setFacebookOnboardingStep(3));
  };

  const handleStep2Back = () => {
    dispatch(setFacebookOnboardingStep(1));
  };

  const handleSelectPage = (pageId: string) => {
    dispatch(selectFacebookPage(pageId));
  };

  const handleStep3Continue = async () => {
    if (!selectedPageId) return;

    setIsLoading(true);

    // Simulate connecting the page
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find the selected page
    const selectedPage = pages.find((p) => p.id === selectedPageId);

    if (selectedPage) {
      // Add the channel to Redux store
      const newChannel: IChannelConfig = {
        id: `fb-${Date.now()}`,
        channelType: 'facebook',
        username: selectedPage.name,
        displayName: selectedPage.name,
        status: 'connected',
        chatEnabled: true,
        marketingAutomationEnabled: false,
        createdAt: new Date().toISOString(),
        avatar: selectedPage.picture,
        followers: selectedPage.followers,
      };

      dispatch(addChannel(newChannel));
    }

    setIsLoading(false);
    dispatch(setFacebookOnboardingStep(4));
  };

  const handleStep3Back = () => {
    if (hasInstagramConnected) {
      dispatch(setFacebookOnboardingStep(1));
    } else {
      dispatch(setFacebookOnboardingStep(2));
    }
  };

  const handleGoToConversations = () => {
    dispatch(closeFacebookOnboarding());
    navigate('/conversations');
  };

  const handleGoToChannels = () => {
    dispatch(closeFacebookOnboarding());
    navigate('/admin/chat#/configurations');
  };

  // Get selected page for confirmation
  const selectedPage = pages.find((p) => p.id === selectedPageId);

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
        return (
          <Step1Welcome 
            onContinue={handleStep1Continue} 
            onCancel={handleCancel}
            hasInstagramConnected={hasInstagramConnected}
          />
        );
      case 2:
        return (
          <Step2FacebookConnect
            onConnect={handleStep2Connect}
            onBack={handleStep2Back}
            isConnecting={isConnecting}
            hasInstagramConnected={hasInstagramConnected}
          />
        );
      case 3:
        return (
          <Step3SelectPage
            pages={pages}
            selectedPageId={selectedPageId}
            onSelectPage={handleSelectPage}
            onContinue={handleStep3Continue}
            onBack={handleStep3Back}
            hasInstagramConnected={hasInstagramConnected}
          />
        );
      case 4:
        return (
          <Step4Confirmation
            pageName={selectedPage?.name || 'Tu página'}
            onGoToConversations={handleGoToConversations}
            onGoToChannels={handleGoToChannels}
          />
        );
      default:
        return (
          <Step1Welcome 
            onContinue={handleStep1Continue} 
            onCancel={handleCancel}
            hasInstagramConnected={hasInstagramConnected}
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

export default FacebookOnboarding;



