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
  mockCustomTags,
  mockStoreUsers,
  mockQuickReplies,
} from './mock-data';

// Simulate network delay
const MOCK_DELAY_MS = 300;

// Mutable storage for created/updated content (persists during session)
const createdRelevantContent: any[] = [];
let nextContentId = 1000;

// Mutable storage for connected channels (initialized with mock channels)
const connectedChannels: any[] = [...mockChannels];

// Mutable storage for custom tags
const customTagsStore: any[] = [...mockCustomTags];
let nextCustomTagId = 100;

// Mutable storage for quick replies
const quickRepliesStore: any[] = [...mockQuickReplies];
let nextQuickReplyId = 100;

// Mutable storage for conversation assignments
const conversationAssignments: Record<string, any> = {};

// Mutable storage for conversation unread state overrides
const conversationUnreadOverrides: Record<string, number> = {};

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
  method: string | undefined,
  config?: AxiosRequestConfig
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
  if (normalizedUrl.includes('/conversations/unread') || normalizedUrl.includes('/conversations/attend/username')) {
    const unreadCount = mockConversations.filter(conv => {
      const override = conversationUnreadOverrides[conv.id];
      if (override !== undefined) return override > 0;
      return conv.unreadMessages > 0;
    }).length;
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

  // Channel list endpoint - returns only channels connected during this session
  if (normalizedUrl.includes('/channels/list') || matchRoute(normalizedUrl, '/channels')) {
    return { data: connectedChannels.map(ch => ({ ...ch, state: { name: 'Active' } })), status: 200 };
  }

  if (normalizedUrl.includes('/stores/conversations/attend/username')) {
    return { data: { usernames: [] }, status: 200 };
  }

  if (normalizedUrl.includes('/mark/read') && normalizedMethod === 'PUT') {
    const idMatch = normalizedUrl.match(/\/conversations\/([^/]+)\/mark\/read/);
    const convId = idMatch ? idMatch[1] : null;
    if (convId) {
      conversationUnreadOverrides[convId] = 0;
    }
    return { data: { success: true }, status: 200 };
  }

  // Mark as unread
  if (normalizedUrl.includes('/mark/unread') && normalizedMethod === 'PUT') {
    const idMatch = normalizedUrl.match(/\/conversations\/([^/]+)\/mark\/unread/);
    const convId = idMatch ? idMatch[1] : null;
    if (convId) {
      conversationUnreadOverrides[convId] = 1;
    }
    return { data: { success: true }, status: 200 };
  }

  // Assign conversation
  if (normalizedUrl.includes('/assign') && normalizedMethod === 'PUT') {
    const idMatch = normalizedUrl.match(/\/conversations\/([^/]+)\/assign/);
    const convId = idMatch ? idMatch[1] : null;
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    if (convId) {
      conversationAssignments[convId] = reqData.assignee || null;
    }
    return { data: { success: true, assignee: reqData.assignee }, status: 200 };
  }

  // Create new conversation
  if (normalizedUrl.includes('/conversations/new') && normalizedMethod === 'POST') {
    return {
      data: {
        id: `new-${Date.now()}`,
        success: true,
        message: 'Conversation created with template',
      },
      status: 201,
    };
  }

  // Send template
  if (normalizedUrl.includes('/send/template') && normalizedMethod === 'POST') {
    return {
      data: {
        id: Date.now(),
        content: 'Template message sent',
        created_at: new Date().toISOString(),
        role: 'store',
        class: 'message-template',
      },
      status: 200,
    };
  }

  // Send file (document)
  if (normalizedUrl.includes('/send/file') && normalizedMethod === 'POST') {
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    return {
      data: {
        id: Date.now(),
        content: reqData.fileName || 'document',
        created_at: new Date().toISOString(),
        role: 'store',
        class: 'message-storefile',
        mimetype: reqData.mimeType || 'application/octet-stream',
        extra_data: reqData.fileName || 'document',
      },
      status: 200,
    };
  }

  // Send sticker
  if (normalizedUrl.includes('/send/sticker') && normalizedMethod === 'POST') {
    return {
      data: {
        id: Date.now(),
        content: '',
        created_at: new Date().toISOString(),
        role: 'store',
        class: 'message-storesticker',
        mimetype: 'image/webp',
      },
      status: 200,
    };
  }

  // Custom Tags CRUD
  if (normalizedUrl.includes('custom-tags/store') && normalizedMethod === 'GET') {
    return { data: customTagsStore, status: 200 };
  }
  if (normalizedUrl.includes('custom-tags/store') && normalizedMethod === 'POST') {
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    const newTag = { id: nextCustomTagId++, name: reqData.name, color: reqData.color, createdAt: new Date().toISOString() };
    customTagsStore.push(newTag);
    return { data: newTag, status: 201 };
  }
  if (normalizedUrl.match(/custom-tags\/store\/\d+/) && normalizedMethod === 'PUT') {
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    const idMatch = normalizedUrl.match(/custom-tags\/store\/(\d+)/);
    const tagId = idMatch ? parseInt(idMatch[1], 10) : null;
    const idx = customTagsStore.findIndex((t: any) => t.id === tagId);
    if (idx !== -1) {
      customTagsStore[idx] = { ...customTagsStore[idx], ...reqData };
    }
    return { data: customTagsStore[idx] || reqData, status: 200 };
  }
  if (normalizedUrl.match(/custom-tags\/store\/\d+/) && normalizedMethod === 'DELETE') {
    const idMatch = normalizedUrl.match(/custom-tags\/store\/(\d+)/);
    const tagId = idMatch ? parseInt(idMatch[1], 10) : null;
    const idx = customTagsStore.findIndex((t: any) => t.id === tagId);
    if (idx !== -1) customTagsStore.splice(idx, 1);
    return { data: { success: true }, status: 200 };
  }

  // Store Users
  if (normalizedUrl.includes('store-users') && normalizedMethod === 'GET') {
    return { data: mockStoreUsers, status: 200 };
  }

  // Quick Replies CRUD
  if (normalizedUrl.includes('quick-replies/store') && normalizedMethod === 'GET') {
    return { data: quickRepliesStore, status: 200 };
  }
  if (normalizedUrl.includes('quick-replies/store') && normalizedMethod === 'POST') {
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    const newReply = { id: nextQuickReplyId++, ...reqData };
    quickRepliesStore.push(newReply);
    return { data: newReply, status: 201 };
  }
  if (normalizedUrl.match(/quick-replies\/store\/\d+/) && normalizedMethod === 'PUT') {
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    const idMatch = normalizedUrl.match(/quick-replies\/store\/(\d+)/);
    const replyId = idMatch ? parseInt(idMatch[1], 10) : null;
    const idx = quickRepliesStore.findIndex((r: any) => r.id === replyId);
    if (idx !== -1) {
      quickRepliesStore[idx] = { ...quickRepliesStore[idx], ...reqData };
    }
    return { data: quickRepliesStore[idx] || reqData, status: 200 };
  }
  if (normalizedUrl.match(/quick-replies\/store\/\d+/) && normalizedMethod === 'DELETE') {
    const idMatch = normalizedUrl.match(/quick-replies\/store\/(\d+)/);
    const replyId = idMatch ? parseInt(idMatch[1], 10) : null;
    const idx = quickRepliesStore.findIndex((r: any) => r.id === replyId);
    if (idx !== -1) quickRepliesStore.splice(idx, 1);
    return { data: { success: true }, status: 200 };
  }

  // Customer update name
  if (normalizedUrl.match(/\/customers\/\d+\/name/) && normalizedMethod === 'PUT') {
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    return { data: { success: true, name: reqData.name }, status: 200 };
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
    return { data: connectedChannels, status: 200 };
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
  if (normalizedUrl.includes('/relevantcontents/by/store') && !normalizedUrl.includes('optionals') && normalizedMethod === 'GET') {
    // Combine static mock data with dynamically created content
    const allContent = [...(mockRelevantContent.rows || []), ...createdRelevantContent];
    return { 
      data: { 
        rows: allContent, 
        total: allContent.length 
      }, 
      status: 200 
    };
  }

  // Optionals - suggested content user can add
  if ((normalizedUrl.includes('/relevantcontents/by/store/optionals') || 
      normalizedUrl.includes('/relevantcontents/optionals')) && normalizedMethod === 'GET') {
    return { data: mockRelevantContentOptionals, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/relevantcontents/categories') && normalizedMethod === 'GET') {
    return { data: mockRelevantContentCategories, status: 200 };
  }

  // Create content - persist in createdRelevantContent array
  if (normalizedUrl.includes('/relevantcontents/') && normalizedMethod === 'POST') {
    // @ts-ignore - config.data might be string or object
    const requestData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    
    const newContent = {
      id: nextContentId++,
      title: requestData.title || 'Nuevo contenido',
      content: requestData.content || '',
      class: requestData.class || 'relevant_content_store',
      tool: requestData.tool || false,
      tool_name: requestData.tool_name || 'transfer_to_human',
      state: requestData.state || 'disabled',
      canBeDeleted: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Add to our mutable storage
    createdRelevantContent.push(newContent);
    console.log('[Mock] Created content:', newContent);
    
    return { 
      data: newContent, 
      status: 201 
    };
  }

  // Update content
  if (normalizedUrl.includes('/relevantcontents/') && normalizedMethod === 'PUT') {
    const idMatch = normalizedUrl.match(/\/relevantcontents\/(?:store|optional|mandatory)\/(\d+)/);
    const contentId = idMatch ? parseInt(idMatch[1], 10) : null;
    
    // @ts-ignore
    const requestData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    
    // Try to find and update in createdRelevantContent
    const createdIndex = createdRelevantContent.findIndex(c => c.id === contentId);
    if (createdIndex !== -1) {
      createdRelevantContent[createdIndex] = {
        ...createdRelevantContent[createdIndex],
        ...requestData,
        updated_at: new Date().toISOString(),
      };
      console.log('[Mock] Updated content:', createdRelevantContent[createdIndex]);
      return { data: createdRelevantContent[createdIndex], status: 200 };
    }
    
    // Otherwise just return success (mock data is immutable)
    return { data: { success: true, ...requestData }, status: 200 };
  }

  // Delete content
  if (normalizedUrl.includes('/relevantcontents/') && normalizedMethod === 'DELETE') {
    const idMatch = normalizedUrl.match(/\/relevantcontents\/(\d+)/);
    const contentId = idMatch ? parseInt(idMatch[1], 10) : null;
    
    // Remove from createdRelevantContent if exists
    const createdIndex = createdRelevantContent.findIndex(c => c.id === contentId);
    if (createdIndex !== -1) {
      createdRelevantContent.splice(createdIndex, 1);
      console.log('[Mock] Deleted content with id:', contentId);
    }
    
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
    const waChannel = mockChannels[0] || {
      id: `wa-${Date.now()}`,
      username: '+54 9 11 1234-5678',
      channelName: 'WhatsAppBusiness',
      basePath: '/whatsapps-business',
      country: 'AR',
      actualStatus: { id: 1, name: 'Connected' },
      state: { name: 'Active' },
      channelType: 'whatsapp',
      bot_status: 'active',
    };
    if (!connectedChannels.some(ch => ch.channelType === 'whatsapp')) {
      connectedChannels.push({ ...waChannel, actualStatus: { id: 1, name: 'Connected' }, state: { name: 'Active' } });
    }
    return { data: waChannel, status: 201 };
  }

  if (normalizedUrl.includes('/whatsapps-baileys') && normalizedMethod === 'POST') {
    const baileysChannel = {
      id: `baileys-${Date.now()}`,
      username: '+54 9 11 9876-5432',
      channelName: 'WhatsappBaileys',
      basePath: '/whatsapps-baileys',
      country: 'AR',
      actualStatus: { id: 1, name: 'Connected' },
      state: { name: 'Active' },
      channelType: 'whatsapp',
      bot_status: 'active',
    };
    if (!connectedChannels.some(ch => ch.channelType === 'whatsapp')) {
      connectedChannels.push(baileysChannel);
    }
    return { data: baileysChannel, status: 201 };
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
    const wbChannel = mockChannels[0] || {
      id: `wb-${Date.now()}`,
      username: '+54 9 11 1234-5678',
      channelName: 'WhatsAppBusiness',
      basePath: '/whatsapps-business',
      country: 'AR',
      actualStatus: { id: 1, name: 'Connected' },
      state: { name: 'Active' },
      channelType: 'whatsapp',
      bot_status: 'active',
    };
    if (!connectedChannels.some(ch => ch.channelType === 'whatsapp')) {
      connectedChannels.push({ ...wbChannel, actualStatus: { id: 1, name: 'Connected' }, state: { name: 'Active' } });
    }
    return { data: { success: true, channel: wbChannel }, status: 200 };
  }

  if (normalizedUrl.includes('/whatsapps-business/') && normalizedUrl.includes('/disconnect')) {
    // Remove WhatsApp channel from connected channels
    const waIdx = connectedChannels.findIndex(ch => ch.channelType === 'whatsapp');
    if (waIdx !== -1) connectedChannels.splice(waIdx, 1);
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
    return { data: connectedChannels, status: 200 };
  }

  if (matchRoute(normalizedUrl, '/cross-company/signup')) {
    // Determine channel type from request data
    // @ts-ignore
    const reqData = typeof config?.data === 'string' ? JSON.parse(config.data) : config?.data || {};
    const channelType = reqData.channelType || reqData.channel_type || 'unknown';
    
    if (channelType === 'instagram' || normalizedUrl.includes('instagram')) {
      const igChannel = mockChannels.find(ch => ch.channelType === 'instagram') || {
        id: `ig-${Date.now()}`,
        username: '@tienda_moda_ok',
        channelName: 'Instagram',
        basePath: '/instagram',
        country: 'AR',
        actualStatus: { id: 1, name: 'Connected' },
        state: { name: 'Active' },
        channelType: 'instagram',
        bot_status: 'active',
      };
      if (!connectedChannels.some(ch => ch.channelType === 'instagram')) {
        connectedChannels.push({ ...igChannel, actualStatus: { id: 1, name: 'Connected' }, state: { name: 'Active' } });
      }
    } else if (channelType === 'facebook' || normalizedUrl.includes('facebook')) {
      const fbChannel = mockChannels.find(ch => ch.channelType === 'facebook') || {
        id: `fb-${Date.now()}`,
        username: 'Tienda Moda OK',
        channelName: 'Facebook',
        basePath: '/facebook',
        country: 'AR',
        actualStatus: { id: 1, name: 'Connected' },
        state: { name: 'Active' },
        channelType: 'facebook',
        bot_status: 'active',
      };
      if (!connectedChannels.some(ch => ch.channelType === 'facebook')) {
        connectedChannels.push({ ...fbChannel, actualStatus: { id: 1, name: 'Connected' }, state: { name: 'Active' } });
      }
    }
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

  const mockResponse = getMockResponse(config.url, config.method, config);

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

