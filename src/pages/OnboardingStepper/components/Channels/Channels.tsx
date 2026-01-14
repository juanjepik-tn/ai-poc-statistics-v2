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
// import { useNavigate } from 'react-router-dom';

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
import { ChannelIcon } from '@/components';

type ChannelsProps = {
  prevStep: () => void;
}
const Channels: React.FC<ChannelsProps> = ({ prevStep }) => {
  const { t } = useTranslation('translations');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prevState) => !prevState);
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
                      const connectedCount = [whatsappConnected, instagramConnected, facebookConnected].filter(Boolean).length;
                      
                      return (
                        <Box display="flex" flexDirection="column" gap="6">
                          {/* Header section */}
                          <Box display="flex" flexDirection="column" gap="2" alignItems="center" textAlign="center">
                            <Title as="h3">Conectá tus canales de mensajería</Title>
                            <Text color="neutral-textLow" fontSize="base">
                              Elegí al menos un canal para comenzar a recibir mensajes. Podés agregar más después.
                            </Text>
                            {connectedCount > 0 && (
                              <Tag appearance="success">
                                {connectedCount} {connectedCount === 1 ? 'canal conectado' : 'canales conectados'}
                              </Tag>
                            )}
                          </Box>

                          {/* Channels grid */}
                          <Box 
                            display="grid" 
                            gap="4"
                            gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
                          >
                            {/* ===== WHATSAPP CARD ===== */}
                            <Card padding="base">
                              <Box display="flex" flexDirection="column" gap="3" alignItems="center" padding="2">
                                {/* Icon */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  width="56px"
                                  height="56px"
                                  borderRadius="full"
                                  style={{
                                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="46px"
                                    height="46px"
                                    borderRadius="full"
                                    backgroundColor="neutral-background"
                                  >
                                    <ChannelIcon channel="whatsapp" size="medium" />
                                  </Box>
                                </Box>
                                
                                {/* Title */}
                                <Box display="flex" alignItems="center" gap="1">
                                  <Text fontWeight="bold" fontSize="highlight">WhatsApp</Text>
                                </Box>
                                
                                {/* Description */}
                                <Text textAlign="center" color="neutral-textLow" fontSize="caption">
                                  Conectá tu WhatsApp Business para atender clientes
                                </Text>
                                
                                {/* Status/Action */}
                                {whatsappConnected ? (
                                  <Box 
                                    display="flex" 
                                    alignItems="center" 
                                    gap="1" 
                                    padding="2"
                                    paddingLeft="3"
                                    paddingRight="3"
                                    backgroundColor="success-surface"
                                    borderRadius="full"
                                  >
                                    <Text color="success-textHigh" fontSize="caption" fontWeight="medium">
                                      ✓ Conectado
                                    </Text>
                                  </Box>
                                ) : (
                                  <Box display="flex" flexDirection="column" gap="2" alignItems="center" width="100%">
                                    <Button 
                                      appearance="primary"
                                      onClick={() => checkGenerateInstance(onDeleteInstance, onGenerateInstance, instances)}
                                    >
                                      Conectar
                                    </Button>
                                    {baileysEnabled && (
                                      <Link as="button" onClick={() => {
                                        trackingWhatsappBaileysConnect();
                                        handleOpen();
                                      }} fontSize="caption">
                                        Usar QR personal
                                      </Link>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Card>

                            {/* ===== INSTAGRAM CARD ===== */}
                            <Card padding="base">
                              <Box display="flex" flexDirection="column" gap="3" alignItems="center" padding="2" position="relative">
                                {/* New tag */}
                                <Box position="absolute" style={{ top: '-4px', right: '-4px' }}>
                                  <Tag appearance="primary">Nuevo</Tag>
                                </Box>
                                
                                {/* Icon */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  width="56px"
                                  height="56px"
                                  borderRadius="full"
                                  style={{
                                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                    boxShadow: '0 4px 12px rgba(225, 48, 108, 0.3)',
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="46px"
                                    height="46px"
                                    borderRadius="full"
                                    backgroundColor="neutral-background"
                                  >
                                    <ChannelIcon channel="instagram" size="medium" />
                                  </Box>
                                </Box>
                                
                                {/* Title */}
                                <Text fontWeight="bold" fontSize="highlight">Instagram</Text>
                                
                                {/* Description */}
                                <Text textAlign="center" color="neutral-textLow" fontSize="caption">
                                  Respondé mensajes directos de Instagram Business
                                </Text>
                                
                                {/* Status/Action */}
                                {instagramConnected ? (
                                  <Box 
                                    display="flex" 
                                    alignItems="center" 
                                    gap="1" 
                                    padding="2"
                                    paddingLeft="3"
                                    paddingRight="3"
                                    backgroundColor="success-surface"
                                    borderRadius="full"
                                  >
                                    <Text color="success-textHigh" fontSize="caption" fontWeight="medium">
                                      ✓ Conectado
                                    </Text>
                                  </Box>
                                ) : (
                                  <Button 
                                    appearance="primary"
                                    onClick={() => navigate('/external/channels/instagram/onboarding')}
                                  >
                                    Conectar
                                  </Button>
                                )}
                              </Box>
                            </Card>

                            {/* ===== FACEBOOK CARD ===== */}
                            <Card padding="base">
                              <Box display="flex" flexDirection="column" gap="3" alignItems="center" padding="2" position="relative">
                                {/* New tag */}
                                <Box position="absolute" style={{ top: '-4px', right: '-4px' }}>
                                  <Tag appearance="primary">Nuevo</Tag>
                                </Box>
                                
                                {/* Icon */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  width="56px"
                                  height="56px"
                                  borderRadius="full"
                                  style={{
                                    background: 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)',
                                    boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)',
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="46px"
                                    height="46px"
                                    borderRadius="full"
                                    backgroundColor="neutral-background"
                                  >
                                    <ChannelIcon channel="facebook" size="medium" />
                                  </Box>
                                </Box>
                                
                                {/* Title */}
                                <Text fontWeight="bold" fontSize="highlight">Messenger</Text>
                                
                                {/* Description */}
                                <Text textAlign="center" color="neutral-textLow" fontSize="caption">
                                  Atendé mensajes de tu página de Facebook
                                </Text>
                                
                                {/* Simplified notice */}
                                {instagramConnected && !facebookConnected && (
                                  <Text fontSize="caption" color="success-textHigh">
                                    ✓ Conexión rápida
                                  </Text>
                                )}
                                
                                {/* Status/Action */}
                                {facebookConnected ? (
                                  <Box 
                                    display="flex" 
                                    alignItems="center" 
                                    gap="1" 
                                    padding="2"
                                    paddingLeft="3"
                                    paddingRight="3"
                                    backgroundColor="success-surface"
                                    borderRadius="full"
                                  >
                                    <Text color="success-textHigh" fontSize="caption" fontWeight="medium">
                                      ✓ Conectado
                                    </Text>
                                  </Box>
                                ) : (
                                  <Button 
                                    appearance="primary"
                                    onClick={() => navigate('/external/channels/facebook/onboarding')}
                                  >
                                    Conectar
                                  </Button>
                                )}
                              </Box>
                            </Card>
                          </Box>

                          {/* QR display area for WhatsApp */}
                          {qr && !whatsappConnected && (
                            <Card padding="base">
                              <Box display="flex" flexDirection="column" alignItems="center" gap="4" padding="4">
                                <Text fontWeight="bold">Escaneá el código QR con WhatsApp</Text>
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
                          <Modal open={open} onDismiss={() => { handleOpen(); cleanQr(); }} padding="none" maxWidth="600px">
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
                        </Box>
                      );
                    }}
                  </InstancesDataProvider>
                  
                  <PricingTermsCard />
              </Box>
            </Card>
            
            <Box
              alignSelf="flex-end"
              display="flex"
              justifyContent="space-between"
              gap="2"
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
