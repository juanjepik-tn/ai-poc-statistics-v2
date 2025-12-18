/**
 * Types for Chat Statistics Metrics
 */

// Time series data point for line charts
export interface TrendDataPoint {
  date: string;
  value: number;
}

// Ranked item for bar lists
export interface RankedItem {
  name: string;
  count: number;
  percentage?: number;
}

// Product ranked item (with additional info)
export interface RankedProduct {
  id: number;
  name: string;
  count: number;
  image?: string;
}

// Funnel step data
export interface FunnelStepData {
  id: string;
  label: string;
  value: number;
  color: string;
  helpText?: string;
}

// Sales metrics
export interface SalesMetrics {
  gmv_total: number;
  gmv_total_trend: TrendDataPoint[];
  paid_orders_count: number;
  paid_orders_trend: TrendDataPoint[];
  carts_generated: number;
  carts_trend: TrendDataPoint[];
  gmv_potential: number;
  gmv_potential_trend: TrendDataPoint[];
  cvr: number; // Conversion rate percentage
  cvr_trend: TrendDataPoint[];
  average_ticket: number;
  average_ticket_trend: TrendDataPoint[];
  top_products_discussed: RankedProduct[];
  // Conversation funnel
  funnel: FunnelStepData[];
}

// AI Efficiency metrics
export interface EfficiencyMetrics {
  time_to_purchase_avg: number; // in minutes
  ai_response_time_avg: number; // in seconds
  human_response_time_avg: number; // in seconds
  estimated_savings: number; // in currency
  handover_to_cart_rate: number; // percentage
  top_derivation_reasons: RankedItem[];
}

// Conversation metrics (extends existing)
export interface ConversationMetrics {
  conversations: number;
  conversations_with_bot_message: number;
  conversations_full_ai: number; // percentage as decimal (0-1)
  messages: {
    bot: number;
    customer: number;
    merchant: number;
  };
  messages_grouped: MessageGroupedData[];
  top_conversation_topics: RankedItem[];
}

export interface MessageGroupedData {
  date: string;
  bot_messages: number;
  store_messages: number;
  customer_messages: number;
}

// Combined chat statistics
export interface ChatStatistics {
  conversations: ConversationMetrics;
  sales: SalesMetrics;
  efficiency: EfficiencyMetrics;
  currency: string;
}

// Filter options for statistics
export interface StatisticsFilters {
  since: string | null;
  to: string | null;
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' | '';
}

// Tab identifiers
export type StatisticsTab = 'conversations' | 'sales' | 'efficiency';

