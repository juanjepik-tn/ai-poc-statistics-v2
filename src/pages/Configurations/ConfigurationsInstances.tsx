import { Box, Button, Card, Link, Modal, Text, Title, Icon, Tag } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import InstancesQR from '../Instances/InstancesQR';

import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { trackingWhatsappBaileysConnect, trackingWhatsappConnectSuccess } from '@/tracking';
import InstancesDataProvider from '../Instances/InstancesDataProvider';
import InstanceCard from './components/InstanceCard';
import WhatsAppAlertsContainer from '@/components/FailedMessageAlertStatus/WhatsAppAlertsContainer';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { ChannelIcon } from '@/components';

const ConfigurationsInstances: React.FC = () => {
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [instance, setInstance] = useState<any>(null);
  const handleOpen = () => setOpen((prevState) => !prevState);
  const handleConfirmAlert = () => setConfirmAlert((prevState) => !prevState);
  const deleteInstance = (onDeleteInstance: any) => {
    onDeleteInstance(instance?.basePath, instance?.id);
    handleConfirmAlert();
  };

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
        {({ instances, statusUpdate, loading, onGenerateInstance, qr, onDeleteInstance, cleanQr, onGetInstances, baileysEnabled }: any) => {
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
          
          return (
            <Box gap="6" display="flex" flexDirection="column">
              <WhatsAppAlertsContainer />
              
              {/* ===== SECCIÓN WHATSAPP ===== */}
              <Box display="flex" flexDirection="column" gap="4">
                <Box display="flex" alignItems="center" gap="2">
                  <ChannelIcon channel="whatsapp" size="medium" />
                  <Title as="h4">WhatsApp</Title>
                </Box>
                
                {/* Card para conectar WhatsApp */}
                <Card padding="base">
                  <Card.Body>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap="2">
                      <Box display="flex" flexDirection="column" gap="1">
                        <Text fontWeight="bold">{t('instances.connect')}</Text>
                        <Text fontSize="caption" color="neutral-textLow">
                          Conectá tu cuenta de WhatsApp Business para gestionar tus conversaciones.
                        </Text>
                      </Box>
                      <Box display="flex" gap="2" flexDirection="column" alignItems="flex-end">
                        <Button onClick={launchWhatsAppSignup} appearance="primary">
                          {t('instances.connect-whatsapp-business')}
                        </Button>
                        {baileysEnabled && (
                          <Link as="button" onClick={() => {
                            trackingWhatsappBaileysConnect();
                            checkInstances(whatsappLightInstances, onGenerateInstance);
                          }}>
                            <Text fontSize="caption" color="primary-interactive">
                              {t('instances.whatsappLight')}
                            </Text>
                          </Link>   
                        )}
                      </Box>
                    </Box>
                  </Card.Body>
                </Card>

                {/* Lista de canales WhatsApp conectados */}
                {whatsappInstances.length > 0 && (
                  <Box
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                    gap="4"
                  >
                    {whatsappInstances.map((inst: any) => (
                      <InstanceCard
                        key={inst?.id}
                        instance={inst}
                        onDelete={() => {
                          setInstance(inst);
                          handleConfirmAlert();
                        }}
                        onGenerate={() => {
                          setInstance(inst);
                          onGenerateInstance(inst?.basePath, inst?.id);
                        }}
                        hasError={localStorage.getItem('failedChannelId') === String(inst?.id)}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* ===== SECCIÓN INSTAGRAM ===== */}
              <Box display="flex" flexDirection="column" gap="4">
                <Box display="flex" alignItems="center" gap="2">
                  <ChannelIcon channel="instagram" size="medium" />
                  <Title as="h4">Instagram</Title>
                  <Tag appearance="primary">Nuevo</Tag>
                </Box>
                
                {/* Card para conectar Instagram */}
                <Card padding="base">
                  <Card.Body>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap="4">
                      <Box display="flex" alignItems="center" gap="4">
                        {/* Instagram branded mini icon */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="48px"
                          height="48px"
                          borderRadius="base"
                          flexShrink="0"
                          style={{
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            boxShadow: '0 2px 8px rgba(225, 48, 108, 0.2)',
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width="40px"
                            height="40px"
                            borderRadius="base"
                            backgroundColor="neutral-background"
                          >
                            <ChannelIcon channel="instagram" size="small" />
                          </Box>
                        </Box>
                        
                        <Box display="flex" flexDirection="column" gap="1">
                          <Text fontWeight="bold">Conectar Instagram</Text>
                          <Text fontSize="caption" color="neutral-textLow">
                            Conectá tu cuenta de Instagram Business para gestionar tus mensajes directos.
                          </Text>
                        </Box>
                      </Box>
                      
                      <Button 
                        appearance="primary" 
                        onClick={() => navigate('/external/channels/instagram/onboarding')}
                      >
                        <Box display="flex" alignItems="center" gap="2">
                          <ChannelIcon channel="instagram" size="small" />
                          <Text color="currentColor">Conectar</Text>
                        </Box>
                      </Button>
                    </Box>
                  </Card.Body>
                </Card>

                {/* Lista de canales Instagram conectados */}
                {instagramInstances.length > 0 && (
                  <Box
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                    gap="4"
                  >
                    {instagramInstances.map((inst: any) => (
                      <InstanceCard
                        key={inst?.id}
                        instance={inst}
                        onDelete={() => {
                          setInstance(inst);
                          handleConfirmAlert();
                        }}
                        hasError={localStorage.getItem('failedChannelId') === String(inst?.id)}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* ===== SECCIÓN FACEBOOK MESSENGER ===== */}
              <Box display="flex" flexDirection="column" gap="4">
                <Box display="flex" alignItems="center" gap="2">
                  <ChannelIcon channel="facebook" size="medium" />
                  <Title as="h4">Facebook Messenger</Title>
                  <Tag appearance="primary">Nuevo</Tag>
                </Box>
                
                {/* Card para conectar Facebook */}
                <Card padding="base">
                  <Card.Body>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap="4">
                      <Box display="flex" alignItems="center" gap="4">
                        {/* Facebook branded mini icon */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="48px"
                          height="48px"
                          borderRadius="base"
                          flexShrink="0"
                          style={{
                            background: 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)',
                            boxShadow: '0 2px 8px rgba(24, 119, 242, 0.2)',
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width="40px"
                            height="40px"
                            borderRadius="base"
                            backgroundColor="neutral-background"
                          >
                            <ChannelIcon channel="facebook" size="small" />
                          </Box>
                        </Box>
                        
                        <Box display="flex" flexDirection="column" gap="1">
                          <Text fontWeight="bold">Conectar Facebook Messenger</Text>
                          <Text fontSize="caption" color="neutral-textLow">
                            Conectá tu página de Facebook para gestionar mensajes de Messenger.
                          </Text>
                          {instagramInstances.length > 0 && (
                            <Text fontSize="caption" color="success-textHigh">
                              ✓ Conexión simplificada: ya tenés Instagram conectado
                            </Text>
                          )}
                        </Box>
                      </Box>
                      
                      <Button 
                        appearance="primary" 
                        onClick={() => navigate('/external/channels/facebook/onboarding')}
                      >
                        <Box display="flex" alignItems="center" gap="2">
                          <ChannelIcon channel="facebook" size="small" />
                          <Text color="currentColor">Conectar</Text>
                        </Box>
                      </Button>
                    </Box>
                  </Card.Body>
                </Card>

                {/* Lista de canales Facebook conectados */}
                {facebookInstances.length > 0 && (
                  <Box
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                    gap="4"
                  >
                    {facebookInstances.map((inst: any) => (
                      <InstanceCard
                        key={inst?.id}
                        instance={inst}
                        onDelete={() => {
                          setInstance(inst);
                          handleConfirmAlert();
                        }}
                        hasError={localStorage.getItem('failedChannelId') === String(inst?.id)}
                      />
                    ))}
                  </Box>
                )}
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
              
              <ConfirmDeleteModal
                open={confirmAlert}
                onDismiss={handleConfirmAlert}
                onConfirm={() => deleteInstance(onDeleteInstance)}
                channelName={instance?.channelName}
              />
            </Box>
          );
        }}
      </InstancesDataProvider>
    </>
  );
};
export default ConfigurationsInstances;
