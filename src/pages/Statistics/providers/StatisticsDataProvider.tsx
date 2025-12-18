import React, { createContext, useState } from 'react';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import {
  ChatStatistics,
  StatisticsFilters,
  StatisticsTab,
  ConversationMetrics,
  SalesMetrics,
  EfficiencyMetrics,
} from '@/types/chatStatistics.types';

interface StatisticsContextValue {
  // Legacy statistics (for backward compatibility)
  statistics: any;
  onGetStatistics: (filters: any) => Promise<void>;
  loading: boolean;

  // New chat statistics
  chatStatistics: ChatStatistics | null;
  onGetChatStatistics: (filters: StatisticsFilters) => Promise<void>;
  chatStatsLoading: boolean;

  // Active tab
  activeTab: StatisticsTab;
  setActiveTab: (tab: StatisticsTab) => void;

  // Convenience getters
  conversationMetrics: ConversationMetrics | null;
  salesMetrics: SalesMetrics | null;
  efficiencyMetrics: EfficiencyMetrics | null;
}

const StatisticsDataProvider: React.FC<any> = ({ children }) => {
  const { addToast } = useToast();
  const { request } = useFetch();

  // Legacy statistics state
  const [statistics, setStatistics] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // New chat statistics state
  const [chatStatistics, setChatStatistics] = useState<ChatStatistics | null>(null);
  const [chatStatsLoading, setChatStatsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<StatisticsTab>('conversations');

  // Legacy statistics fetch
  const onGetStatistics = (filters: any) => {
    setLoading(true);
    return request<any>({
      url: API_ENDPOINTS.statistics.stats,
      method: 'POST',
      data: filters,
    })
      .then(({ content }: any) => {
        setLoading(false);
        setStatistics(content);
      })
      .catch((error) => {
        setLoading(false);
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-get-statistics',
        });
      });
  };

  // New chat statistics fetch
  const onGetChatStatistics = async (filters: StatisticsFilters) => {
    setChatStatsLoading(true);
    try {
      const response = await request<any>({
        url: API_ENDPOINTS.statistics.chatStats,
        method: 'POST',
        data: filters,
      });

      // The mock returns the data directly, handle both cases
      const data = response?.content || response;
      setChatStatistics(data);
    } catch (error: any) {
      addToast({
        type: 'danger',
        text: error?.message?.description ?? error?.message ?? 'Error loading chat statistics',
        duration: 4000,
        id: 'error-get-chat-statistics',
      });
    } finally {
      setChatStatsLoading(false);
    }
  };

  // Convenience getters for metrics
  const conversationMetrics = chatStatistics?.conversations ?? null;
  const salesMetrics = chatStatistics?.sales ?? null;
  const efficiencyMetrics = chatStatistics?.efficiency ?? null;

  return (
    <StatisticsContext.Provider
      value={{
        // Legacy
        statistics,
        onGetStatistics,
        loading,

        // New
        chatStatistics,
        onGetChatStatistics,
        chatStatsLoading,

        // Tab management
        activeTab,
        setActiveTab,

        // Convenience getters
        conversationMetrics,
        salesMetrics,
        efficiencyMetrics,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

export default StatisticsDataProvider;
export const StatisticsContext = createContext<StatisticsContextValue | null>(null);
