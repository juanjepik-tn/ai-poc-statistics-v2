import { useMemo } from 'react';
import { IConversationMessage, MetaStatusHistoryEntry } from '../../../types/conversation';

const META_STATUS_FAILED = 'failed';
const META_STATUS_API_ERROR = 'api_error';

export const useIsMessageFailed = (message: IConversationMessage): boolean => {
  const isMessageFailed = useMemo(() => {
    if (!message?.meta_status_history || message.meta_status_history.length === 0) {
      return false;
    }
    
    // sort by most recent first
    const sortedHistory = [...message.meta_status_history].sort(
      (a: MetaStatusHistoryEntry, b: MetaStatusHistoryEntry) => {
        return parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10);
      }
    );
    
    const lastStatus = sortedHistory[0]?.status?.toLowerCase() || '';
    const isFailed = [META_STATUS_FAILED, META_STATUS_API_ERROR].includes(lastStatus);
    return isFailed;
  }, [message]);

  return isMessageFailed;
};
