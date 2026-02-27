import React, { createContext, useCallback, useContext, useState } from 'react';

export type IdentifierType = 'phone' | 'username' | 'bsuid_only';

export interface BsuidCustomer {
  id: number;
  name: string;
  phone?: string;
  username?: string;
  bsuid?: string;
  identifierType: IdentifierType;
  state: { name: string; id: number };
  frecuent: boolean;
  undoneHumanAttentionTags: any[];
  undoneTaggedTags: any[];
}

export interface BsuidConversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  customer: BsuidCustomer;
  channel: { id: number; channelName: string; channelType: string; store: number; username: string; state: { name: string } };
  unreadMessages: number;
  lastMessage: any;
  messagesPanel: any[];
  messages: any[];
  chatSummary: string;
  conversationSummary: string;
  qualification: any;
  virtual_assistant_failed: boolean;
  isPaused: boolean;
  assignee: any;
}

export type ContactInfoRequestState = 'idle' | 'sent' | 'received';

interface BsuidModeContextType {
  isBsuidMode: boolean;
  toggleBsuidMode: () => void;
  bsuidConversations: BsuidConversation[];
  currentBsuidConversation: BsuidConversation | null;
  setCurrentBsuidConversation: (conv: BsuidConversation | null) => void;
  bsuidMessages: any[];
  contactInfoRequestState: Record<string, ContactInfoRequestState>;
  requestContactInfo: (conversationId: string) => void;
  getIdentifierDisplay: (customer: BsuidCustomer) => { label: string; sublabel: string; badgeType?: 'username' | 'bsuid' };
}

const BsuidModeContext = createContext<BsuidModeContextType>({
  isBsuidMode: false,
  toggleBsuidMode: () => {},
  bsuidConversations: [],
  currentBsuidConversation: null,
  setCurrentBsuidConversation: () => {},
  bsuidMessages: [],
  contactInfoRequestState: {},
  requestContactInfo: () => {},
  getIdentifierDisplay: () => ({ label: '', sublabel: '' }),
});

export const useBsuidMode = () => useContext(BsuidModeContext);

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

const BSUID_MOCK_CONVERSATIONS: BsuidConversation[] = [
  {
    id: 'bsuid-1',
    name: 'María López',
    username: '+54 11 5555-1234',
    avatar: '',
    customer: {
      id: 9001,
      name: 'María López',
      phone: '+54 11 5555-1234',
      username: '+54 11 5555-1234',
      identifierType: 'phone',
      state: { name: 'Active', id: 1 },
      frecuent: true,
      undoneHumanAttentionTags: [],
      undoneTaggedTags: [],
    },
    channel: { id: 1, channelName: 'WhatsappBusiness', channelType: 'whatsapp', store: 1, username: '+55 11 9999-0001', state: { name: 'Active' } },
    unreadMessages: 1,
    lastMessage: { id: 103, content: 'Perfecto, quedo atenta entonces!', created_at: minutesAgo(5), role: 'customer', class: 'message-customer', saw: false },
    messagesPanel: [],
    messages: [],
    chatSummary: 'Consulta sobre envío de pedido',
    conversationSummary: 'Consulta sobre envío',
    qualification: null,
    virtual_assistant_failed: false,
    isPaused: false,
    assignee: null,
  },
  {
    id: 'bsuid-2',
    name: 'Carlos Tienda',
    username: '@carlos.tienda',
    avatar: '',
    customer: {
      id: 9002,
      name: 'Carlos Tienda',
      username: '@carlos.tienda',
      identifierType: 'username',
      bsuid: 'US.98234718293847561234',
      state: { name: 'Active', id: 1 },
      frecuent: false,
      undoneHumanAttentionTags: [],
      undoneTaggedTags: [],
    },
    channel: { id: 1, channelName: 'WhatsappBusiness', channelType: 'whatsapp', store: 1, username: '+55 11 9999-0001', state: { name: 'Active' } },
    unreadMessages: 2,
    lastMessage: { id: 203, content: 'Tienen este modelo en talle L?', created_at: minutesAgo(12), role: 'customer', class: 'message-customer', saw: false },
    messagesPanel: [],
    messages: [],
    chatSummary: 'Consulta de stock y talles',
    conversationSummary: 'Consulta de talles',
    qualification: null,
    virtual_assistant_failed: false,
    isPaused: false,
    assignee: null,
  },
  {
    id: 'bsuid-3',
    name: 'Usuario sin identificar',
    username: 'US.1349...1918',
    avatar: '',
    customer: {
      id: 9003,
      name: 'Usuario sin identificar',
      identifierType: 'bsuid_only',
      bsuid: 'US.13491208655302741918',
      state: { name: 'Active', id: 1 },
      frecuent: false,
      undoneHumanAttentionTags: [],
      undoneTaggedTags: [],
    },
    channel: { id: 1, channelName: 'WhatsappBusiness', channelType: 'whatsapp', store: 1, username: '+55 11 9999-0001', state: { name: 'Active' } },
    unreadMessages: 0,
    lastMessage: { id: 303, content: 'Hola, quería hacer un reclamo por un pedido', created_at: minutesAgo(45), role: 'customer', class: 'message-customer', saw: true },
    messagesPanel: [],
    messages: [],
    chatSummary: 'Reclamo por pedido dañado',
    conversationSummary: 'Reclamo de pedido',
    qualification: null,
    virtual_assistant_failed: false,
    isPaused: false,
    assignee: null,
  },
];

const BSUID_MOCK_MESSAGES: Record<string, any[]> = {
  'bsuid-1': [
    { id: 101, content: 'Hola! Quería saber cuándo llega mi pedido #4521', created_at: minutesAgo(30), role: 'customer', class: 'message-customer', saw: true, fromApp: false, hasImage: false },
    { id: 102, content: 'Hola María! Tu pedido #4521 fue despachado ayer y llega entre mañana y pasado. Te paso el tracking: https://tracking.example.com/4521', created_at: minutesAgo(25), role: 'assistant', class: 'message-bot', saw: true, fromApp: false, hasImage: false },
    { id: 103, content: 'Perfecto, quedo atenta entonces!', created_at: minutesAgo(5), role: 'customer', class: 'message-customer', saw: false, fromApp: false, hasImage: false },
  ],
  'bsuid-2': [
    { id: 201, content: 'Buenas! Vi una remera en la tienda que me gustó mucho', created_at: minutesAgo(60), role: 'customer', class: 'message-customer', saw: true, fromApp: false, hasImage: false },
    { id: 202, content: 'Hola! Claro, ¿cuál modelo te interesa? Te ayudo con stock y talles.', created_at: minutesAgo(55), role: 'assistant', class: 'message-bot', saw: true, fromApp: false, hasImage: false },
    { id: 203, content: 'Tienen este modelo en talle L?', created_at: minutesAgo(12), role: 'customer', class: 'message-customer', saw: false, fromApp: false, hasImage: false },
    { id: 204, content: 'Sí, tenemos stock en talle L. ¿Querés que te arme el pedido?', created_at: minutesAgo(10), role: 'assistant', class: 'message-bot', saw: true, fromApp: false, hasImage: false },
  ],
  'bsuid-3': [
    { id: 301, content: 'Hola, quería hacer un reclamo por un pedido', created_at: minutesAgo(120), role: 'customer', class: 'message-customer', saw: true, fromApp: false, hasImage: false },
    { id: 302, content: 'Hola! Lamento escuchar eso. ¿Podrías indicarme el número de pedido así lo reviso?', created_at: minutesAgo(115), role: 'assistant', class: 'message-bot', saw: true, fromApp: false, hasImage: false },
    { id: 303, content: 'Es el pedido #6789, llegó con el paquete dañado', created_at: minutesAgo(45), role: 'customer', class: 'message-customer', saw: true, fromApp: false, hasImage: false },
  ],
};

export const BsuidModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBsuidMode, setIsBsuidMode] = useState(false);
  const [currentBsuidConversation, setCurrentBsuidConversation] = useState<BsuidConversation | null>(null);
  const [contactInfoRequestState, setContactInfoRequestState] = useState<Record<string, ContactInfoRequestState>>({});

  const toggleBsuidMode = useCallback(() => {
    setIsBsuidMode(prev => {
      if (prev) setCurrentBsuidConversation(null);
      return !prev;
    });
  }, []);

  const bsuidMessages = currentBsuidConversation
    ? BSUID_MOCK_MESSAGES[currentBsuidConversation.id] || []
    : [];

  const requestContactInfo = useCallback((conversationId: string) => {
    setContactInfoRequestState(prev => ({ ...prev, [conversationId]: 'sent' }));
    setTimeout(() => {
      setContactInfoRequestState(prev => ({ ...prev, [conversationId]: 'received' }));
      const conv = BSUID_MOCK_CONVERSATIONS.find(c => c.id === conversationId);
      if (conv && conv.customer.identifierType !== 'phone') {
        conv.customer.phone = '+54 11 5555-9876';
      }
    }, 3000);
  }, []);

  const getIdentifierDisplay = useCallback((customer: BsuidCustomer) => {
    switch (customer.identifierType) {
      case 'phone':
        return { label: customer.name, sublabel: customer.phone || '' };
      case 'username':
        return { label: customer.name, sublabel: customer.username || '', badgeType: 'username' as const };
      case 'bsuid_only':
        return {
          label: 'Usuario sin identificar',
          sublabel: customer.bsuid ? `${customer.bsuid.substring(0, 6)}...${customer.bsuid.slice(-4)}` : '',
          badgeType: 'bsuid' as const,
        };
      default:
        return { label: customer.name, sublabel: '' };
    }
  }, []);

  return (
    <BsuidModeContext.Provider
      value={{
        isBsuidMode,
        toggleBsuidMode,
        bsuidConversations: BSUID_MOCK_CONVERSATIONS,
        currentBsuidConversation,
        setCurrentBsuidConversation,
        bsuidMessages,
        contactInfoRequestState,
        requestContactInfo,
        getIdentifierDisplay,
      }}
    >
      {children}
    </BsuidModeContext.Provider>
  );
};

export default BsuidModeProvider;
