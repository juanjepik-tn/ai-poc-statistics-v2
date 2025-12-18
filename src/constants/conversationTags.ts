export const conversationTags = [    
    'all',  
    'image',
    'Wholesale Order',
    'Customize Order',
    'Get Order Status',
    'Modify Order In Progress',
    'Return Or Exchange Order',
    'Delivery Coordination',            
    'Human Request',
    'link-checkout',
    'one-click-payment',
    'cart-sent'
  ];

  export const SYSTEM_MARKETING_TYPES = [ 
    'message-template-marketing'
  ] as const;

  export const PAYMENT_MESSAGE_TYPES = [
    'message-botpayment',
    'message-payment-link',
    'message-one-click-payment'
  ] as const;

  export const PAYMENT_TAGS_TYPES = [
    'link-checkout',
    'one-click-payment',
  ] as const;

export const PAYMENT_MESSAGE_WHATSAPP_TYPES = [
  'message-payment-link',
  'message-one-click-payment'
] as const;
