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
import { useFetch, useHelpLink, useWindowWidth } from '@/hooks';
import { Instance } from '@/pages/Configurations/components/InstanceCard';
import InstancesDataProvider from '@/pages/Instances/InstancesDataProvider';
import InstancesQR from '@/pages/Instances/InstancesQR';
import { setBillingData } from '@/redux/slices/billing';
import { trackingHelpLink, trackingQRGeneration, trackingStartTrial, trackingWhatsappBaileysConnect, trackingWhatsappConnectSuccess } from '@/tracking';
import { BillingDTO } from '@/types/billingDTO';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PricingTermsCard } from '../Pricing/PricingTermsCard';
import ConversationNavSkeleton from './ConversationNavSkeleton';
import InstanceSuccessCard from './InstanceSuccessCard';
import { ExternalLinkIcon } from '@nimbus-ds/icons';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';

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
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== null && windowWidth <= 768;
  const [currentInstance, setCurrentInstance] = useState<Instance | undefined>(undefined);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const deleteInstanceRef = React.useRef<{ basePath: string; instanceId: string; onDelete: (basePath: string, instanceId: string, redirect: boolean) => void } | null>(null);
  const { link, textKey } = useHelpLink('Channels');

  const handleOpenDeleteModal = (basePath: string, instanceId: string, onDeleteInstance: any) => {
    deleteInstanceRef.current = { basePath, instanceId, onDelete: onDeleteInstance };
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteInstanceRef.current) {
      deleteInstanceRef.current.onDelete(deleteInstanceRef.current.basePath, deleteInstanceRef.current.instanceId, false);
      setCurrentInstance(undefined);
    }
    setConfirmDeleteOpen(false);
    deleteInstanceRef.current = null;
  };

  const handleDismissDelete = () => {
    setConfirmDeleteOpen(false);
    deleteInstanceRef.current = null;
  };

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
              <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap="2">
                {!isMobile && <ConversationNavSkeleton />}
                <InstancesDataProvider>
                  {({ loading, onGenerateInstance, qr, statusUpdate, instances, onDeleteInstance, cleanQr, onGetInstances, baileysEnabled}: any) => {
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
                    }, [instances]);

                    useEffect(() => {
                      if (qr) {
                        !open && handleOpen();
                      }
                    }, [qr]);
                    return (
                      <Box display="flex" flexDirection="column" gap="2" justifyContent="center">
                        {currentInstance ? <InstanceSuccessCard
                          onDelete={(basePath, instanceId) => {
                            handleOpenDeleteModal(basePath, instanceId, onDeleteInstance);
                          }}
                          instance={currentInstance}
                        /> :
                          <Card>
                            <Box
                              padding="2"
                              display="flex"
                              flexDirection="column"
                              gap="2"
                              alignItems="center"
                            >
                              <InstancesQR
                                default_whatsapp={{ id: 3, name: "WhatsappBusiness" }}
                                sholudRedirect={false}
                                loading={loading}
                                onGenerateQr={() => checkGenerateInstance(onDeleteInstance, onGenerateInstance, instances)}
                                qr={qr}
                                onStatusUpdate={onGetInstances}
                              />
                              {baileysEnabled && <Link as="a" onClick={() => {
                                trackingWhatsappBaileysConnect();
                                handleOpen();
                              }} fontSize="caption">
                                {t('instances.whatsappLight')}
                              </Link>}
                            </Box>
                          </Card>
                        }
                        <PricingTermsCard />
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

                      </Box>
                    );
                  }}

                </InstancesDataProvider>

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
              <Button onClick={startTrial} appearance="primary" disabled={!currentInstance || currentInstance.actualStatus.name !== 'Connected'}>
                {isLoading && (
                  <Spinner color="currentColor" size="small" />
                )}
                {
                  t('pricing.start-trial')
                }
              </Button>
            </Box>
            {link && (
              <HelpLink>
                <Link
                  as="a"
                  onClick={(e) => {
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
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onDismiss={handleDismissDelete}
        onConfirm={handleConfirmDelete}
        channelName={currentInstance?.channelName}
      />
    </>
  );
};
export default Channels;
