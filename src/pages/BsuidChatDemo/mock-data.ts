export type IdentifierType = 'phone' | 'username' | 'bsuid_only';

export interface BsuidContact {
  identifierType: IdentifierType;
  name: string;
  phone?: string;
  username?: string;
  bsuid?: string;
}

export interface BsuidMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface BsuidConversation {
  id: string;
  contact: BsuidContact;
  messages: BsuidMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface MockTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  text: string;
}

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const MOCK_CONVERSATIONS: BsuidConversation[] = [
  {
    id: 'conv-phone',
    contact: {
      identifierType: 'phone',
      name: 'Maria Silva',
      phone: '+55 11 98765-4321',
    },
    messages: [
      { id: 'msg-1', conversationId: 'conv-phone', role: 'user', text: 'Oi, quero saber sobre o pedido #4521', timestamp: minutesAgo(30) },
      { id: 'msg-2', conversationId: 'conv-phone', role: 'assistant', text: 'Olá Maria! Seu pedido #4521 está em trânsito. Previsão de entrega: amanhã até as 18h.', timestamp: minutesAgo(28) },
      { id: 'msg-3', conversationId: 'conv-phone', role: 'user', text: 'Perfeito, obrigada!', timestamp: minutesAgo(25) },
    ],
    lastMessage: 'Perfeito, obrigada!',
    lastMessageTime: minutesAgo(25),
    unread: 1,
  },
  {
    id: 'conv-username',
    contact: {
      identifierType: 'username',
      name: 'João Pereira',
      username: '@joao.pereira',
    },
    messages: [
      { id: 'msg-4', conversationId: 'conv-username', role: 'user', text: 'Vocês têm a camiseta azul em tamanho M?', timestamp: minutesAgo(15) },
      { id: 'msg-5', conversationId: 'conv-username', role: 'assistant', text: 'Oi João! Sim, temos em estoque. Quer que eu envie o link para compra?', timestamp: minutesAgo(12) },
      { id: 'msg-6', conversationId: 'conv-username', role: 'user', text: 'Sim, por favor', timestamp: minutesAgo(10) },
      { id: 'msg-7', conversationId: 'conv-username', role: 'system', text: 'Este contacto usa username. Su número no está disponible.', timestamp: minutesAgo(10) },
    ],
    lastMessage: 'Sim, por favor',
    lastMessageTime: minutesAgo(10),
    unread: 2,
  },
  {
    id: 'conv-bsuid',
    contact: {
      identifierType: 'bsuid_only',
      name: 'Usuario sin identificar',
      bsuid: 'BSUID_a7f3e9b2c1d4',
    },
    messages: [
      { id: 'msg-8', conversationId: 'conv-bsuid', role: 'user', text: 'Quero trocar meu produto', timestamp: minutesAgo(5) },
      { id: 'msg-9', conversationId: 'conv-bsuid', role: 'assistant', text: 'Olá! Para processar a troca, preciso do número do seu pedido. Pode me informar?', timestamp: minutesAgo(3) },
      { id: 'msg-10', conversationId: 'conv-bsuid', role: 'system', text: 'Este contacto solo se identifica por BSUID. No se puede enviar templates de autenticación.', timestamp: minutesAgo(3) },
    ],
    lastMessage: 'Quero trocar meu produto',
    lastMessageTime: minutesAgo(5),
    unread: 0,
  },
];

export const MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Boas-vindas',
    category: 'MARKETING',
    text: 'Olá! Bem-vindo à nossa loja. Como posso ajudar?',
  },
  {
    id: 'tmpl-2',
    name: 'Status do pedido',
    category: 'UTILITY',
    text: 'Seu pedido está sendo preparado e será enviado em breve.',
  },
  {
    id: 'tmpl-3',
    name: 'Código de verificação',
    category: 'AUTHENTICATION',
    text: 'Seu código de verificação é: {{1}}. Não compartilhe com ninguém.',
  },
];
