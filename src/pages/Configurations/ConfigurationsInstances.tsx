import { Box, Button, Card, Icon, Link, Modal, Text, Title, Tag } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '@nimbus-ds/icons';

import InstancesQR from '../Instances/InstancesQR';

import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { trackingWhatsappBaileysConnect, trackingWhatsappConnectSuccess } from '@/tracking';
import InstancesDataProvider from '../Instances/InstancesDataProvider';
import WhatsAppAlertsContainer from '@/components/FailedMessageAlertStatus/WhatsAppAlertsContainer';
import { ChannelIcon } from '@/components';
import WhatsAppPreOnboarding from '../OnboardingStepper/components/Channels/WhatsAppPreOnboarding';

const ConfigurationsInstances: React.FC = () => {
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPreOnboarding, setShowPreOnboarding] = useState(false);
  const handleOpen = () => setOpen((prevState) => !prevState);
  const handlePreOnboarding = () => setShowPreOnboarding((prevState) => !prevState);

  const checkInstances = (instances: any, onGenerateQr: any) => {
    if (instances.length > 0) {
      // if all instances are active, show the button to create a new instance
      const allInstancesActive = instances.every((instance: any) => instance.state.name === 'Active');
      if (allInstancesActive) {
        handleOpen();
      } else {
        // if there is at least one instance inactive, reuse it
        const inactiveInstance = instances.find((instance: any) => instance.state.name !== 'Active');
        if (inactiveInstance) {
          onGenerateQr(inactiveInstance?.basePath, inactiveInstance?.id);
        }
      }
    } else {
      handleOpen();
    }
  };

  return (
    <>
      <InstancesDataProvider>
        {({ instances, statusUpdate, loading, onGenerateInstance, qr, cleanQr, onGetInstances, baileysEnabled }: any) => {
          // Separar instancias por tipo de canal
          const whatsappInstances = instances.filter((instance: any) => 
            instance.channelType === 'whatsapp' || 
            instance.channelName === 'WhatsAppBusiness' || 
            instance.channelName === 'WhatsappBaileys'
          );
          const instagramInstances = instances.filter((instance: any) => 
            instance.channelType === 'instagram' || 
            instance.channelName === 'Instagram'
          );
          const facebookInstances = instances.filter((instance: any) => 
            instance.channelType === 'facebook' || 
            instance.channelName === 'Facebook'
          );
          const whatsappLightInstances = whatsappInstances.filter((instance: any) => instance.channelName === "WhatsappBaileys");         
          const { launchWhatsAppSignup } = useFacebookLogin(onGetInstances);
          
          useEffect(() => {
            if (statusUpdate === 'connected') {
              trackingWhatsappConnectSuccess();
              setOpen(false);
            }
          }, [statusUpdate]);
          useEffect(() => {
            if (qr) {
              !open && handleOpen();
            }
          }, [qr]);

          // Status helpers
          const instagramConnected = instagramInstances.length > 0;
          const facebookConnected = facebookInstances.length > 0;
          
          // Helper para obter identificador da instância
          const getInstanceIdentifier = (inst: any) => {
            if (inst.phoneNumber) return inst.phoneNumber;
            if (inst.phone) return inst.phone;
            if (inst.pageName) return inst.pageName;
            if (inst.username) return inst.username;
            return inst.id;
          };

          // Helper para verificar se está conectado
          const isInstanceConnected = (inst: any) => {
            return inst.actualStatus?.name === 'Connected' || inst.state?.name === 'Active';
          };

          return (
            <Box display="flex" flexDirection="column" gap="6">
              {/* Alertas (se houver) */}
              <WhatsAppAlertsContainer />
              
              {/* Header da seção com contador */}
              <Box display="flex" flexDirection="column" gap="4">
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="2">
                  <Box display="flex" flexDirection="column" gap="1">
                    <Title as="h3">Canales de Mensajería</Title>
                    <Text fontSize="base" color="neutral-textLow">
                      Conectá y gestioná tus canales de comunicación
                    </Text>
                  </Box>
                </Box>

                {/* WhatsApp Section */}
                <Card padding="base">
                  <Box display="flex" flexDirection="column" gap="4">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="3">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="40px"
                          height="40px"
                          borderRadius="full"
                          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                        >
                          <ChannelIcon channel="whatsapp" size="medium" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Title as="h4">WhatsApp</Title>
                          <Text fontSize="caption" color="neutral-textLow">
                            {whatsappInstances.length} número{whatsappInstances.length !== 1 ? 's' : ''} conectado{whatsappInstances.length !== 1 ? 's' : ''}
                          </Text>
                        </Box>
                      </Box>
                      <Button 
                        appearance="primary" 
                        size="small"
                        onClick={handlePreOnboarding}
                      >
                        <Icon source={<PlusCircleIcon size={16} />} color="currentColor" />
                        Agregar número
                      </Button>
                    </Box>
                    
                    {/* Lista de números WhatsApp */}
                    {whatsappInstances.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap="2">
                        {whatsappInstances.map((inst: any) => (
                          <Box 
                            key={inst.id}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            padding="3"
                            borderRadius="base"
                            backgroundColor="neutral-surface"
                          >
                            <Box display="flex" alignItems="center" gap="3">
                              <Box display="flex" flexDirection="column">
                                <Text fontWeight="medium">{getInstanceIdentifier(inst)}</Text>
                                <Box display="flex" gap="2" alignItems="center">
                                  <Tag appearance={isInstanceConnected(inst) ? 'success' : 'warning'} size="small">
                                    {isInstanceConnected(inst) ? 'Conectado' : 'Desconectado'}
                                  </Tag>
                                  {inst.channelName === 'WhatsAppBusiness' && (
                                    <Tag appearance="primary" size="small">Business</Tag>
                                  )}
                                  {inst.channelName === 'WhatsappBaileys' && (
                                    <Tag appearance="neutral" size="small">Light</Tag>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="4"
                        borderRadius="base"
                        backgroundColor="neutral-surface"
                      >
                        <Text color="neutral-textLow">No hay números conectados</Text>
                      </Box>
                    )}
                    
                    {/* WhatsApp Light Option */}
                    {baileysEnabled && (
                      <Box display="flex" justifyContent="center">
                        <Link 
                          as="button" 
                          onClick={() => {
                            trackingWhatsappBaileysConnect();
                            checkInstances(whatsappLightInstances, onGenerateInstance);
                          }}
                        >
                          <Text fontSize="caption" color="primary-interactive">
                            {t('instances.whatsappLight')}
                          </Text>
                        </Link>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Instagram Section */}
                <Card padding="base">
                  <Box display="flex" flexDirection="column" gap="4">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="3">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="40px"
                          height="40px"
                          borderRadius="full"
                          style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                        >
                          <ChannelIcon channel="instagram" size="medium" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Title as="h4">Instagram</Title>
                          <Text fontSize="caption" color="neutral-textLow">
                            {instagramInstances.length} cuenta{instagramInstances.length !== 1 ? 's' : ''} conectada{instagramInstances.length !== 1 ? 's' : ''}
                          </Text>
                        </Box>
                      </Box>
                      <Button 
                        appearance="primary" 
                        size="small"
                        onClick={() => navigate('/external/channels/instagram/onboarding')}
                      >
                        <Icon source={<PlusCircleIcon size={16} />} color="currentColor" />
                        Agregar cuenta
                      </Button>
                    </Box>
                    
                    {/* Lista de cuentas Instagram */}
                    {instagramInstances.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap="2">
                        {instagramInstances.map((inst: any) => (
                          <Box 
                            key={inst.id}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            padding="3"
                            borderRadius="base"
                            backgroundColor="neutral-surface"
                          >
                            <Box display="flex" alignItems="center" gap="3">
                              <Box display="flex" flexDirection="column">
                                <Text fontWeight="medium">{getInstanceIdentifier(inst)}</Text>
                                <Tag appearance={isInstanceConnected(inst) ? 'success' : 'warning'} size="small">
                                  {isInstanceConnected(inst) ? 'Conectado' : 'Desconectado'}
                                </Tag>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="4"
                        borderRadius="base"
                        backgroundColor="neutral-surface"
                      >
                        <Text color="neutral-textLow">No hay cuentas conectadas</Text>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Facebook Messenger Section */}
                <Card padding="base">
                  <Box display="flex" flexDirection="column" gap="4">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="3">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="40px"
                          height="40px"
                          borderRadius="full"
                          style={{ background: 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)' }}
                        >
                          <ChannelIcon channel="facebook" size="medium" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Title as="h4">Messenger</Title>
                          <Text fontSize="caption" color="neutral-textLow">
                            {facebookInstances.length} página{facebookInstances.length !== 1 ? 's' : ''} conectada{facebookInstances.length !== 1 ? 's' : ''}
                          </Text>
                        </Box>
                      </Box>
                      <Button 
                        appearance="primary" 
                        size="small"
                        onClick={() => navigate('/external/channels/facebook/onboarding')}
                      >
                        <Icon source={<PlusCircleIcon size={16} />} color="currentColor" />
                        Agregar página
                      </Button>
                    </Box>
                    
                    {/* Lista de páginas Facebook */}
                    {facebookInstances.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap="2">
                        {facebookInstances.map((inst: any) => (
                          <Box 
                            key={inst.id}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            padding="3"
                            borderRadius="base"
                            backgroundColor="neutral-surface"
                          >
                            <Box display="flex" alignItems="center" gap="3">
                              <Box display="flex" flexDirection="column">
                                <Text fontWeight="medium">{getInstanceIdentifier(inst)}</Text>
                                <Tag appearance={isInstanceConnected(inst) ? 'success' : 'warning'} size="small">
                                  {isInstanceConnected(inst) ? 'Conectado' : 'Desconectado'}
                                </Tag>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="4"
                        borderRadius="base"
                        backgroundColor="neutral-surface"
                      >
                        <Text color="neutral-textLow">No hay páginas conectadas</Text>
                      </Box>
                    )}
                    
                    {/* Quick connect notice */}
                    {instagramConnected && !facebookConnected && (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="2"
                        borderRadius="base"
                        backgroundColor="primary-surface"
                      >
                        <Text fontSize="caption" color="primary-textHigh">
                          Conectá rápidamente usando tu cuenta de Instagram
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Box>

              {/* Modal QR WhatsApp */}
              <Modal open={open} onDismiss={() => { handleOpen(); cleanQr(); }} padding="none" maxWidth="752px">
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
              <Modal open={showPreOnboarding} onDismiss={handlePreOnboarding} maxWidth="680px">
                <Modal.Body padding="none">
                  <WhatsAppPreOnboarding 
                    onContinue={() => {
                      handlePreOnboarding();
                      launchWhatsAppSignup();
                    }}
                    onCancel={handlePreOnboarding}
                  />
                </Modal.Body>
              </Modal>
            </Box>
          );
        }}
      </InstancesDataProvider>
    </>
  );
};
export default ConfigurationsInstances;
