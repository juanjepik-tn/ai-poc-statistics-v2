import { SYSTEM_MARKETING_TYPES, PAYMENT_MESSAGE_TYPES, PAYMENT_TAGS_TYPES, PAYMENT_MESSAGE_WHATSAPP_TYPES } from '@/constants/conversationTags';

export const isMarketingMessage = (classMessage: string): boolean => {
  return SYSTEM_MARKETING_TYPES.includes(classMessage as any);
};

export const isPaymentMessage = (classMessage: string): boolean => {
  return PAYMENT_MESSAGE_TYPES.includes(classMessage as any);
};

export const isPaymentTag = (tag: string): boolean => {
  return PAYMENT_TAGS_TYPES.includes(tag as any);
};

export const getSystemMessageContent = (classMessage: string, t: (key: string) => string) => {
  const messageMap = {
    'message-payment-link': 'conversations.payment-link-message',
    'message-one-click-payment': 'conversations.message-one-click-payment',
    'message-template-marketing': 'conversations.marketing-message'
  };
  
  const translationKey = messageMap[classMessage as keyof typeof messageMap];
  return translationKey ? t(translationKey) : '';
};

export const isPaymentMessageWhatsapp = (classMessage: string): boolean => {
  return PAYMENT_MESSAGE_WHATSAPP_TYPES.includes(classMessage as any);
};