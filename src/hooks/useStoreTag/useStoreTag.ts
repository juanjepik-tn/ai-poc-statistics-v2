import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios, { API_ENDPOINTS } from '@/app/Axios/Axios';
import { setTag } from '@/redux/slices/tags';

export const useStoreTag = (tagName: string): boolean => {
  const dispatch = useDispatch();

  const alreadyChecked = useSelector((state: any) => tagName in (state.tags || {}));

  useEffect(() => {
    if (alreadyChecked) return;

    const checkFeatureFlag = async () => {
      try {
        const response = await axios.get<any>(API_ENDPOINTS.store.hasTag(tagName));
        dispatch(setTag({ 
          tagName, 
          hasTag: response.data?.has_tag || false 
        }));
      } catch (error) {
        // On error, default to disabled
        dispatch(setTag({ 
          tagName, 
          hasTag: false 
        }));
      }
    };

    checkFeatureFlag();
  }, [dispatch, tagName, alreadyChecked]);

  const hasTag = useSelector((state: any) => state.tags[tagName]);
  return hasTag ?? false;
};

