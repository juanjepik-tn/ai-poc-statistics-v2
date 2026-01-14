import React, { useEffect, useState } from 'react';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationInstanceUpdate, setNotificationQR } from '@/redux/slices/notification';
import { InstancesChannelDTO } from '@/types/instancesDTO';
import { trackingQRGeneration } from '@/tracking';

// POC Mode detection
const IS_POC_MODE = true; // Enable POC mock mode

const BAILEYS_ENABLED = 'nuvemchat-baileys-enabled';
const BAILEYS_DISABLED = 'nuvemchat-baileys-disabled';

// Mock QR code for POC mode
const MOCK_QR_CODE = 'https://wa.me/qr/MOCKQRCODE12345';

const InstancesDataProvider: React.FC<any> = ({
  children,
}) => {
  const { addToast } = useToast();
  const { request } = useFetch();
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [qr, setQr] = useState<string>('');
  const [statusUpdate, setStatusUpdate] = useState<string>('');
  const { t } = useTranslation('translations');
  const { notification, store } = useSelector((state: any) => ({
    notification: state.notification,
    store: state.store
  }));  
  
  const { default_whatsapp }: { default_whatsapp: InstancesChannelDTO } = store;
  const dispatch = useDispatch();
  const [baileysEnabled, setBaileysEnabled] = useState<boolean>(IS_POC_MODE ? true : false);

  useEffect(() => {
    if (notification.notification) {
      const QR = notification.notification;
      setQr(QR);     
      dispatch(setNotificationQR(''));
    }    
    if (notification.instanceState) {
      onGetInstances();
      const { event_name } = notification.instanceState;
      switch (event_name.toLowerCase()) {
        case 'auth_failed':
          addToast({
            type: 'danger',
            text: t('instances.conection-status.failed'),
            duration: 4000,
            id: 'error-config-messages',
          });
          setStatusUpdate('auth_failed');
          break;
        case 'disconnected':
          setStatusUpdate('disconnected');
          addToast({
            type: 'success',
            text: t('instances.conection-status.disconnected'),
            duration: 4000,
            id: 'update-messages-disconnected',
          });
          break;
        case 'ready':
          addToast({
            type: 'success',
            text: t('instances.conection-status.success'),
            duration: 4000,
            id: 'update-messages-ready',
          });
          setStatusUpdate('ready');
          break;
        case 'connected':
          setStatusUpdate('connected');
          addToast({
            type: 'success',
            text: t('instances.conection-status.connected'),
            duration: 4000,
            id: 'update-messages-connected',
          });
          break;
        case 'reconnecting':
          setStatusUpdate('reconnecting');
          addToast({
            type: 'success',
            text: t('instances.conection-status.reconnecting'),
            duration: 4000,
            id: 'update-messages-reconnecting',
          });
          break;
        default:
          break;
      }
      dispatch(setNotificationInstanceUpdate(''));
    }
  }, [notification, dispatch]);

  
  useEffect(() => {
    const handleServiceWorkerMessage = (event: any) => {
      if (event.data.type === 'notification') {
        const notificationData = event.data.payload;
        setQr(notificationData);        
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

 useEffect(() => {
  onGetInstances();
  checkBaileysStatus();
 }, []);

  const onGetInstances = () => {
    // POC Mode: Start with empty instances
    if (IS_POC_MODE) {
      // Don't set any instances by default - they start disconnected
      // Instances will be added when user "connects"
      return;
    }

    request<any[]>({
      url: API_ENDPOINTS.channel.list,
      method: 'GET',
    })
      .then(({content}) => {                      
       setInstances(content);
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-config-messages',
        });
      });
  };

  const onGenerateInstance = (basePath?: string, id?: string): Promise<boolean> => {
    setLoading(true);
    
    // POC Mode: Simulate QR generation
    if (IS_POC_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setQr(MOCK_QR_CODE);
          trackingQRGeneration();
          setLoading(false);
          addToast({
            type: 'success',
            text: t('instances.conection-status.ready'),    
            duration: 4000,
            id: 'update-messages',
          });
          
          // Simulate auto-connection after 3 seconds (for demo purposes)
          setTimeout(() => {
            const mockInstance = {
              id: `mock-wa-${Date.now()}`,
              basePath: 'whatsapp',
              channelName: 'WhatsappBusiness',
              channelType: 'whatsapp',
              phoneNumber: '+54 9 11 1234-5678',
              state: { name: 'Active' },
              actualStatus: { name: 'Connected' },
              createdAt: new Date().toISOString(),
            };
            setInstances([mockInstance]);
            setStatusUpdate('connected');
            setQr('');
            addToast({
              type: 'success',
              text: t('instances.conection-status.connected'),
              duration: 4000,
              id: 'update-messages-connected',
            });
          }, 3000);
          
          resolve(true);
        }, 1000);
      });
    }

    return request<any>({
       url: (basePath && id) ? API_ENDPOINTS.channel.qr(basePath, id) : API_ENDPOINTS.whatsapp.createWhatsappBaileys,
       method: 'POST',
     })
       .then(({content}: any) => {
          if (content?.data){
            setQr(content.data);
          }          
          trackingQRGeneration();
         setLoading(false);   
         addToast({
          type: 'success',
          text: t('instances.conection-status.ready'),    
          duration: 4000,
          id: 'update-messages',
        });               
         return true;              
       })
       .catch((error) => {    
         setLoading(false);
         addToast({
           type: 'danger',
           text: error.message.description ?? error.message,
           duration: 4000,
           id: 'error-update-messages',
          });         
          return false;     
       });
  };

  const onDeleteInstance = (basePath: string, id: string, showToast: boolean = true): Promise<boolean> => {
    setLoading(true);
    
    // POC Mode: Simulate deletion
    if (IS_POC_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setInstances([]);
          setStatusUpdate('');
          setLoading(false);
          if (showToast) {
            addToast({
              type: 'success',
              text: t('instances.deleted'),    
              duration: 4000,
              id: 'update-messages',
            });
          }
          resolve(true);
        }, 500);
      });
    }

    return request<any>({
       url: API_ENDPOINTS.channel.delete(basePath, id),
       method: 'DELETE',
     })
       .then(() => {
         setLoading(false);   
         onGetInstances();
         setStatusUpdate('');
         if (showToast) {
          addToast({
            type: 'success',
            text: t('instances.deleted'),    
            duration: 4000,
            id: 'update-messages',
          });               
         }
         return true;              
       })
       .catch((error) => {    
         setLoading(false);
         addToast({
           type: 'danger',
           text: error.message.description ?? error.message,
           duration: 4000,
           id: 'error-update-messages',
          });         
          return false;     
       });
  };

  const cleanQr = () => {
    setQr('');
  };

  const onDisconnectInstance = (id: string): Promise<boolean> => {
    setLoading(true);
    
    // POC Mode: Simulate disconnection
    if (IS_POC_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setInstances([]);
          setLoading(false);
          addToast({
            type: 'success',
            text: t('instances.deleted'),    
            duration: 4000,
            id: 'update-messages',
          });
          resolve(true);
        }, 500);
      });
    }

    return request<any>({
       url: API_ENDPOINTS.whatsappBusiness.disconnect(id),
       method: 'GET',
     })
       .then(() => {
         setLoading(false);   
         onGetInstances();

          addToast({
            type: 'success',
            text: t('instances.deleted'),    
            duration: 4000,
            id: 'update-messages',
          });               
         
         return true;              
       })
       .catch((error) => {    
         setLoading(false);
         addToast({
           type: 'danger',
           text: error.message.description ?? error.message,
           duration: 4000,
           id: 'error-update-messages',
          });         
          return false;     
       });
  };

  const checkBaileysStatus = (): Promise<boolean> => {
    // POC Mode: Always enable Baileys
    if (IS_POC_MODE) {
      setBaileysEnabled(true);
      return Promise.resolve(true);
    }

    const checkEnabled = request<any>({
      url: API_ENDPOINTS.store.hasTag(BAILEYS_ENABLED),
      method: 'GET',
    }).then(({ content }: any) => content?.has_tag || false)
      .catch(() => false);

    const checkDisabled = request<any>({
      url: API_ENDPOINTS.store.hasTag(BAILEYS_DISABLED),
      method: 'GET',
    }).then(({ content }: any) => content?.has_tag || false)
      .catch(() => false);

    return Promise.all([checkEnabled, checkDisabled])
      .then(([hasEnabledTag, hasDisabledTag]) => {
        const isEnabled = hasEnabledTag && !hasDisabledTag;
        setBaileysEnabled(isEnabled);
        return true;
      })
      .catch((error) => {
        setBaileysEnabled(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-baileys-check',
        });
        return false;
      });
  };

  return children({ 
    instances, 
    onGenerateInstance, 
    loading, 
    qr, 
    statusUpdate, 
    onDeleteInstance, 
    cleanQr, 
    onGetInstances, 
    onDisconnectInstance, 
    default_whatsapp, 
    baileysEnabled 
  });
};

export default InstancesDataProvider;
