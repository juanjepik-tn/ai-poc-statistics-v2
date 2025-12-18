import { useEffect, useState } from 'react';
import { Box, Icon, Link, Spinner, Tag, Text, Title } from '@nimbus-ds/components';
import { HelpLink, Layout, Page } from '@nimbus-ds/patterns';
import { ExternalLinkIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Channel, ChannelsList, WhatsappIllustration, WhatsappOptionCard } from './components';
import { useFetch, useWindowWidth } from '@/hooks';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { API_ENDPOINTS } from '@/app/Axios/Axios';

const WhatsappIntegration: React.FC = () => {
  const { t } = useTranslation('translations');
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== null && windowWidth <= 768;
  const navigate = useNavigate();
  const { request } = useFetch();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<Channel[]>({
      url: API_ENDPOINTS.crossCompany.channels,
      method: 'GET',
    })
      .then(({ content }) => {
        setChannels(content || []);
      })
      .catch((error) => {
        console.error('Error fetching channels:', error);
        setChannels([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleConnectionSuccess = () => {
    navigate('/external/channels/whatsapp');
  };

  const { launchWhatsAppSignup } = useFacebookLogin(
    handleConnectionSuccess,
    API_ENDPOINTS.crossCompany.signup
  );

  const handleConnectWhatsappBusiness = () => {
    launchWhatsAppSignup();
  };

  const handleAddButton = () => {
    // TODO: Implement simple button addition flow
    console.log('Add WhatsApp button');
  };

  const handleAddChannel = () => {
    launchWhatsAppSignup();
  };

  const handleToggleAutomatedMessages = async (channel: Channel, value: boolean) => {
    const endpoint = value 
      ? API_ENDPOINTS.crossCompany.enableMarketingAutomation(channel.id)
      : API_ENDPOINTS.crossCompany.disableMarketingAutomation(channel.id);
    
    try {
      await request({
        url: endpoint,
        method: 'POST',
      });
      
      setChannels(prev => 
        prev.map(ch => ch.id === channel.id 
          ? { ...ch, marketingAutomationEnabled: value } 
          : ch
        )
      );
    } catch (error) {
      console.error('Error toggling marketing automation:', error);
    }
  };

  const handleToggleChat = async (channel: Channel, value: boolean) => {
    const endpoint = value 
      ? API_ENDPOINTS.crossCompany.enableChat(channel.id)
      : API_ENDPOINTS.crossCompany.disableChat(channel.id);
    
    try {
      await request({
        url: endpoint,
        method: 'POST',
      });
      
      setChannels(prev => 
        prev.map(ch => ch.id === channel.id 
          ? { ...ch, chatEnabled: value } 
          : ch
        )
      );
    } catch (error) {
      console.error('Error toggling chat:', error);
    }
  };

  const businessFeatures = [
    { text: t('whatsappIntegration.options.business.features.button'), enabled: true },
    { text: t('whatsappIntegration.options.business.features.automatedMessages'), enabled: true },
    { text: t('whatsappIntegration.options.business.features.aiAgent'), enabled: true },
  ];

  const simpleFeatures = [
    { text: t('whatsappIntegration.options.simple.features.button'), enabled: true },
    { text: t('whatsappIntegration.options.simple.features.automatedMessages'), enabled: false },
    { text: t('whatsappIntegration.options.simple.features.aiAgent'), enabled: false },
  ];

  if (loading) {
    return (
      <Page maxWidth="1100px">
        <Page.Body>
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <Spinner size="large" />
          </Box>
        </Page.Body>
      </Page>
    );
  }

  if (channels.length > 0) {
    return (
      <ChannelsList 
        channels={channels} 
        onToggleAutomatedMessages={handleToggleAutomatedMessages}
        onToggleChat={handleToggleChat}
        onAddChannel={handleAddChannel}
      />
    );
  }

  return (
    <Page maxWidth="1100px">
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              gap="6"
              alignItems="flex-start"
            >
              {!isMobile && (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  width="280px"
                  flexShrink="0"
                  alignSelf="center"
                >
                  <WhatsappIllustration />
                </Box>
              )}

              <Box display="flex" flexDirection="column" gap="4" flex="1">
                <Tag appearance="neutral">
                  <Text fontSize="caption" color="neutral-textHigh">
                    {t('whatsappIntegration.pageTag')}
                  </Text>
                </Tag>

                <Title as="h2">{t('whatsappIntegration.title')}</Title>

                <Text color="neutral-textHigh" fontSize="base">
                  {t('whatsappIntegration.subtitle')}
                </Text>

                <Box
                  display="flex"
                  flexDirection={isMobile ? 'column' : 'row'}
                  gap="4"
                  alignItems="stretch"
                  paddingTop="2"
                >
                  <Box width="256px" height="440px">
                    <WhatsappOptionCard
                      title={t('whatsappIntegration.options.business.title')}
                      isRecommended={true}
                      features={businessFeatures}
                      buttonText={t('whatsappIntegration.options.business.button')}
                      buttonVariant="primary"
                      onButtonClick={handleConnectWhatsappBusiness}
                    />
                  </Box>

                  <Box width="256px" height="440px">
                    <WhatsappOptionCard
                      title={t('whatsappIntegration.options.simple.title')}
                      isRecommended={false}
                      features={simpleFeatures}
                      buttonText={t('whatsappIntegration.options.simple.button')}
                      buttonVariant="neutral"
                      onButtonClick={handleAddButton}
                    />
                  </Box>
                </Box>

                <Box paddingTop="2">
                  <HelpLink>
                    <Link
                      as="a"
                      href="#"
                      target="_blank"
                      appearance="primary"
                      textDecoration="none"
                    >
                      {t('whatsappIntegration.helpLink')}
                      <Icon source={<ExternalLinkIcon />} color="currentColor" />
                    </Link>
                  </HelpLink>
                </Box>
              </Box>
            </Box>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default WhatsappIntegration;
