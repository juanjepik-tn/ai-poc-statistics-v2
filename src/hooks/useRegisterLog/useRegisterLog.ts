import { useCallback } from 'react';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { getStoreInfo } from '@tiendanube/nexo'; 
import { nexo } from '@/app';

const useRegisterLog = () => {
  const { request } = useFetch();
  const APP_SOURCE = 'nuvemchat-merchants-panel';

  const registerLog = useCallback(async ({ data, message, level }: { data: object; message: string; level: string }) => { // Add types for message and action
    const storeInfo = await getStoreInfo(nexo);
    const dataToSend = {
      source: APP_SOURCE,
      level: level,
      message: message,
      log: {
        store_id: storeInfo.id,
        timestamp: new Date().getTime(),
        data: data
      }
    };
    try {
      await request<any[]>({
        url: API_ENDPOINTS.logs.register,
        method: 'POST',
        data: dataToSend
      });
    } catch (error) {
      console.error(error);
    }
  }, [request]);

  return registerLog;
};

export default useRegisterLog;