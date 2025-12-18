import { useCallback, useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';

const HUMAN_SUPPORT_FLAG = 'nuvem-chat-action-rules-frontend-enabled';

interface UseFeatureFlagResult {
  isHumanSupportEnabled: boolean;
  loading: boolean;
}

const useFeatureFlag = (): UseFeatureFlagResult => {
  const { request } = useFetch();
  const [isHumanSupportEnabled, setIsHumanSupportEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkHumanSupportFlag = useCallback((): Promise<boolean> => {
    setLoading(true);
    return request<any>({
      url: API_ENDPOINTS.store.hasTag(HUMAN_SUPPORT_FLAG),
      method: 'GET',
    })
      .then(({ content }: any) => {
        const { has_tag } = content;
        setIsHumanSupportEnabled(has_tag || false);
        setLoading(false);
        return has_tag || false;
      })
      .catch(() => {
        setIsHumanSupportEnabled(false);
        setLoading(false);
        return false;
      });
  }, [request]);

  useEffect(() => {
    checkHumanSupportFlag();
  }, [checkHumanSupportFlag]);

  return { isHumanSupportEnabled, loading };
};

export default useFeatureFlag;

