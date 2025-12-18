import { Box, Button, Card, Link, Modal, Text, Title } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InstancesQR from '../Instances/InstancesQR';

import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { trackingWhatsappBaileysConnect, trackingWhatsappConnectSuccess } from '@/tracking';
import InstancesDataProvider from '../Instances/InstancesDataProvider';
import InstanceCard from './components/InstanceCard';
import WhatsAppAlertsContainer from '@/components/FailedMessageAlertStatus/WhatsAppAlertsContainer';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';

const ConfigurationsInstances: React.FC = () => {
  const { t } = useTranslation('translations');
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
          const whatsappLightInstances = instances.filter((instance: any) => instance.channelName === "WhatsappBaileys");         
          const { launchWhatsAppSignup } = useFacebookLogin(onGetInstances);
          useEffect(() => {
            if (statusUpdate === 'connected') {
              // handleOpen();
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
              <Box display="flex" justifyContent="flex-end">
                <Card padding="base">
                  <Card.Body>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap="2">
                      <Box display="flex" flexDirection="column" gap="2">
                        <Box display="flex" alignItems="center" gap="2">
                          <Title as="h5">{t('instances.connect')}</Title>                          
                        </Box>                       
                      </Box>
                      <Box display="flex" gap="2" flexDirection="column" alignItems="center">
                        <Button onClick={launchWhatsAppSignup} appearance="primary">
                          {t('instances.connect-whatsapp-business')}
                        </Button>
                        {baileysEnabled && <Link as="a" onClick={() => {
                          trackingWhatsappBaileysConnect();
                          checkInstances(whatsappLightInstances, onGenerateInstance);
                        }}>
                          <Text fontSize="caption" lineHeight="base" textAlign="left">
                            {t('instances.whatsappLight')}
                          </Text>
                        </Link>   
                        }
                      </Box>
                    </Box>
                  </Card.Body>
                </Card>
              </Box>
         
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(2, 1fr)',
                }}
                gap="6"
              >
         
                {instances.map((instance: any) => (
                  <InstanceCard
                    key={instance?.id}
                    instance={instance}
                    onDelete={() => {
                      setInstance(instance);
                      handleConfirmAlert();
                    }}
                    onGenerate={() => {
                      setInstance(instance);
                      onGenerateInstance(instance?.basePath, instance?.id);
                    }}
                    hasError={localStorage.getItem('failedChannelId') === String(instance?.id)}
                  />
                ))}
              </Box>
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
