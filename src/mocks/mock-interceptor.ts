/**
 * Mock Interceptor for POC UI Playground
 * Intercepts Axios requests and returns mock data
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  mockStoreInfo,
  mockBillingData,
  mockPlans,
  mockCurrentCycle,
  mockPaymentsHistory,
  mockStatistics,
  mockConversations,
  mockConversationsGrouped,
  mockProducts,
  mockChannels,
  mockIaConfig,
  mockLanguages,
  mockPersonalities,
  mockResponsesLength,
  mockPurposes,
  mockTones,
  mockPersonalityTraits,
  mockActionRules,
  mockRelevantContent,
  mockRelevantContentOptionals,
  mockRelevantContentCategories,
  mockAutomaticMessages,
  mockPlaygroundConversation,
  mockTemplateMessages,
  mockAnnouncements,
  mockWhatsappHealth,
  mockSessionData,
  mockChatStatistics,
} from './mock-data';

// Simulate network delay
const MOCK_DELAY_MS = 300;

// Helper to create a delayed promise
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Type for mock response
interface MockResponse {
  data: unknown;
  status: number;
}

/**
 * Route matching helper
 */
const matchRoute = (url: string, pattern: string): boolean => {
  // Convert pattern to regex (handle :id style params)
  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\//g, '\\/');
  const regex = new RegExp(`^${regexPattern}(\\?.*)?$`);
  return regex.test(url);
};

/**
 * Get mock response based on URL and method
 */
export const getMockResponse = (
  url: string | undefined,
  method: string | undefined
): MockResponse | null => {
  if (!url) return null;

  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const normalizedMethod = (method || 'GET').toUpperCase();

  // Store info
  if (matchRoute(normalizedUrl, '/users/store/info') && normalizedMethod === 'GET') {
    return { data: mockStoreInfo, status: 200 };
  }

  // Login
  if (matchRoute(normalizedUrl, '/login_check') && normalizedMethod === 'POST') {
    return { data: mockSessionData, status: 200 };
  }

  // Billing
  if (matchRoute(normalizedUrl, '/billing/billing-data') && normalizedMethod === 'GET') {
    return { data: mockBillingData, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/billing/cycle/current') && normalizedMethod === 'GET') {
    return { data: mockCurrentCycle, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/billing/payments/history') && normalizedMethod === 'GET') {
    return { data: mockPaymentsHistory, status: 200 };
  }

  // Plans
  if (matchRoute(normalizedUrl, '/plans/store') && normalizedMethod === 'GET') {
    return { data: mockPlans, status: 200 };
  }

  // Statistics
  if (normalizedUrl.includes('dashboard/store/stats')) {
    return { data: mockStatistics, status: 200 };
  }

  // Chat Statistics (new metrics)
  if (normalizedUrl.includes('dashboard/chat/stats') || normalizedUrl.includes('chat-statistics')) {
    return { data: mockChatStatistics, status: 200 };
  }

  if (normalizedUrl.includes('statistics')) {
    return { data: mockStatistics, status: 200 };
  }

  // Conversations
  if (normalizedUrl.includes('whatsapps/grouped/conversations/store')) {
    return { data: mockConversationsGrouped, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/conversations/store') && normalizedMethod === 'GET') {
    return { data: { rows: mockConversations, total: mockConversations.length }, status: 200 };
  }

  if (normalizedUrl.match(/\/conversations\/[^/]+$/) && normalizedMethod === 'GET') {
    const id = normalizedUrl.split('/').pop();
    const conversation = mockConversations.find((c) => c.id === id) || mockConversations[0];
    return { data: conversation, status: 200 };
  }

  // Conversations by username (para cargar más mensajes)
  if (normalizedUrl.includes('/conversations/username/')) {
    const usernameMatch = normalizedUrl.match(/\/conversations\/username\/([^/?]+)/);
    if (usernameMatch) {
      const username = decodeURIComponent(usernameMatch[1]);
      const userConversations = mockConversations.filter(c => c.customer.username === username);
      return { data: { rows: userConversations, total: userConversations.length }, status: 200 };
    }
    return { data: { rows: [], total: 0 }, status: 200 };
  }

  // Unread conversations count
  if (normalizedUrl.includes('/conversations/unread')) {
    const unreadCount = mockConversations.reduce((acc, conv) => acc + conv.unreadMessages, 0);
    return { data: { count: unreadCount }, status: 200 };
  }

  if (normalizedUrl.includes('/send/message') && normalizedMethod === 'POST') {
    return {
      data: {
        id: Date.now(),
        content: 'Mensaje enviado correctamente',
        created_at: new Date().toISOString(),
        role: 'merchant',
      },
      status: 200,
    };
  }

  if (normalizedUrl.includes('/suggest/response') && normalizedMethod === 'GET') {
    return {
      data: {
        suggestion: 'Gracias por tu consulta. Te confirmo que tenemos stock disponible. ¿Querés que te genere el link de pago?',
      },
      status: 200,
    };
  }

  // Channel list endpoint
  if (normalizedUrl.includes('/channels/list') || matchRoute(normalizedUrl, '/channels')) {
    return { data: mockChannels.map(ch => ({ ...ch, state: { name: 'Active' } })), status: 200 };
  }

  if (normalizedUrl.includes('/stores/conversations/attend/username')) {
    return { data: { usernames: [] }, status: 200 };
  }

  if (normalizedUrl.includes('/mark/read') && normalizedMethod === 'PUT') {
    return { data: { success: true }, status: 200 };
  }

  // Customers
  if (normalizedUrl.match(/\/customers\/\d+$/) && normalizedMethod === 'GET') {
    return { data: mockConversations[0].customer, status: 200 };
  }

  if (normalizedUrl.includes('/customers/') && normalizedUrl.includes('/state/')) {
    return { data: { success: true }, status: 200 };
  }

  if (normalizedUrl.includes('/human/attention/')) {
    return { data: { success: true }, status: 200 };
  }

  // Products (empty list to avoid errors)
  if (normalizedUrl.includes('/products')) {
    return { data: mockProducts, status: 200 };
  }

  // Channels
  if (matchRoute(normalizedUrl, '/channels/store') && normalizedMethod === 'GET') {
    return { data: mockChannels, status: 200 };
  }

  if (normalizedUrl.includes('/whatsapps/') && normalizedUrl.includes('/health')) {
    return { data: mockWhatsappHealth, status: 200 };
  }

  // IA Configurations
  if (matchRoute(normalizedUrl, '/iaconfigurations/language') && normalizedMethod === 'GET') {
    return { data: mockLanguages, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/iaconfigurations/personality') && normalizedMethod === 'GET') {
    return { data: mockPersonalities, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/iaconfigurations/response/length') && normalizedMethod === 'GET') {
    return { data: mockResponsesLength, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/iaconfigurations/purpose') && normalizedMethod === 'GET') {
    return { data: mockPurposes, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/iaconfigurations/tone') && normalizedMethod === 'GET') {
    return { data: mockTones, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/iaconfigurations') && normalizedMethod === 'GET') {
    return { data: mockIaConfig, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/stores/personalization') && normalizedMethod === 'GET') {
    return { data: mockIaConfig, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/stores/personality/traits') && normalizedMethod === 'GET') {
    return { data: mockPersonalityTraits, status: 200 };
  }

  // Store operations
  if (normalizedUrl.includes('/stores/operation/mode/')) {
    return { data: { success: true }, status: 200 };
  }

  if (normalizedUrl.includes('/stores/toggle/emojis')) {
    return { data: { emojisEnabled: true }, status: 200 };
  }

  if (normalizedUrl.includes('/stores/toggle/agree/to/use/information/from/store')) {
    return { data: { agreeToUseInformationFromStore: true }, status: 200 };
  }

  if (normalizedUrl.includes('/stores/has/tag/')) {
    return { data: { hasTag: true }, status: 200 };
  }

  // Action Rules
  if (normalizedUrl.includes('action-rules/store') && normalizedMethod === 'GET') {
    return { data: mockActionRules, status: 200 };
  }

  if (normalizedUrl.includes('action-rules/store') && normalizedMethod === 'POST') {
    const { id: _existingId, ...rest } = mockActionRules.data[0];
    return {
      data: {
        ...rest,
        id: Date.now(),
      },
      status: 201,
    };
  }

  if (normalizedUrl.match(/action-rules\/store\/\d+/) && normalizedMethod === 'PUT') {
    return { data: mockActionRules.data[0], status: 200 };
  }

  if (normalizedUrl.match(/action-rules\/store\/\d+/) && normalizedMethod === 'DELETE') {
    return { data: { success: true }, status: 200 };
  }

  // Relevant Content (Biblioteca)
  // List content - returns { rows: [...], total: number }
  if (normalizedUrl.includes('/relevantcontents/by/store') && !normalizedUrl.includes('optionals')) {
    return { data: mockRelevantContent, status: 200 };
  }

  // Optionals - suggested content user can add
  if (normalizedUrl.includes('/relevantcontents/by/store/optionals') || 
      normalizedUrl.includes('/relevantcontents/optionals')) {
    return { data: mockRelevantContentOptionals, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/relevantcontents/categories') && normalizedMethod === 'GET') {
    return { data: mockRelevantContentCategories, status: 200 };
  }

  // Create content
  if (normalizedUrl.includes('/relevantcontents/') && normalizedMethod === 'POST') {
    return { 
      data: { 
        id: Date.now(),
        title: 'Nuevo contenido',
        content: 'Contenido creado',
        class: 'relevant_content_store',
        tool: false,
        created_at: new Date().toISOString(),
      }, 
      status: 201 
    };
  }

  // Update/Delete content
  if (normalizedUrl.includes('/relevantcontents/') && ['PUT', 'DELETE'].includes(normalizedMethod)) {
    return { data: { success: true }, status: 200 };
  }

  // Automatic Messages
  if (normalizedUrl.includes('/stores/automatic/messages') && normalizedMethod === 'GET') {
    return { data: mockAutomaticMessages, status: 200 };
  }

  if (normalizedUrl.includes('/stores/automatic/messages') && normalizedMethod === 'PUT') {
    return { data: mockAutomaticMessages, status: 200 };
  }

  // Message feedback
  if (normalizedUrl.includes('/messages/') && normalizedUrl.includes('/response/')) {
    return { data: { success: true }, status: 200 };
  }

  // Message feedback (PUT)
  if (normalizedUrl.match(/\/messages\/\d+\/feedback/) && normalizedMethod === 'PUT') {
    return { data: { success: true }, status: 200 };
  }

  // Download file/thumbnail
  if (normalizedUrl.includes('/download/file') || normalizedUrl.includes('/download/thumbnail')) {
    // Return a placeholder image blob URL indicator
    return { data: { url: 'https://picsum.photos/400/400' }, status: 200 };
  }

  // Send audio
  if (normalizedUrl.includes('/send/audio') && normalizedMethod === 'POST') {
    return {
      data: {
        id: Date.now(),
        content: '',
        created_at: new Date().toISOString(),
        role: 'store',
        class: 'message-storeaudio',
        mimetype: 'audio/wav',
      },
      status: 200,
    };
  }

  // Send image
  if (normalizedUrl.includes('/send/image') && normalizedMethod === 'POST') {
    return {
      data: {
        id: Date.now(),
        content: '',
        created_at: new Date().toISOString(),
        role: 'store',
        class: 'message-storeimage',
        mimetype: 'image/jpeg',
      },
      status: 200,
    };
  }

  // Human attention resolve
  if (normalizedUrl.includes('/human/attention/') && normalizedMethod === 'DELETE') {
    return { data: { success: true }, status: 200 };
  }

  // Customer state update
  if (normalizedUrl.match(/\/customers\/\d+\/state/) && normalizedMethod === 'PUT') {
    return { data: { success: true }, status: 200 };
  }

  // Playground
  if (matchRoute(normalizedUrl, '/play_grounds/reset/conversation')) {
    return { data: { success: true }, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/play_grounds/last/unfinished/conversation')) {
    return { data: mockPlaygroundConversation, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/play_grounds/customer/message') && normalizedMethod === 'POST') {
    return {
      data: {
        response: 'Esta es una respuesta de prueba del asistente virtual. En el entorno real, el modelo de IA generaría una respuesta contextual basada en la información de tu tienda.',
      },
      status: 200,
    };
  }

  // WhatsApp
  if (normalizedUrl.includes('/whatsapps/default/channel') && normalizedMethod === 'POST') {
    return { data: mockChannels[0], status: 201 };
  }

  if (normalizedUrl.includes('/whatsapps-baileys') && normalizedMethod === 'POST') {
    return { data: mockChannels[1], status: 201 };
  }

  if (normalizedUrl.includes('/get/instance/')) {
    return {
      data: {
        qr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        status: 'waiting',
      },
      status: 200,
    };
  }

  // WhatsApp Business Templates
  if (normalizedUrl.includes('/whatsapps-business/') && normalizedUrl.includes('/templates')) {
    if (normalizedMethod === 'GET') {
      return { data: mockTemplateMessages, status: 200 };
    }
    if (normalizedMethod === 'POST') {
      return { data: mockTemplateMessages[0], status: 201 };
    }
  }

  if (normalizedUrl.includes('/whatsapps-business/signup')) {
    return { data: { success: true, channel: mockChannels[0] }, status: 200 };
  }

  if (normalizedUrl.includes('/whatsapps-business/') && normalizedUrl.includes('/disconnect')) {
    return { data: { success: true }, status: 200 };
  }

  // Announcements
  if (matchRoute(normalizedUrl, '/announcements/unread') && normalizedMethod === 'GET') {
    return { data: mockAnnouncements.filter((a) => !a.read), status: 200 };
  }

  if (normalizedUrl.includes('/announcements/') && normalizedUrl.includes('/view')) {
    return { data: { success: true }, status: 200 };
  }

  // Logs
  if (normalizedUrl.includes('/logs/application')) {
    return { data: { success: true }, status: 200 };
  }

  // Cross Company
  if (matchRoute(normalizedUrl, '/cross-company/channels')) {
    return { data: mockChannels, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/cross-company/signup')) {
    return { data: { success: true }, status: 200 };
  }

  if (normalizedUrl.includes('/cross-company/enable-') || normalizedUrl.includes('/cross-company/disable-')) {
    return { data: { success: true }, status: 200 };
  }

  // Billing activate
  if (matchRoute(normalizedUrl, '/billing/activate') && normalizedMethod === 'POST') {
    return { data: { success: true }, status: 200 };
  }

  // Default: return null to let the request proceed (shouldn't happen in POC)
  console.warn(`[Mock] No mock found for: ${normalizedMethod} ${normalizedUrl}`);
  return null;
};

/**
 * Create mock Axios response
 */
export const createMockAxiosResponse = <T>(data: T, status: number = 200): AxiosResponse<T> => {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: {} as AxiosRequestConfig,
  } as AxiosResponse<T>;
};

/**
 * Mock request handler - returns a promise that resolves to mock data
 */
export const handleMockRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  await delay(MOCK_DELAY_MS);

  const mockResponse = getMockResponse(config.url, config.method);

  if (mockResponse) {
    console.log(`[Mock] ${config.method?.toUpperCase()} ${config.url} -> ${mockResponse.status}`);
    return createMockAxiosResponse(mockResponse.data, mockResponse.status);
  }

  // If no mock found, return a generic success
  console.warn(`[Mock] No handler for: ${config.method?.toUpperCase()} ${config.url}`);
  return createMockAxiosResponse({ success: true, message: 'Mock response' }, 200);
};

export default {
  getMockResponse,
  handleMockRequest,
  createMockAxiosResponse,
};

