import axiosApi, { AxiosError } from 'axios';
import { handleMockRequest } from '@/mocks/mock-interceptor';

// POC Mode: Use mocks instead of real API
const USE_MOCKS = true;

const getBaseURL = () => {
  const overrideUrl = localStorage.getItem('override_url_vite');
  return overrideUrl ?? import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
};

const axios = axiosApi.create({
  baseURL: getBaseURL(),
});

// Request interceptor for mocking
axios.interceptors.request.use(
  async (config) => {
    if (USE_MOCKS) {
      // Throw a custom error that will be caught by the response interceptor
      const error = new Error('MOCK_REQUEST') as AxiosError;
      (error as any).__isMock = true;
      (error as any).__config = config;
      return Promise.reject(error);
    }

    // Original authentication logic (not used in POC mode)
    if (config.headers) {
      const token = localStorage.getItem('mock_token') ?? 'mock-jwt-token';
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle mock requests
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle mock requests
    if (error.__isMock && error.__config) {
      try {
        const mockResponse = await handleMockRequest(error.__config);
        return mockResponse;
      } catch (mockError) {
        console.error('[Mock] Error handling mock request:', mockError);
        return Promise.reject(mockError);
      }
    }
    
    // Pass through real errors
    return Promise.reject(error);
  }
);

export default axios;

export const API_ENDPOINTS = {
  login: '/login_check',  
  relevantContent: {
    list: (page: string) => `/relevantcontents/by/store?page=${page}`,
    categories: '/relevantcontents/categories',
    create: '/relevantcontents/create',
    update: (id: string) => `/relevantcontents/${id}`,
    delete: (id: string) => `/relevantcontents/${id}`,
    optionals: '/relevantcontents/by/store/optionals',
    createOptionals: '/relevantcontents/optional',
    updateOptionals: (id: string) => `/relevantcontents/optional/${id}`,
    createStore: '/relevantcontents/store',
    updateStore: (id: string) => `/relevantcontents/store/${id}`,
    createMandatory: '/relevantcontents/mandatory',
    updateMandatory: (id: string) => `/relevantcontents/mandatory/${id}`
  },
  iaConfig: {
    languages: '/iaconfigurations/language',
    personalities: '/iaconfigurations/personality',
    responsesLength: '/iaconfigurations/response/length',
    updateResponseLength: (responseLength: number) => `/stores/${responseLength}/response/length`,
    personalization: '/stores/personalization',
    traits: '/stores/personality/traits',
    toggleEmojis: '/stores/toggle/emojis',
    toggleAgreeToUseInformationFromStore: '/stores/toggle/agree/to/use/information/from/store',
    purposes: '/iaconfigurations/purpose',
    tones: '/iaconfigurations/tone',
    update: '/iaconfigurations',
    list: '/iaconfigurations',
  },
  messages: {
    update: '/stores/automatic/messages',
    list: '/stores/automatic/messages',
    updateMessageFeedbackStatus: (id: string, status: string) => `/messages/${id}/response/status/${status}`,
    updateMessageFeedbackRejected: (id: string) => `/messages/${id}/response/rejected`,
  },
  playground:{
    reset: '/play_grounds/reset/conversation',
    lastConversation: '/play_grounds/last/unfinished/conversation',
    message: '/play_grounds/customer/message',
  },
  whatsapp:{
    create: '/whatsapps/default/channel',    
    createWhatsappBaileys: '/whatsapps-baileys',
  },
  channel:{
    list: '/channels/store',    
    qr: (basePath: string, id: string) => `${basePath}/get/instance/${id}`,
    delete: (basePath: string, id: string) => `${basePath}/${id}`
  },
  store:{
    info: '/users/store/info',
    updateOperationMode: (mode: number) => `stores/operation/mode/${mode}`,
    hasTag: (tag: string) => `stores/has/tag/${tag}`,
  },
  actionRules: {
    list: (limit: number = 20, offset: number = 0) => 
      `action-rules/store?limit=${limit}&offset=${offset}`,
    create: () => 'action-rules/store',
    update: (id: number) => `action-rules/store/${id}`,
    delete: (id: number) => `action-rules/store/${id}`,
  },
  conversation: {    
    byStore: 'conversations/store',
    byStoreGrouped: (page: string, query?: string) => `whatsapps/grouped/conversations/store?page=${page}&${query}`,
    sendMessage: (id: string) => `conversations/${id}/send/message`,
    sendAudio: (id: string) => `conversations/${id}/send/audio`,
    sendImage: (id: string) => `conversations/${id}/send/image`,
    details: (id: string) => `conversations/${id}`,
    suggestResponse: (id: string) => `conversations/${id}/suggest/response`,
    getConversationByUsername: (username:string, start: number = 0) => `whatsapps/conversations/username/${username}?page=${start}&length=5`,
    unread: 'stores/conversations/attend/username',
    markAsRead: (id: string) => `conversations/${id}/mark/read`,
  },
  customer: {
    updateState: (id: number, state: number) => `customers/${id}/state/${state}`,
    details: (id: number) =>   `customers/${id}`,
    resolveAttention: (id: number, tag: number) => `customers/${id}/human/attention/${tag}/done`,
    resolveAllAttention: (id: number, conversation:number) => `customers/${id}/human/attention/done/${conversation}`
  },
  message: {
    markAsSeen: (id: number) => `messages/${id}`,
    downloadFile: (id: number) => `messages/${id}/download`,
    downloadThumbnail: (id: number) => `messages/${id}/thumbnail`,
    feedback: (id: number) => `messages/${id}/response/feedback`
  },
  statistics: {    
    stats: 'dashboard/store/stats',
    chatStats: 'dashboard/chat/stats',
    details: (filters: any) => `statistics?${filters}`,
  },
  plan:{
    list: '/plans/store'
  },
  billing:{
    activate: '/billing/activate',
    billingData: '/billing/billing-data',
    currentCycle: 'billing/cycle/current',
    payments: 'billing/payments/history',
  },
  whatsappBusiness: {
    templates: (channelId: string) => `whatsapps-business/${channelId}/templates`,
    createTemplate: (channelId: string) => `whatsapps-business/${channelId}/templates`,
    signUp : 'whatsapps-business/signup',
    disconnect: (channelId: string) => `whatsapps-business/${channelId}/disconnect`,
    healthStatus: (channelId: string) => `whatsapps-business/${channelId}/health`
  },
  logs: {
    register: '/logs/application',
  },
  crossCompany: {
    channels: '/cross-company/channels',
    signup: '/cross-company/signup',
    enableMarketingAutomation: (id: number) => `/cross-company/enable-marketing-automation/${id}`,
    disableMarketingAutomation: (id: number) => `/cross-company/disable-marketing-automation/${id}`,
    enableChat: (id: number) => `/cross-company/enable-chat/${id}`,
    disableChat: (id: number) => `/cross-company/disable-chat/${id}`,
  },
  announcements: {
    unread: '/announcements/unread',
    markAsViewed: (id: number) => `/announcements/${id}/view`,
  }
}
