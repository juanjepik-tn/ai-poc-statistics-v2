/**
 * POC Statistics - Chat Statistics with Tabs
 * Includes: Conversations, Sales Chat, AI Efficiency metrics
 */

import { Box, Skeleton, Tabs } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StatisticCard,
  StatisticLineChart,
  StatisticBarList,
  ConversationFunnel,
} from './components';
import { useWindowWidth } from '@/hooks';
import StatisticsFilter from './components/StatisticsFilter';
import StatisticChart from './components/StatisticChart';
import { StatisticsContext } from './providers/StatisticsDataProvider';
import { format, parseISO } from 'date-fns';
import { es, pt } from 'date-fns/locale';
import PricingAlertStatus from '@/components/PricingAlertStatus/PricingAlertStatus';
import { BillingDTO } from '@/types/billingDTO';
import { useSelector } from 'react-redux';
import { StatisticsTab } from '@/types/chatStatistics.types';
import { thousandSeparator } from '@/common/utils/thousandSeparator';

const Statistics: React.FC = () => {
  const { t, i18n } = useTranslation('translations');
  const lang = i18n.language.split('-')[0];
  const locale = lang === 'es' ? es : pt;
  const windowWidth = useWindowWidth();
  const context = useContext(StatisticsContext);
  const isMobile = windowWidth !== null && windowWidth <= 768;
  const [formattedFilters, setFormattedFilters] = useState<any>(null);
  const billingData: BillingDTO = useSelector((state: any) => state?.billing?.billingData);
  
  // URL hash params for tab tracking (helps with comments system)
  const tabIndexMap: Record<string, number> = { conversations: 0, sales: 1, efficiency: 2 };
  const tabNameMap: StatisticsTab[] = ['conversations', 'sales', 'efficiency'];
  
  // Parse tab from hash (e.g., #/statistics?tab=sales)
  const getTabFromHash = useCallback(() => {
    const hash = window.location.hash;
    const tabMatch = hash.match(/[?&]tab=(\w+)/);
    return tabMatch ? tabMatch[1] : 'conversations';
  }, []);
  
  // Track selected tab in state
  const [selectedTab, setSelectedTab] = useState(() => {
    return tabIndexMap[getTabFromHash()] ?? 0;
  });
  
  // Set default tab in URL on mount if not present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/statistics') && !hash.includes('tab=')) {
      const newHash = `${hash}?tab=conversations`;
      window.history.replaceState(null, '', newHash);
    }
  }, []);

  // Destructure context
  const {
    statistics,
    onGetStatistics,
    loading,
    chatStatistics,
    onGetChatStatistics,
    chatStatsLoading,
    activeTab,
    setActiveTab,
    salesMetrics,
    efficiencyMetrics,
  } = context || {};

  const onHandleFilters = (filters: any) => {
    const formattedFilters = {
      since: filters.dateFrom ? format(new Date(filters.dateFrom), 'yyyy-MM-dd') : null,
      to: filters.dateTo ? format(new Date(filters.dateTo), 'yyyy-MM-dd') : null,
      granularity: '' as 'hourly' | 'daily' | 'weekly' | 'monthly' | '',
    };
    if (filters?.dateFrom && filters?.dateTo) {
      const diffInDays =
        (new Date(filters?.dateTo).getTime() - new Date(filters?.dateFrom).getTime()) /
        (1000 * 3600 * 24);
      if (diffInDays < 3) {
        formattedFilters.granularity = 'hourly';
      } else if (diffInDays >= 3 && diffInDays < 30) {
        formattedFilters.granularity = 'daily';
      } else if (diffInDays >= 30 && diffInDays < 90) {
        formattedFilters.granularity = 'weekly';
      } else {
        formattedFilters.granularity = 'monthly';
      }
    }
    setFormattedFilters(formattedFilters);
    onGetStatistics?.(formattedFilters);
    onGetChatStatistics?.(formattedFilters);
  };

  const calculateMessagesCount = () => {
    if (!statistics?.messages) return '0';
    const value =
      statistics.messages.bot + statistics.messages.customer + statistics.messages.merchant;
    return value;
  };

  const formatDateByGranularity = (date: string, granularity: string) => {
    const parsedDate = parseISO(date);
    switch (granularity) {
      case 'daily':
        return {
          name: format(parsedDate, 'd MMM', { locale }),
          label: format(parsedDate, `d 'de' MMMM`, { locale }),
        };
      case 'hourly':
        const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        const adjustedDate = new Date(parsedDate.getTime() - timezoneOffset);
        return {
          name: format(adjustedDate, 'HH:mm', { locale }),
          label: format(adjustedDate, `d 'de' MMMM, HH:mm`, { locale }),
        };
      case 'weekly':
        return {
          name: format(parsedDate, 'd MMM', { locale }),
          label: format(parsedDate, `d 'de' MMMM`, { locale }),
        };
      case 'monthly':
        return {
          name: format(parsedDate, 'MMM yyyy', { locale }),
          label: format(parsedDate, 'MMMM yyyy', { locale }),
        };
      default:
        return { name: date, label: date };
    }
  };

  const mapApiDataToChartValues = (
    messagesGrouped: {
      date: string;
      bot_messages: number;
      store_messages: number;
      customer_messages: number;
    }[]
  ) => {
    return messagesGrouped.map(({ date, bot_messages, store_messages, customer_messages }) => {
      const { name, label } = formatDateByGranularity(date, formattedFilters?.granularity);
      return {
        name,
        label,
        principalValue: bot_messages,
        secondaryValue: store_messages + customer_messages,
      };
    });
  };

  // Map trend data to line chart format
  const mapTrendToLineChart = (trend: { date: string; value: number }[] | undefined) => {
    if (!trend) return [];
    return trend.map(({ date, value }) => {
      const { name, label } = formatDateByGranularity(date, formattedFilters?.granularity || 'daily');
      return { name, label, value };
    });
  };

  // Currency symbol
  const currencySymbol = chatStatistics?.currency === 'ARS' ? '$' : 'R$';

  // Tab content components
  const ConversationsTab = () => (
    <Box display="flex" flexDirection="column" gap="4">
      <Box>
        <StatisticChart
          title={t(`statistics.conversations-${formattedFilters?.granularity || 'daily'}`)}
          values={mapApiDataToChartValues(statistics?.messages_grouped || [])}
          primaryColor="#4483B9"
          secondaryColor="#44BAC0"
          secondaryColorOpacity={false}
          oneYAxis={true}
          principalName={t('statistics.ia-messages')}
          secondaryName={t('statistics.total-messages')}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap="4">
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
          {loading ? (
            <>
              <Skeleton height="80px" width="100%" borderRadius="2" />
              <Skeleton height="80px" width="100%" borderRadius="2" />
            </>
          ) : (
            <>
              <StatisticCard
                title={t('statistics.conversations-count')}
                value={statistics?.conversations || 0}
                helpText={t('statistics.conversations-count-help')}
              />
              <StatisticCard
                title={t('statistics.conversations-count-with-ia')}
                value={statistics?.conversations_with_bot_message || 0}
                helpText={t('statistics.conversations-count-with-ia-help')}
              />
            </>
          )}
        </Box>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
          {loading ? (
            <>
              <Skeleton height="80px" width="100%" borderRadius="2" />
              <Skeleton height="80px" width="100%" borderRadius="2" />
            </>
          ) : (
            <>
              <StatisticCard
                title={t('statistics.ia-solved-conversations')}
                value={`${((statistics?.conversations_full_ai || 0) * 100).toFixed(2)}%`}
                helpText={t('statistics.ia-solved-conversations-help')}
              />
              <StatisticCard
                title={t('statistics.messages-count')}
                value={calculateMessagesCount()}
                helpText={t('statistics.messages-count-help')}
              />
            </>
          )}
        </Box>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
          {chatStatsLoading ? (
            <Skeleton height="80px" width="100%" borderRadius="2" />
          ) : (
            <StatisticCard
              title={t('statistics.handover-to-cart-rate')}
              value={`${(efficiencyMetrics?.handover_to_cart_rate || 0).toFixed(1)}%`}
              helpText={t('statistics.handover-to-cart-rate-help')}
            />
          )}
        </Box>
      </Box>
      {chatStatsLoading ? (
        <Skeleton height="300px" width="100%" borderRadius="2" />
      ) : (
        <StatisticBarList
          title={t('statistics.top-conversation-topics')}
          items={chatStatistics?.conversations?.top_conversation_topics || []}
          maxItems={7}
          barColor="#4483B9"
        />
      )}
    </Box>
  );

  // Translate funnel steps
  const getTranslatedFunnelSteps = () => {
    const funnel = salesMetrics?.funnel || [];
    return funnel.map((step) => ({
      ...step,
      label: t(`statistics.funnel-${step.id}`),
      helpText: t(`statistics.funnel-${step.id}-help`),
    }));
  };

  const SalesTab = () => (
    <Box display="flex" flexDirection="column" gap="4">
      {/* Conversation Funnel */}
      {chatStatsLoading ? (
        <Skeleton height="400px" width="100%" borderRadius="2" />
      ) : (
        <ConversationFunnel
          title={t('statistics.conversation-funnel')}
          steps={getTranslatedFunnelSteps()}
          conversionLabel={t('statistics.funnel-conversion-label') || 'conversión'}
          totalConversionLabel={t('statistics.funnel-total-conversion')}
          totalLossLabel={t('statistics.funnel-total-loss')}
        />
      )}

      {/* KPI Cards Row 1 */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
        {chatStatsLoading ? (
          <>
            <Skeleton height="80px" width="100%" borderRadius="2" />
            <Skeleton height="80px" width="100%" borderRadius="2" />
          </>
        ) : (
          <>
            <StatisticCard
              title={t('statistics.gmv-total')}
              value={`${currencySymbol}${thousandSeparator(salesMetrics?.gmv_total || 0)}`}
              helpText={t('statistics.gmv-total-help')}
            />
            <StatisticCard
              title={t('statistics.paid-orders-count')}
              value={salesMetrics?.paid_orders_count || 0}
              helpText={t('statistics.paid-orders-count-help')}
            />
          </>
        )}
      </Box>

      {/* KPI Cards Row 2 */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
        {chatStatsLoading ? (
          <>
            <Skeleton height="80px" width="100%" borderRadius="2" />
            <Skeleton height="80px" width="100%" borderRadius="2" />
          </>
        ) : (
          <>
            <StatisticCard
              title={t('statistics.carts-generated')}
              value={salesMetrics?.carts_generated || 0}
              helpText={t('statistics.carts-generated-help')}
            />
            <StatisticCard
              title={t('statistics.gmv-potential')}
              value={`${currencySymbol}${thousandSeparator(salesMetrics?.gmv_potential || 0)}`}
              helpText={t('statistics.gmv-potential-help')}
            />
          </>
        )}
      </Box>

      {/* KPI Cards Row 3 */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
        {chatStatsLoading ? (
          <>
            <Skeleton height="80px" width="100%" borderRadius="2" />
            <Skeleton height="80px" width="100%" borderRadius="2" />
          </>
        ) : (
          <>
            <StatisticCard
              title={t('statistics.cvr')}
              value={`${(salesMetrics?.cvr || 0).toFixed(2)}%`}
              helpText={t('statistics.cvr-help')}
            />
            <StatisticCard
              title={t('statistics.average-ticket')}
              value={`${currencySymbol}${thousandSeparator(salesMetrics?.average_ticket || 0)}`}
              helpText={t('statistics.average-ticket-help')}
            />
          </>
        )}
      </Box>

      {/* GMV Evolution Chart */}
      {chatStatsLoading ? (
        <Skeleton height="300px" width="100%" borderRadius="2" />
      ) : (
        <StatisticLineChart
          title={t('statistics.gmv-evolution')}
          values={mapTrendToLineChart(salesMetrics?.gmv_total_trend)}
          primaryColor="#4CAF50"
          primaryName={t('statistics.gmv-total')}
          isCurrency
          currencySymbol={currencySymbol}
        />
      )}

      {/* Orders & Carts Evolution Chart */}
      {chatStatsLoading ? (
        <Skeleton height="300px" width="100%" borderRadius="2" />
      ) : (
        <StatisticLineChart
          title={t('statistics.orders-carts-evolution')}
          values={mapTrendToLineChart(salesMetrics?.paid_orders_trend)}
          primaryColor="#2196F3"
          primaryName={t('statistics.paid-orders-count')}
        />
      )}

      {/* CVR Evolution Chart */}
      {chatStatsLoading ? (
        <Skeleton height="300px" width="100%" borderRadius="2" />
      ) : (
        <StatisticLineChart
          title={t('statistics.cvr-evolution')}
          values={mapTrendToLineChart(salesMetrics?.cvr_trend)}
          primaryColor="#FF9800"
          primaryName={t('statistics.cvr')}
          isPercentage
        />
      )}

      {/* Top Products */}
      {chatStatsLoading ? (
        <Skeleton height="300px" width="100%" borderRadius="2" />
      ) : (
        <StatisticBarList
          title={t('statistics.top-products-discussed')}
          items={salesMetrics?.top_products_discussed || []}
          maxItems={8}
          showImage
          barColor="#4CAF50"
        />
      )}
    </Box>
  );

  const EfficiencyTab = () => (
    <Box display="flex" flexDirection="column" gap="4">
      {/* KPI Cards Row 1 */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
        {chatStatsLoading ? (
          <>
            <Skeleton height="80px" width="100%" borderRadius="2" />
            <Skeleton height="80px" width="100%" borderRadius="2" />
          </>
        ) : (
          <>
            <StatisticCard
              title={t('statistics.time-to-purchase')}
              value={`${efficiencyMetrics?.time_to_purchase_avg || 0} min`}
              helpText={t('statistics.time-to-purchase-help')}
            />
            <StatisticCard
              title={t('statistics.estimated-savings')}
              value={`${currencySymbol}${thousandSeparator(efficiencyMetrics?.estimated_savings || 0)}`}
              helpText={t('statistics.estimated-savings-help')}
            />
          </>
        )}
      </Box>

      {/* KPI Cards Row 2 - Response times */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap="4">
        {chatStatsLoading ? (
          <>
            <Skeleton height="80px" width="100%" borderRadius="2" />
            <Skeleton height="80px" width="100%" borderRadius="2" />
          </>
        ) : (
          <>
            <StatisticCard
              title={t('statistics.ai-response-time')}
              value={`${efficiencyMetrics?.ai_response_time_avg || 0}s`}
              helpText={t('statistics.ai-response-time-help')}
            />
            <StatisticCard
              title={t('statistics.human-response-time')}
              value={`${Math.round((efficiencyMetrics?.human_response_time_avg || 0) / 60)} min`}
              helpText={t('statistics.human-response-time-help')}
            />
          </>
        )}
      </Box>

      {/* Top Derivation Reasons */}
      {chatStatsLoading ? (
        <Skeleton height="300px" width="100%" borderRadius="2" />
      ) : (
        <StatisticBarList
          title={t('statistics.top-derivation-reasons')}
          items={efficiencyMetrics?.top_derivation_reasons || []}
          maxItems={6}
          barColor="#FF9800"
        />
      )}
    </Box>
  );

  const handleTabChange = (index: number) => {
    const tabName = tabNameMap[index];
    setSelectedTab(index);
    setActiveTab?.(tabName);
    // Update URL hash and dispatch event for CommentsProvider to detect
    const newHash = `#/statistics?tab=${tabName}`;
    window.history.replaceState(null, '', newHash);
    // Dispatch hashchange event so listeners can react
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return (
    <Page maxWidth="900px">
      <Page.Header title={t('statistics.title')} />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <PricingAlertStatus
              type={billingData?.status}
              daysLeft={billingData?.billingPlan?.dayLeft}
              isCostumerInvoice={billingData?.isCostumerInvoice}
            />
            <Box display="flex" flexDirection="column" gap="4">
              <Box height="68px">
                <StatisticsFilter onFiltersChange={onHandleFilters} />
              </Box>

              <Tabs fullWidth selected={selectedTab} onTabSelect={handleTabChange}>
                <Tabs.Item label={t('statistics.tab-conversations')}>
                  <Box paddingTop="4">
                    <ConversationsTab />
                  </Box>
                </Tabs.Item>
                <Tabs.Item label={t('statistics.tab-sales')}>
                  <Box paddingTop="4">
                    <SalesTab />
                  </Box>
                </Tabs.Item>
                <Tabs.Item label={t('statistics.tab-efficiency')}>
                  <Box paddingTop="4">
                    <EfficiencyTab />
                  </Box>
                </Tabs.Item>
              </Tabs>
            </Box>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default Statistics;
