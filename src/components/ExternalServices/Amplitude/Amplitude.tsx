import {useEffect} from 'react';
import amplitude from 'amplitude-js';
import {config} from './config';
import { nexo } from '@/app';
import {  getStoreInfo } from '@tiendanube/nexo';

function Amplitude(): null {
  useEffect(() => {
    const fetchStoreInfo = async () => {
      const storeInfo = await getStoreInfo(nexo);
      const userProperties = {
        store_id: storeInfo.id,
        country: storeInfo.country,
      };      
      amplitude.getInstance().init(config.apiKey);
      amplitude.getInstance().setUserProperties(userProperties);
      amplitude.getInstance().setUserId(storeInfo.id);
    };

    fetchStoreInfo();

    return () => {
      amplitude.getInstance().clearUserProperties();
    };
  }, []);

  return null;
}
export default Amplitude;