import {
  Box,
  Button,
  Card,
  Icon,
  Link,
  Modal,
  Spinner,
  Tag,
  Text,
  Title,
  useToast
} from '@nimbus-ds/components';
import {
  HelpLink,
  Layout,
  Page
} from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { nexo } from '@/app';

import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch, useHelpLink } from '@/hooks';
import { Instance } from '@/pages/Configurations/components/InstanceCard';
import InstancesDataProvider from '@/pages/Instances/InstancesDataProvider';
import InstancesQR from '@/pages/Instances/InstancesQR';
import { setBillingData } from '@/redux/slices/billing';
import { trackingHelpLink, trackingQRGeneration, trackingStartTrial, trackingWhatsappBaileysConnect, trackingWhatsappConnectSuccess } from '@/tracking';
import { BillingDTO } from '@/types/billingDTO';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PricingTermsCard } from '../Pricing/PricingTermsCard';
import { ExternalLinkIcon } from '@nimbus-ds/icons';
import { ChannelCard } from '@/components';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import WhatsAppPreOnboarding from './WhatsAppPreOnboarding';

type ChannelsProps = {
  prevStep: () => void;
}
const Channels: React.FC<ChannelsProps> = ({ prevStep }) => {
  const { t } = useTranslation('translations');
  const [open, setOpen] = useState(false);
  const [showPreOnboarding, setShowPreOnboarding] = useState(false);
  const handleOpen = () => setOpen((prevState) => !prevState);
  const handlePreOnboarding = () => setShowPreOnboarding((prevState) => !prevState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { request } = useFetch();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const [currentInstance, setCurrentInstance] = useState<Instance | undefined>(undefined);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const { link, textKey } = useHelpLink('Channels');
  
  // Check if at least one channel is connected
  const hasAnyChannelConnected = currentInstance?.actualStatus?.name === 'Connected' || instagramConnected || facebookConnected;

  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  const checkGenerateInstance = (onDeleteInstance: any, onGenerateInstance: any, instances: any[]) => {
    const inactiveInstance = instances.find(instance => instance.state.name !== 'Active');
    if (inactiveInstance) {
      onDeleteInstance(inactiveInstance?.basePath, inactiveInstance?.id, false);
    }
    onGenerateInstance();
    trackingQRGeneration();
    return true;
  };
  const onGetBillingData = () => {
    return request<any>({
      url: API_ENDPOINTS.billing.billingData,
      method: 'GET',
    })
      .then(({ content }: { content: BillingDTO }) => {
        dispatch(setBillingData(content));
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-products',
        });
      });
  };
  const startTrial = () => {
    setIsLoading(true);
    return request<any>({
      url: API_ENDPOINTS.billing.activate,
      method: 'POST',
    })
      .then(async () => {
        trackingStartTrial();
        await onGetBillingData();
        setIsLoading(false);
        navigate('/conversations');
      })
      .catch((error) => {
        setIsLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-products',
        });
      });
  };
  
  return (
    <>
      <Page.Header
        title={t('app.title')}
        subtitle={t('instances.description')}
      >
        <Tag appearance="primary">
          <Text color="primary-textLow">
            {t('settings.step', { step: 4, total: 4 })}
          </Text>
        </Tag>
      </Page.Header>
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <Card padding="base">
              <Box display="flex" flexDirection="column" gap="4">
                  <InstancesDataProvider>
                    {({ loading, onGenerateInstance, qr, statusUpdate, instances, onDeleteInstance, cleanQr, onGetInstances, baileysEnabled }: any) => {
                      const { launchWhatsAppSignup } = useFacebookLogin(onGetInstances);
                      
                      useEffect(() => {
                        if (statusUpdate === 'connected') {
                          trackingWhatsappConnectSuccess();
                          cleanQr();
                          setOpen(false);
                          setCurrentInstance(instances[0]);
                        }
                      }, [statusUpdate]);

                      useEffect(() => {
                        if (instances.length === 0) {
                          setCurrentInstance(undefined);
                        }
                        if (instances[0]) {
                          setCurrentInstance(instances[0]);
                        }
                        // Check for Instagram instances
                        const hasInstagram = instances.some((inst: any) => 
                          inst.channelType === 'instagram' || inst.channelName === 'Instagram'
                        );
                        setInstagramConnected(hasInstagram);
                        
                        // Check for Facebook instances
                        const hasFacebook = instances.some((inst: any) => 
                          inst.channelType === 'facebook' || inst.channelName === 'Facebook'
                        );
                        setFacebookConnected(hasFacebook);
                      }, [instances]);

                      useEffect(() => {
                        if (qr) {
                          !open && handleOpen();
                        }
                      }, [qr]);
                      
                      const whatsappConnected = currentInstance?.actualStatus?.name === 'Connected';
                      
                      return (
                        <Box display="flex" flexDirection="column" gap="6">
                          {/* Header section - centralizado com hierarquia clara */}
                          <Box display="flex" flexDirection="column" gap="3" alignItems="center" textAlign="center">
                            <Title as="h3" color="danger-textHigh">Conecte seus canais de mensagens</Title>
                            <Text color="neutral-textLow" fontSize="base">
                              Escolha pelo menos um canal para começar a receber mensagens.
                            </Text>
                          </Box>

                          {/* Channels grid using ChannelCard */}
                          <Box 
                            display="grid" 
                            gap="4"
                            gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
                          >
                            {/* WhatsApp */}
                            <ChannelCard
                              channel="whatsapp"
                              status={whatsappConnected ? 'connected' : 'disconnected'}
                              onConnect={handlePreOnboarding}
                            />

                            {/* Instagram */}
                            <ChannelCard
                              channel="instagram"
                              status={instagramConnected ? 'connected' : 'disconnected'}
                              onConnect={() => navigate('/external/channels/instagram/onboarding')}
                            />

                            {/* Facebook */}
                            <ChannelCard
                              channel="facebook"
                              status={facebookConnected ? 'connected' : 'disconnected'}
                              onConnect={() => navigate('/external/channels/facebook/onboarding')}
                            />
                          </Box>

                          {/* WhatsApp Light Option (if enabled) */}
                          {baileysEnabled && !whatsappConnected && (
                            <Box display="flex" justifyContent="center" paddingTop="1">
                              <Link 
                                as="button" 
                                onClick={() => {
                                  trackingWhatsappBaileysConnect();
                                  checkGenerateInstance(onDeleteInstance, onGenerateInstance, instances);
                                }}
                              >
                                <Text fontSize="caption" color="primary-interactive">
                                  {t('instances.whatsappLight', 'Usar QR personal')}
                                </Text>
                              </Link>
                            </Box>
                          )}

                          {/* QR display area for WhatsApp Light */}
                          {qr && !whatsappConnected && (
                            <Card padding="base">
                              <Box display="flex" flexDirection="column" alignItems="center" gap="4">
                                <Title as="h4">Escaneie o código QR com o WhatsApp</Title>
                                <InstancesQR
                                  default_whatsapp={{ id: 3, name: "WhatsappBusiness" }}
                                  sholudRedirect={false}
                                  loading={loading}
                                  onGenerateQr={() => {}}
                                  qr={qr}
                                  onStatusUpdate={onGetInstances}
                                />
                              </Box>
                            </Card>
                          )}

                          {/* Modal QR WhatsApp Light */}
                          <Modal open={open} onDismiss={() => { handleOpen(); cleanQr(); }} padding="none" maxWidth="680px">
                            <Modal.Body padding="none">
                              <InstancesQR
                                loading={loading}
                                onGenerateQr={onGenerateInstance}
                                onStatusUpdate={statusUpdate}
                                qr={qr}
                                default_whatsapp={{ id: 2, name: "WhatsappBaileys" }}
                              />
                            </Modal.Body>
                          </Modal>

                          {/* Modal Pre-Onboarding WhatsApp Business */}
                          <Modal open={showPreOnboarding} onDismiss={() => setShowPreOnboarding(false)} maxWidth="680px">
                            <Modal.Body padding="none">
                              <WhatsAppPreOnboarding
                                onContinue={() => {
                                  setShowPreOnboarding(false);
                                  launchWhatsAppSignup();
                                }}
                                onCancel={() => setShowPreOnboarding(false)}
                              />
                            </Modal.Body>
                          </Modal>

                        </Box>
                      );
                    }}
                  </InstancesDataProvider>
                  
                  <PricingTermsCard />
              </Box>
            </Card>
            
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="4"
              paddingTop="2"
            >
              <Button appearance="neutral" onClick={prevStep}>
                {t('settings.previous-step')}
              </Button>
              <Button 
                onClick={startTrial} 
                appearance="primary" 
                disabled={!hasAnyChannelConnected}
              >
                {isLoading && (
                  <Spinner color="currentColor" size="small" />
                )}
                {t('pricing.start-trial')}
              </Button>
            </Box>
            
            {link && (
              <HelpLink>
                <Link
                  as="a"
                  onClick={() => {
                    trackingHelpLink({ source: 'Channels' });                    
                  }}
                  href={link}
                  target="_blank"
                  appearance="primary"
                  textDecoration="none"
                >
                  {t(textKey)}
                  <Icon source={<ExternalLinkIcon />} color="currentColor" />
                </Link>
              </HelpLink>
            )}
          </Layout.Section>
        </Layout>
      </Page.Body>
    </>
  );
};
export default Channels;
