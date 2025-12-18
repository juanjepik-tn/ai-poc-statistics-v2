import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { setStoreInfo } from '@/redux/slices/store';
import { useToast } from '@nimbus-ds/components';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from '@/hooks';
import { RootState } from '@/redux/store';

type StoreDetails = {
  address: string | null;
  agree_to_use_information_from_store: boolean | null;
  billingPlan: string;
  category: string | null;
  channelsList: Array<{ [key: string]: any }>;
  contact_email: string | null;
  country: string;
  currency: string;
  description: string | null;
  email: string;
  emojies: boolean;
  ia_language: string | null;
  ia_operation_mode: {
    name: string;
    number: number;
    created_at: string;
  } | null;
  ia_personality: string | null;
  ia_personalization: string;
  ia_purpose: string | null;
  ia_response_length: {
    id: number;
    name: string;
    created_at: string;
    default_option: boolean;
    prompt: string;
  } | null;
  ia_tone: string | null;
  id: number;
  language: string;
  name: string;
  personality_traits: string[];
  plan_name: string;
  remote_store_id: number;
  services: {
    payment: boolean;
    products: boolean;
    shipping: boolean;
  };
  start_date: string | null;
  state: any[];
  tools: {
    customize_order: boolean;
    wholesale_order: boolean;
    get_order_status: boolean;
    delivery_coordination: boolean;
    modify_order_in_progress: boolean;
  };
  url: string;
};

const useStoreDetails = () => {
  const storeDetails = useSelector((state: RootState) => state.store) as StoreDetails | null;
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { request } = useFetch();

  const getStoreDetails = () => {
    return request<any>({
      url: API_ENDPOINTS.store.info,
      method: 'GET',
    })
      .then(({ content }: any) => {
        dispatch(setStoreInfo(content));
      })
      .catch((error: any) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-operation-mode',
        });
      });
  };

  return { storeDetails, getStoreDetails };
};

export default useStoreDetails;