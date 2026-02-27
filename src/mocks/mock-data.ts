/**
 * Mock Data for POC UI Playground
 * This file contains all fake data used to simulate API responses
 */

// ============================================
// STORE & SESSION DATA
// ============================================

export const mockStoreInfo = {
  id: 12345,
  name: 'Tienda Demo POC',
  url: 'https://tienda-demo.mitiendanube.com',
  email: 'demo@tienda.com',
  language: 'es',
  country: 'AR',
  currency: 'ARS',
  operationMode: 1,
  hasWhatsapp: true,
  hasWhatsappBusiness: true,
  iaEnabled: true,
  tags: ['whatsapp_business', 'ia_enabled', 'premium'],
};

export const mockSessionData = {
  user: {
    id: 1,
    username: 'user_12345',
    email: 'demo@tienda.com',
    store_id: 12345,
  },
  token: 'mock-jwt-token-for-development-only',
};

// ============================================
// BILLING DATA
// ============================================

export const mockBillingData = {
  billingPlan: {
    name: 'Plan Pro',
    price: 29990,
    currency: 'ARS',
    dayLeft: 15,
  },
  activeStatus: true,
  status: 'active' as const,
  isCostumerInvoice: false,
};

export const mockPlans = {
  plans: [
    {
      id: 1,
      name: 'tier-free',
      costPerChat: '0',
      country: { country: 'AR', currency: 'ARS', id: 1 },
      chatsMax: 50,
      chatsMin: 0,
    },
    {
      id: 2,
      name: 'tier-1',
      costPerChat: '150',
      country: { country: 'AR', currency: 'ARS', id: 1 },
      chatsMax: 200,
      chatsMin: 51,
    },
    {
      id: 3,
      name: 'tier-2',
      costPerChat: '120',
      country: { country: 'AR', currency: 'ARS', id: 1 },
      chatsMax: 500,
      chatsMin: 201,
    },
    {
      id: 4,
      name: 'tier-3',
      costPerChat: '100',
      country: { country: 'AR', currency: 'ARS', id: 1 },
      chatsMax: 1000,
      chatsMin: 501,
    },
    {
      id: 5,
      name: 'tier-top',
      costPerChat: '80',
      country: { country: 'AR', currency: 'ARS', id: 1 },
      chatsMax: 999999,
      chatsMin: 1001,
    },
  ],
  plansSelected: {
    tier: 'tier-2',
  },
};

export const mockCurrentCycle = {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  totalChats: 342,
  totalCost: 41040,
  currency: 'ARS',
};

export const mockPaymentsHistory = [
  { id: 1, date: '2023-12-01', amount: 35000, status: 'paid', chats: 290 },
  { id: 2, date: '2023-11-01', amount: 28000, status: 'paid', chats: 230 },
  { id: 3, date: '2023-10-01', amount: 42000, status: 'paid', chats: 350 },
  { id: 4, date: '2023-09-01', amount: 38500, status: 'paid', chats: 320 },
];

// ============================================
// STATISTICS DATA
// ============================================

const generateDailyStats = () => {
  const stats = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    stats.push({
      date: date.toISOString().split('T')[0],
      bot_messages: Math.floor(Math.random() * 150) + 50,
      store_messages: Math.floor(Math.random() * 30) + 10,
      customer_messages: Math.floor(Math.random() * 100) + 40,
    });
  }
  return stats;
};

export const mockStatistics = {
  conversations: 847,
  conversations_with_bot_message: 723,
  conversations_full_ai: 0.68,
  messages: {
    bot: 12450,
    customer: 8320,
    merchant: 1890,
  },
  messages_grouped: generateDailyStats(),
};

// ============================================
// CONVERSATIONS DATA - POBLADO COMPLETO
// ============================================

const mockChannelWhatsApp = {
  id: 'ch-001',
  channelName: 'WhatsApp Business',
  store: { id: 12345 },
  username: '+5491112345678',
  bot_status: 'active',
  whatsapp_status: 'connected',
  state: { name: 'Active' },
  channelType: 'whatsapp' as const,
};

const mockChannelInstagram = {
  id: 'ch-002',
  channelName: 'Instagram',
  store: { id: 12345 },
  username: '@mi_tienda_ok',
  bot_status: 'active',
  whatsapp_status: 'connected',
  state: { name: 'Active' },
  channelType: 'instagram' as const,
};

const mockChannelFacebook = {
  id: 'ch-003',
  channelName: 'Facebook Messenger',
  store: { id: 12345 },
  username: 'Mi Tienda OK',
  bot_status: 'active',
  whatsapp_status: 'connected',
  state: { name: 'Active' },
  channelType: 'facebook' as const,
};

// Clientes con diferentes estados y configuraciones
const mockCustomers = [
  { 
    id: 1, 
    name: 'Luciana Rodríguez', 
    username: '+5491145678901', 
    phone: '+5491145678901',
    state: { name: 'Active', id: 1 },
    frecuent: true,
    undoneHumanAttentionTags: [
      { id: 101, name: 'Human Request', summary: 'Cliente solicita hablar con un humano' }
    ],
    undoneTaggedTags: []
  },
  { 
    id: 2, 
    name: 'Martín González', 
    username: '@martin.gonzalez', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 201, name: 'cart-sent', summary: 'Carrito enviado' },
      { id: 202, name: 'link-checkout', summary: 'Link de checkout generado' }
    ]
  },
  { 
    id: 3, 
    name: 'Camila Fernández', 
    username: '+5491167890123', 
    phone: '+5491167890123',
    state: { name: 'Paused', id: 2 },
    frecuent: true,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 301, name: 'Get Order Status', summary: 'Consulta estado de pedido' }
    ]
  },
  { 
    id: 4, 
    name: 'Tomás Sánchez', 
    username: '@tomas_sanchez', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [
      { id: 401, name: 'Return Or Exchange Order', summary: 'Solicita devolución o cambio' }
    ],
    undoneTaggedTags: [
      { id: 402, name: 'Delivery Coordination', summary: 'Coordinar entrega' }
    ]
  },
  { 
    id: 5, 
    name: 'Valentina López', 
    username: '+5491189012345', 
    phone: '+5491189012345',
    state: { name: 'Active', id: 1 },
    frecuent: true,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: []
  },
  { 
    id: 6, 
    name: 'Sebastián Martínez', 
    username: '@seba.martinez', 
    phone: null,
    state: { name: 'Copilot', id: 3 },
    frecuent: false,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 601, name: 'Wholesale Order', summary: 'Pedido mayorista' }
    ]
  },
  { 
    id: 7, 
    name: 'Florencia Díaz', 
    username: '+5491101234567', 
    phone: '+5491101234567',
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 701, name: 'one-click-payment', summary: 'Pago con un click' }
    ]
  },
  { 
    id: 8, 
    name: 'Nicolás Torres', 
    username: '+5491112345678', 
    phone: '+5491112345678',
    state: { name: 'Active', id: 1 },
    frecuent: true,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 801, name: 'Modify Order In Progress', summary: 'Modificar pedido en curso' }
    ]
  },
  { 
    id: 9, 
    name: 'Isabella García', 
    username: '@isa.garcia', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: []
  },
  { 
    id: 10, 
    name: 'Agustín Pérez', 
    username: '+5491134567890', 
    phone: '+5491134567890',
    state: { name: 'Active', id: 1 },
    frecuent: true,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 1001, name: 'Customize Order', summary: 'Pedido personalizado' }
    ]
  },
  { 
    id: 11, 
    name: 'Julieta Ramírez', 
    username: '@juli.ramirez', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [
      { id: 1101, name: 'Human Request', summary: 'Requiere atención humana' }
    ],
    undoneTaggedTags: [
      { id: 1102, name: 'Get Order Status', summary: 'Estado del pedido' },
      { id: 1103, name: 'Delivery Coordination', summary: 'Coordinar entrega' }
    ]
  },
  { 
    id: 12, 
    name: 'Mateo Hernández', 
    username: '+5491156789013', 
    phone: '+5491156789013',
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: []
  },
  // Clientes de Facebook Messenger
  { 
    id: 13, 
    name: 'Carolina Vega', 
    username: 'carolina.vega.fb', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: true,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 1301, name: 'cart-sent', summary: 'Carrito enviado' }
    ]
  },
  { 
    id: 14, 
    name: 'Diego Morales', 
    username: 'diego.morales.92', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [
      { id: 1401, name: 'Human Request', summary: 'Solicita atención humana' }
    ],
    undoneTaggedTags: []
  },
  { 
    id: 15, 
    name: 'Ana Belén Castro', 
    username: 'anabelen.castro', 
    phone: null,
    state: { name: 'Active', id: 1 },
    frecuent: false,
    undoneHumanAttentionTags: [],
    undoneTaggedTags: [
      { id: 1501, name: 'Get Order Status', summary: 'Consulta estado de pedido' }
    ]
  },
];

// WhatsApp conversations: timestamps shifted >24h to demonstrate Direct Send / 24h expired window
const WA_OFFSET = 60000 * 60 * 26; // 26 hours in ms
const waTime = (minutesAgo: number) => new Date(Date.now() - WA_OFFSET - 60000 * minutesAgo).toISOString();

// Conversación 1: Cliente con solicitud de atención humana (Human Request)
const messagesConv1 = [
  {
    id: 101,
    content: 'Hola! Necesito ayuda urgente con mi pedido',
    created_at: waTime(30),
    saw: true,
    mimetype: null,
    username: '+5491145678901',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 102,
    content: '¡Hola Luciana! 👋 Bienvenida a nuestra tienda. Veo que necesitás ayuda con tu pedido. ¿Me podés contar qué pasó para poder asistirte?',
    created_at: waTime(29),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-101-1',
    response_score: 10,
  },
  {
    id: 103,
    content: 'Mi pedido #45678 llegó incompleto, falta una remera que pagué',
    created_at: waTime(28),
    saw: true,
    mimetype: null,
    username: '+5491145678901',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 104,
    content: 'Lamento mucho escuchar eso, Luciana. Entiendo tu frustración. Voy a verificar tu pedido #45678 para ayudarte a resolver esto. ¿Me podés confirmar cuál era la remera que faltaba?',
    created_at: waTime(27),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-101-2',
    response_score: null,
  },
  {
    id: 105,
    content: 'La remera negra talle M, la básica de algodón',
    created_at: waTime(25),
    saw: true,
    mimetype: null,
    username: '+5491145678901',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 106,
    content: 'Necesito hablar con una persona real, por favor. Esto ya me pasó antes y no quiero que me vuelva a pasar',
    created_at: waTime(10),
    saw: true,
    mimetype: null,
    username: '+5491145678901',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
];

// Conversación 2: Carrito enviado con link de checkout
const messagesConv2 = [
  {
    id: 201,
    content: 'Buenas tardes, me interesa comprar varias prendas',
    created_at: new Date(Date.now() - 60000 * 120).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491156789012',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 202,
    content: '¡Buenas tardes Martín! 🛍️ Con gusto te ayudo. ¿Qué prendas te interesan?',
    created_at: new Date(Date.now() - 60000 * 119).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-201-1',
    response_score: 10,
  },
  {
    id: 203,
    content: 'Quiero 2 remeras básicas talle L, una negra y una blanca. Y un jean azul talle 32',
    created_at: new Date(Date.now() - 60000 * 115).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491156789012',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 204,
    content: '¡Excelente elección! 👕👖 Te armo el carrito:\n\n• Remera Básica Negra Talle L - $12.990\n• Remera Básica Blanca Talle L - $12.990\n• Jean Clásico Azul Talle 32 - $34.990\n\n¿Querés que te genere el link de pago?',
    created_at: new Date(Date.now() - 60000 * 114).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-201-2',
    response_score: 10,
  },
  {
    id: 205,
    content: 'Sí, por favor!',
    created_at: new Date(Date.now() - 60000 * 110).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491156789012',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 206,
    content: '🛒 Carrito generado',
    created_at: new Date(Date.now() - 60000 * 109).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-botpayment',
    fromApp: true,
    hasImage: false,
    run_id: 'run-201-3',
    response_score: null,
    decodedContent: {
      cart: {
        items: [
          { id: 1, name: 'Remera Básica Negra Talle L', quantity: 1, price: '12990' },
          { id: 2, name: 'Remera Básica Blanca Talle L', quantity: 1, price: '12990' },
          { id: 3, name: 'Jean Clásico Azul Talle 32', quantity: 1, price: '34990' },
        ],
        subtotal: '60970',
        shipping: '2500',
        discount: 0,
        total: '63470',
        currency: 'ARS',
        url: 'https://tienda-demo.mitiendanube.com/checkout/abc123'
      }
    }
  },
];

// Conversación 3: Consulta estado de pedido (cliente pausado)
const messagesConv3 = [
  {
    id: 301,
    content: 'Hola, quiero saber dónde está mi pedido',
    created_at: waTime(180),
    saw: true,
    mimetype: null,
    username: '+5491167890123',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 302,
    content: '¡Hola Camila! 📦 Con gusto te ayudo a rastrear tu pedido. ¿Me podés pasar el número de pedido o el código de seguimiento?',
    created_at: waTime(179),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-301-1',
    response_score: 10,
  },
  {
    id: 303,
    content: 'El número es #78432',
    created_at: waTime(175),
    saw: true,
    mimetype: null,
    username: '+5491167890123',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 304,
    content: 'Perfecto, encontré tu pedido #78432. 🚚 Tu paquete salió hoy del centro de distribución y está en camino. El código de seguimiento de Andreani es: AND789456123. Estimamos que llegue mañana entre las 9 y 18hs.',
    created_at: waTime(174),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-301-2',
    response_score: 10,
  },
  {
    id: 305,
    content: 'Genial, gracias! Puedo pedir que lo dejen en la puerta?',
    created_at: waTime(170),
    saw: true,
    mimetype: null,
    username: '+5491167890123',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 306,
    content: 'Entiendo, Camila. Para instrucciones especiales de entrega, te recomiendo contactar directamente a Andreani al 0800-122-1112 o desde su web con tu código de seguimiento. Ellos pueden coordinar dejar el paquete en la puerta si es posible en tu zona. 📞',
    created_at: waTime(169),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-301-3',
    response_score: null,
  },
];

// Conversación 4: Solicitud de devolución con mensaje fallido
const messagesConv4 = [
  {
    id: 401,
    content: 'Hola, necesito devolver un producto que compré la semana pasada',
    created_at: new Date(Date.now() - 60000 * 90).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491178901234',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 402,
    content: '¡Hola Tomás! Lamento que necesites hacer una devolución. 📋 Tenés 30 días para devolver productos sin uso y con etiquetas. ¿Cuál es el producto y el motivo de la devolución?',
    created_at: new Date(Date.now() - 60000 * 89).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-401-1',
    response_score: 0,
  },
  {
    id: 403,
    content: 'Es la campera de cuero, me queda grande. Pedí talle M pero creo que necesito S',
    created_at: new Date(Date.now() - 60000 * 85).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491178901234',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 404,
    content: null,
    created_at: new Date(Date.now() - 60000 * 84).toISOString(),
    saw: true,
    mimetype: 'image/jpeg',
    username: '+5491178901234',
    role: 'customer',
    class: 'message-customer-image',
    fromApp: false,
    hasImage: true,
    run_id: null,
    response_score: null,
    extra_data: 'https://picsum.photos/seed/jacket/400/400',
  },
  {
    id: 405,
    content: 'Gracias por la foto, Tomás. Veo que es la Campera de Cuero Premium. Podemos hacer el cambio por talle S sin problema. ¿Preferís que te enviemos el nuevo talle y después nos devolvés el M, o querés coordinar una recolección?',
    created_at: new Date(Date.now() - 60000 * 83).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-401-2',
    response_score: null,
    meta_status_history: [
      { status: 'failed', timestamp: new Date(Date.now() - 60000 * 83).toISOString(), error: { code: 131047, title: 'Message failed to send', message: 'Re-engagement message' } }
    ],
  },
];

// Conversación 5: Conversación fluida sin tags (cliente satisfecho)
const messagesConv5 = [
  {
    id: 501,
    content: 'Hola! Vi en Instagram que tienen nuevas zapatillas 👟',
    created_at: waTime(240),
    saw: true,
    mimetype: null,
    username: '+5491189012345',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 502,
    content: '¡Hola Valentina! 👋 Sí, llegaron las nuevas zapatillas Running Pro. Tenemos varios modelos y colores. ¿Buscás algo para correr o más casuales?',
    created_at: waTime(239),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-501-1',
    response_score: 10,
  },
  {
    id: 503,
    content: 'Para correr! Uso talle 38',
    created_at: waTime(235),
    saw: true,
    mimetype: null,
    username: '+5491189012345',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 504,
    content: '¡Genial! 🏃‍♀️ En talle 38 tenemos:\n\n1. Running Pro Air - Blanca/Rosa - $45.990\n2. Running Pro Max - Negra/Verde - $52.990\n3. Running Pro Lite - Gris/Naranja - $39.990\n\nTodas tienen amortiguación premium y son ideales para distancias largas. ¿Querés ver fotos de alguna?',
    created_at: waTime(234),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-501-2',
    response_score: 10,
  },
  {
    id: 505,
    content: 'La blanca y rosa por favor!',
    created_at: waTime(230),
    saw: true,
    mimetype: null,
    username: '+5491189012345',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 506,
    content: null,
    created_at: waTime(229),
    saw: true,
    mimetype: 'image/jpeg',
    username: null,
    role: 'assistant',
    class: 'message-storeimage',
    fromApp: true,
    hasImage: true,
    run_id: null,
    response_score: null,
    extra_data: 'https://picsum.photos/seed/shoes-pink/400/400',
  },
  {
    id: 507,
    content: 'Acá tenés la Running Pro Air! 💕 Tiene malla transpirable, suela de goma antideslizante y plantilla memory foam. Es la favorita de nuestras clientas runners.',
    created_at: waTime(228),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-501-3',
    response_score: 10,
  },
  {
    id: 508,
    content: 'Me encantan! Las quiero 😍',
    created_at: waTime(225),
    saw: true,
    mimetype: null,
    username: '+5491189012345',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 509,
    content: '🛒 Carrito generado',
    created_at: waTime(224),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-botpayment',
    fromApp: true,
    hasImage: false,
    run_id: 'run-501-4',
    response_score: null,
    decodedContent: {
      cart: {
        items: [
          { id: 1, name: 'Running Pro Air - Blanca/Rosa Talle 38', quantity: 1, price: '45990' },
        ],
        subtotal: '45990',
        shipping: '0',
        discount: 0,
        total: '45990',
        currency: 'ARS',
        url: 'https://tienda-demo.mitiendanube.com/checkout/xyz789'
      }
    }
  },
  {
    id: 510,
    content: 'Listo, ya pagué! Gracias por la atención 🙏',
    created_at: waTime(220),
    saw: true,
    mimetype: null,
    username: '+5491189012345',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 511,
    content: '¡Excelente Valentina! 🎉 Tu pedido #98765 fue confirmado. Te va a llegar en 2-3 días hábiles. Te enviamos el código de seguimiento por mail. ¡Gracias por tu compra y que disfrutes tus nuevas zapatillas!',
    created_at: waTime(219),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-501-5',
    response_score: 10,
  },
];

// Conversación 6: Pedido mayorista (modo Copilot)
const messagesConv6 = [
  {
    id: 601,
    content: 'Buenos días, me interesa hacer un pedido mayorista para mi local',
    created_at: new Date(Date.now() - 60000 * 300).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491190123456',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 602,
    content: '¡Buenos días Sebastián! 🏪 Qué bueno que te interese comprar mayorista. Ofrecemos descuentos especiales a partir de 10 unidades por modelo. ¿Qué tipo de productos te interesan y qué cantidades estás buscando?',
    created_at: new Date(Date.now() - 60000 * 299).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-601-1',
    response_score: 10,
  },
  {
    id: 603,
    content: 'Necesito 50 remeras básicas surtidas en talles y colores, y 30 buzos hoodie',
    created_at: new Date(Date.now() - 60000 * 295).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491190123456',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 604,
    content: '¡Perfecto! Para ese volumen tenemos precios especiales:\n\n📦 50 Remeras Básicas:\n• Precio unitario mayorista: $8.500 (vs $12.990 minorista)\n• Subtotal: $425.000\n\n📦 30 Buzos Hoodie:\n• Precio unitario mayorista: $18.500 (vs $27.990 minorista)\n• Subtotal: $555.000\n\n💰 Total: $980.000 (ahorrás $411.200)\n\n¿Querés que te pase la distribución de talles recomendada?',
    created_at: new Date(Date.now() - 60000 * 294).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-601-2',
    response_score: null,
  },
  {
    id: 605,
    content: 'Sí, y también necesito saber las formas de pago mayorista',
    created_at: new Date(Date.now() - 60000 * 290).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491190123456',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
];

// Conversación 7: One-click payment
const messagesConv7 = [
  {
    id: 701,
    content: 'Hola! Quiero comprar el vestido floral que vi',
    created_at: waTime(60),
    saw: true,
    mimetype: null,
    username: '+5491101234567',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 702,
    content: '¡Hola Florencia! 🌸 El Vestido Floral Primavera es hermoso. Tenemos talles S, M y L. ¿Cuál necesitás?',
    created_at: waTime(59),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-701-1',
    response_score: 10,
  },
  {
    id: 703,
    content: 'Talle M!',
    created_at: waTime(55),
    saw: true,
    mimetype: null,
    username: '+5491101234567',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 704,
    content: 'Perfecto! El Vestido Floral Primavera talle M está $28.990. Tenés envío gratis porque superás los $25.000. ¿Te genero el link de pago rápido?',
    created_at: waTime(54),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-701-2',
    response_score: 10,
  },
  {
    id: 705,
    content: 'Dale!',
    created_at: waTime(50),
    saw: true,
    mimetype: null,
    username: '+5491101234567',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 706,
    content: '💳 Link de pago generado',
    created_at: waTime(49),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-one-click-payment',
    fromApp: true,
    hasImage: false,
    run_id: 'run-701-3',
    response_score: null,
    decodedContent: {
      cart: {
        items: [
          { id: 1, name: 'Vestido Floral Primavera Talle M', quantity: 1, price: '28990' },
        ],
        subtotal: '28990',
        shipping: '0',
        discount: 0,
        total: '28990',
        currency: 'ARS',
        url: 'https://tienda-demo.mitiendanube.com/checkout/oneclick123'
      }
    }
  },
];

// Conversación 8: Modificar pedido en curso con mensaje de audio
const messagesConv8 = [
  {
    id: 801,
    content: 'Hola! Acabo de hacer un pedido pero quiero agregar algo más',
    created_at: waTime(45),
    saw: true,
    mimetype: null,
    username: '+5491112345678',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 802,
    content: '¡Hola Nicolás! 📝 Si tu pedido todavía no fue despachado, podemos modificarlo. ¿Me pasás el número de pedido?',
    created_at: waTime(44),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-801-1',
    response_score: 10,
  },
  {
    id: 803,
    content: null,
    created_at: waTime(40),
    saw: true,
    mimetype: 'audio/ogg',
    username: '+5491112345678',
    role: 'customer',
    class: 'message-customer-audio',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
    extra_data: null,
  },
  {
    id: 804,
    content: 'Escuché tu audio, Nicolás. Entendí que tu pedido es el #45123 y querés agregar un cinturón negro talle 85. Deja que lo verifico... ✅ Sí, el pedido está en preparación todavía. El cinturón de cuero negro talle 85 está $12.990. ¿Lo agrego?',
    created_at: waTime(39),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-801-2',
    response_score: null,
  },
  {
    id: 805,
    content: 'Sí, agregalo por favor',
    created_at: waTime(35),
    saw: true,
    mimetype: null,
    username: '+5491112345678',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
];

// Conversación 9: Consulta simple sin tags
const messagesConv9 = [
  {
    id: 901,
    content: 'Hola, tienen local físico?',
    created_at: new Date(Date.now() - 60000 * 360).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491123456789',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 902,
    content: '¡Hola Isabella! 🏬 Sí, tenemos un local en Palermo, Buenos Aires. Estamos en Av. Santa Fe 4567, cerca del subte D. El horario es Lunes a Viernes de 10 a 19hs, y Sábados de 10 a 14hs.',
    created_at: new Date(Date.now() - 60000 * 359).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-901-1',
    response_score: 10,
  },
  {
    id: 903,
    content: 'Genial! Puedo ir a probarme ropa ahí?',
    created_at: new Date(Date.now() - 60000 * 355).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491123456789',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 904,
    content: '¡Por supuesto! 👗 Tenemos probadores y todo el stock disponible. También podés comprar online y retirar en el local sin costo de envío. Te esperamos!',
    created_at: new Date(Date.now() - 60000 * 354).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-901-2',
    response_score: 10,
  },
];

// Conversación 10: Pedido personalizado con respuesta de tienda
const messagesConv10 = [
  {
    id: 1001,
    content: 'Hola, hacen estampados personalizados?',
    created_at: waTime(150),
    saw: true,
    mimetype: null,
    username: '+5491134567890',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1002,
    content: '¡Hola Agustín! 🎨 Sí, hacemos estampados personalizados en remeras, buzos y gorras. El mínimo es de 12 unidades por diseño. ¿Qué tenés en mente?',
    created_at: waTime(149),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-1001-1',
    response_score: 10,
  },
  {
    id: 1003,
    content: 'Quiero hacer remeras para el equipo de fútbol de mi empresa, somos 20. Tienen el logo de la empresa',
    created_at: waTime(145),
    saw: true,
    mimetype: null,
    username: '+5491134567890',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1004,
    content: null,
    created_at: waTime(144),
    saw: true,
    mimetype: 'image/jpeg',
    username: '+5491134567890',
    role: 'customer',
    class: 'message-customer-image',
    fromApp: false,
    hasImage: true,
    run_id: null,
    response_score: null,
    extra_data: 'https://picsum.photos/seed/logo/400/400',
  },
  {
    id: 1005,
    content: '¡Qué buen logo! ⚽ Para 20 remeras deportivas con estampado personalizado, el precio es:\n\n• Remera Deportiva + Estampado: $11.500 c/u\n• Total: $230.000\n• Tiempo de producción: 5-7 días hábiles\n\n¿Querés que te haga un mockup con tu logo?',
    created_at: waTime(143),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-1001-2',
    response_score: null,
  },
  {
    id: 1006,
    content: 'Sí! Y pregunta: se puede poner el número de cada jugador atrás?',
    created_at: waTime(140),
    saw: true,
    mimetype: null,
    username: '+5491134567890',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1007,
    content: 'Hola Agustín! Soy Mariana del equipo de personalización. Sí, podemos agregar números en la espalda. Tiene un costo adicional de $1.500 por remera. Te preparo el mockup con el logo adelante y un ejemplo de número atrás. Te lo mando por acá en unas horas.',
    created_at: waTime(130),
    saw: true,
    mimetype: null,
    username: null,
    role: 'store',
    class: 'message-store',
    fromApp: true,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
];

// Conversación 11: Múltiples tags y atención humana
const messagesConv11 = [
  {
    id: 1101,
    content: 'URGENTE! Mi pedido #56789 no llegó y era para un regalo de cumpleaños que es HOY',
    created_at: new Date(Date.now() - 60000 * 20).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491145678902',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1102,
    content: 'Entiendo la urgencia, Julieta. Déjame verificar tu pedido #56789 inmediatamente... 🔍',
    created_at: new Date(Date.now() - 60000 * 19).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-1101-1',
    response_score: 0,
  },
  {
    id: 1103,
    content: 'El seguimiento dice "en camino" hace 3 días!!! Esto es inaceptable',
    created_at: new Date(Date.now() - 60000 * 15).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491145678902',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1104,
    content: 'Tenés toda la razón en estar molesta. Veo que hubo un retraso inusual con el correo. Voy a escalar esto para que alguien de nuestro equipo te contacte en los próximos minutos y te dé una solución. ¿Hay algo más que pueda ayudarte mientras tanto?',
    created_at: new Date(Date.now() - 60000 * 14).toISOString(),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-1101-2',
    response_score: null,
  },
  {
    id: 1105,
    content: 'Quiero hablar con alguien YA. No con un robot',
    created_at: new Date(Date.now() - 60000 * 10).toISOString(),
    saw: true,
    mimetype: null,
    username: '+5491145678902',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
];

// Conversación 12: Mensaje de marketing enviado
const messagesConv12 = [
  {
    id: 1201,
    content: '📢 Promoción especial para vos',
    created_at: waTime(480),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-template-marketing',
    fromApp: true,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1202,
    content: 'Hola! Vi el mensaje de la promo, qué descuentos tienen?',
    created_at: waTime(400),
    saw: true,
    mimetype: null,
    username: '+5491156789013',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1203,
    content: '¡Hola Mateo! 🔥 Esta semana tenemos:\n\n• 30% OFF en toda la línea de verano\n• 2x1 en remeras básicas\n• Envío gratis en compras +$30.000\n• 6 cuotas sin interés con todas las tarjetas\n\n¿Te interesa algo en particular?',
    created_at: waTime(399),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-1201-1',
    response_score: 10,
  },
  {
    id: 1204,
    content: 'El 2x1 en remeras! Qué colores tienen?',
    created_at: waTime(395),
    saw: true,
    mimetype: null,
    username: '+5491156789013',
    role: 'customer',
    class: 'message-customer',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
  },
  {
    id: 1205,
    content: '👕 En la promo 2x1 tenemos remeras básicas en:\n\n• Negro\n• Blanco\n• Gris\n• Azul marino\n• Bordeaux\n• Verde militar\n\nTalles disponibles: S, M, L, XL. Cada remera está $12.990, con el 2x1 te llevas 2 por ese precio. ¿Cuáles te gustan?',
    created_at: waTime(394),
    saw: true,
    mimetype: null,
    username: null,
    role: 'assistant',
    class: 'message-bot',
    fromApp: true,
    hasImage: false,
    run_id: 'run-1201-2',
    response_score: 10,
  },
];

// Construir las conversaciones completas
export const mockConversations = [
  // ============================================
  // CONVERSACIÓN FACEBOOK - Carrito en proceso (más reciente)
  // ============================================
  {
    id: '13',
    chat_summary: 'Cliente armando carrito desde Facebook',
    conversation_summary: 13,
    created_at: new Date(Date.now() - 60000 * 5).toISOString(), // Hace 5 min
    messages: [
      {
        id: 1301,
        content: 'Hola! Vi en su página que tienen buzos de algodón, ¿tienen stock?',
        created_at: new Date(Date.now() - 60000 * 15).toISOString(),
        saw: true,
        mimetype: null,
        username: 'carolina.vega.fb',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1302,
        content: '¡Hola Carolina! 👋 Sí, tenemos buzos de algodón disponibles. ¿Qué talle necesitás? Tenemos desde S hasta XXL.',
        created_at: new Date(Date.now() - 60000 * 14).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1301',
        response_score: 10,
      },
      {
        id: 1303,
        content: 'Genial! Necesito un M en negro y otro en gris. ¿Cuánto sale cada uno?',
        created_at: new Date(Date.now() - 60000 * 10).toISOString(),
        saw: true,
        mimetype: null,
        username: 'carolina.vega.fb',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1304,
        content: '¡Perfecto! 🖤 El buzo de algodón talle M está $15.990. Te armé un carrito con los dos buzos (negro y gris). El total sería $31.980. ¿Te envío el link de pago?',
        created_at: new Date(Date.now() - 60000 * 5).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1302',
        response_score: 10,
      },
    ],
    channel: mockChannelFacebook,
    name: mockCustomers[12].name,
    username: mockCustomers[12].username,
    chatSummary: 'Carrito armado - 2 buzos',
    conversationSummary: 'Venta en proceso',
    unreadMessages: 0,
    customer: mockCustomers[12],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q13', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'En proceso' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[12].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: [
      {
        id: 1301,
        content: 'Hola! Vi en su página que tienen buzos de algodón, ¿tienen stock?',
        created_at: new Date(Date.now() - 60000 * 15).toISOString(),
        saw: true,
        mimetype: null,
        username: 'carolina.vega.fb',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1302,
        content: '¡Hola Carolina! 👋 Sí, tenemos buzos de algodón disponibles. ¿Qué talle necesitás? Tenemos desde S hasta XXL.',
        created_at: new Date(Date.now() - 60000 * 14).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1301',
        response_score: 10,
      },
      {
        id: 1303,
        content: 'Genial! Necesito un M en negro y otro en gris. ¿Cuánto sale cada uno?',
        created_at: new Date(Date.now() - 60000 * 10).toISOString(),
        saw: true,
        mimetype: null,
        username: 'carolina.vega.fb',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1304,
        content: '¡Perfecto! 🖤 El buzo de algodón talle M está $15.990. Te armé un carrito con los dos buzos (negro y gris). El total sería $31.980. ¿Te envío el link de pago?',
        created_at: new Date(Date.now() - 60000 * 5).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1302',
        response_score: 10,
      },
    ],
    lastMessage: {
      id: 1304,
      content: '¡Perfecto! 🖤 El buzo de algodón talle M está $15.990. Te armé un carrito con los dos buzos...',
      created_at: new Date(Date.now() - 60000 * 5).toISOString(),
      saw: true,
      mimetype: null,
      username: null,
      role: 'assistant',
      class: 'message-bot',
      fromApp: true,
      hasImage: false,
      run_id: 'run-1302',
      response_score: 10,
    },
  },
  // ============================================
  // CONVERSACIÓN FACEBOOK - Reclamo (requiere humano)
  // ============================================
  {
    id: '14',
    chat_summary: 'Cliente con reclamo por producto defectuoso',
    conversation_summary: 14,
    created_at: new Date(Date.now() - 60000 * 12).toISOString(), // Hace 12 min
    messages: [
      {
        id: 1401,
        content: 'Hola, compré una remera la semana pasada y ya se descosió. Quiero hacer un reclamo',
        created_at: new Date(Date.now() - 60000 * 45).toISOString(),
        saw: true,
        mimetype: null,
        username: 'diego.morales.92',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1402,
        content: 'Hola Diego, lamento mucho lo que pasó con tu remera 😔 Queremos solucionarlo. ¿Podrías enviarnos una foto del defecto y tu número de pedido?',
        created_at: new Date(Date.now() - 60000 * 44).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1401',
        response_score: 8,
      },
      {
        id: 1403,
        content: 'El pedido es #45892. Esto es inaceptable, la usé una sola vez',
        created_at: new Date(Date.now() - 60000 * 20).toISOString(),
        saw: true,
        mimetype: null,
        username: 'diego.morales.92',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1404,
        content: 'Quiero hablar con una persona, no con un bot',
        created_at: new Date(Date.now() - 60000 * 12).toISOString(),
        saw: false,
        mimetype: null,
        username: 'diego.morales.92',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
    ],
    channel: mockChannelFacebook,
    name: mockCustomers[13].name,
    username: mockCustomers[13].username,
    chatSummary: '⚠️ Reclamo - Solicita humano',
    conversationSummary: 'Producto defectuoso',
    unreadMessages: 2,
    customer: mockCustomers[13],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q14', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Reclamo' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[13].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: [
      {
        id: 1401,
        content: 'Hola, compré una remera la semana pasada y ya se descosió. Quiero hacer un reclamo',
        created_at: new Date(Date.now() - 60000 * 45).toISOString(),
        saw: true,
        mimetype: null,
        username: 'diego.morales.92',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1402,
        content: 'Hola Diego, lamento mucho lo que pasó con tu remera 😔 Queremos solucionarlo. ¿Podrías enviarnos una foto del defecto y tu número de pedido?',
        created_at: new Date(Date.now() - 60000 * 44).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1401',
        response_score: 8,
      },
      {
        id: 1403,
        content: 'El pedido es #45892. Esto es inaceptable, la usé una sola vez',
        created_at: new Date(Date.now() - 60000 * 20).toISOString(),
        saw: true,
        mimetype: null,
        username: 'diego.morales.92',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1404,
        content: 'Quiero hablar con una persona, no con un bot',
        created_at: new Date(Date.now() - 60000 * 12).toISOString(),
        saw: false,
        mimetype: null,
        username: 'diego.morales.92',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
    ],
    lastMessage: {
      id: 1404,
      content: 'Quiero hablar con una persona, no con un bot',
      created_at: new Date(Date.now() - 60000 * 12).toISOString(),
      saw: false,
      mimetype: null,
      username: 'diego.morales.92',
      role: 'customer',
      class: 'message-customer',
      fromApp: false,
      hasImage: false,
      run_id: null,
      response_score: null,
    },
  },
  // Conversación 1: Atención humana requerida (WhatsApp)
  {
    id: '1',
    chat_summary: 'Cliente con pedido incompleto solicita hablar con humano',
    conversation_summary: 1,
    created_at: waTime(30),
    messages: messagesConv1,
    channel: mockChannelWhatsApp,
    name: mockCustomers[0].name,
    username: mockCustomers[0].username,
    chatSummary: 'Pedido incompleto - Requiere atención humana',
    conversationSummary: 'Reclamo por pedido incompleto',
    unreadMessages: 2,
    customer: mockCustomers[0],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q1', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Reclamo' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[0].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv1,
    lastMessage: messagesConv1[messagesConv1.length - 1],
  },
  // ============================================
  // CONVERSACIÓN FACEBOOK - Tracking resuelto
  // ============================================
  {
    id: '15',
    chat_summary: 'Consulta sobre estado de envío',
    conversation_summary: 15,
    created_at: new Date(Date.now() - 60000 * 50).toISOString(), // Hace 50 min
    messages: [
      {
        id: 1501,
        content: 'Buenas! Hice un pedido hace 5 días y todavía no llegó. #52341',
        created_at: new Date(Date.now() - 60000 * 55).toISOString(),
        saw: true,
        mimetype: null,
        username: 'anabelen.castro',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1502,
        content: '¡Hola Ana Belén! 📦 Revisé tu pedido #52341 y ya está en camino. El código de seguimiento es AR123456789. Según el tracking, debería llegar mañana o pasado. ¿Te sirve esa info?',
        created_at: new Date(Date.now() - 60000 * 54).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1501',
        response_score: 10,
      },
      {
        id: 1503,
        content: 'Ah genial! Gracias por la info 🙏',
        created_at: new Date(Date.now() - 60000 * 50).toISOString(),
        saw: true,
        mimetype: null,
        username: 'anabelen.castro',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
    ],
    channel: mockChannelFacebook,
    name: mockCustomers[14].name,
    username: mockCustomers[14].username,
    chatSummary: 'Seguimiento de envío resuelto ✅',
    conversationSummary: 'Tracking enviado',
    unreadMessages: 0,
    customer: mockCustomers[14],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q15', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Tracking' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[14].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: [
      {
        id: 1501,
        content: 'Buenas! Hice un pedido hace 5 días y todavía no llegó. #52341',
        created_at: new Date(Date.now() - 60000 * 55).toISOString(),
        saw: true,
        mimetype: null,
        username: 'anabelen.castro',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
      {
        id: 1502,
        content: '¡Hola Ana Belén! 📦 Revisé tu pedido #52341 y ya está en camino. El código de seguimiento es AR123456789. Según el tracking, debería llegar mañana o pasado. ¿Te sirve esa info?',
        created_at: new Date(Date.now() - 60000 * 54).toISOString(),
        saw: true,
        mimetype: null,
        username: null,
        role: 'assistant',
        class: 'message-bot',
        fromApp: true,
        hasImage: false,
        run_id: 'run-1501',
        response_score: 10,
      },
      {
        id: 1503,
        content: 'Ah genial! Gracias por la info 🙏',
        created_at: new Date(Date.now() - 60000 * 50).toISOString(),
        saw: true,
        mimetype: null,
        username: 'anabelen.castro',
        role: 'customer',
        class: 'message-customer',
        fromApp: false,
        hasImage: false,
        run_id: null,
        response_score: null,
      },
    ],
    lastMessage: {
      id: 1503,
      content: 'Ah genial! Gracias por la info 🙏',
      created_at: new Date(Date.now() - 60000 * 50).toISOString(),
      saw: true,
      mimetype: null,
      username: 'anabelen.castro',
      role: 'customer',
      class: 'message-customer',
      fromApp: false,
      hasImage: false,
      run_id: null,
      response_score: null,
    },
  },
  // Conversación 2: Carrito enviado (Instagram)
  {
    id: '2',
    chat_summary: 'Cliente armando pedido múltiple con carrito generado',
    conversation_summary: 2,
    created_at: new Date(Date.now() - 60000 * 120).toISOString(),
    messages: messagesConv2,
    channel: mockChannelInstagram,
    name: mockCustomers[1].name,
    username: mockCustomers[1].username,
    chatSummary: 'Carrito generado - Pendiente de pago',
    conversationSummary: 'Venta en proceso',
    unreadMessages: 0,
    customer: mockCustomers[1],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q2', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'En proceso' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[1].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv2,
    lastMessage: messagesConv2[messagesConv2.length - 1],
  },
  // Conversación 3: Estado de pedido (pausado) (WhatsApp)
  {
    id: '3',
    chat_summary: 'Consulta sobre seguimiento de envío',
    conversation_summary: 3,
    created_at: waTime(180),
    messages: messagesConv3,
    channel: mockChannelWhatsApp,
    name: mockCustomers[2].name,
    username: mockCustomers[2].username,
    chatSummary: 'Seguimiento de pedido',
    conversationSummary: 'Consulta de tracking',
    unreadMessages: 1,
    customer: mockCustomers[2],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q3', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Seguimiento' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[2].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: true,
    messagesPanel: messagesConv3,
    lastMessage: messagesConv3[messagesConv3.length - 1],
  },
  // Conversación 4: Devolución con mensaje fallido (Instagram)
  {
    id: '4',
    chat_summary: 'Solicitud de cambio por talle incorrecto',
    conversation_summary: 4,
    created_at: new Date(Date.now() - 60000 * 90).toISOString(),
    messages: messagesConv4,
    channel: mockChannelInstagram,
    name: mockCustomers[3].name,
    username: mockCustomers[3].username,
    chatSummary: 'Cambio de producto - Talle incorrecto',
    conversationSummary: 'Cambio de campera',
    unreadMessages: 1,
    customer: mockCustomers[3],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q4', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Devolución' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[3].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: true,
    isPaused: false,
    messagesPanel: messagesConv4,
    lastMessage: messagesConv4[messagesConv4.length - 1],
  },
  // Conversación 5: Venta exitosa (WhatsApp)
  {
    id: '5',
    chat_summary: 'Venta completada de zapatillas running',
    conversation_summary: 5,
    created_at: waTime(240),
    messages: messagesConv5,
    channel: mockChannelWhatsApp,
    name: mockCustomers[4].name,
    username: mockCustomers[4].username,
    chatSummary: 'Venta completada ✅',
    conversationSummary: 'Zapatillas Running Pro Air',
    unreadMessages: 0,
    customer: mockCustomers[4],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q5', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'Completada' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[4].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv5,
    lastMessage: messagesConv5[messagesConv5.length - 1],
  },
  // Conversación 6: Mayorista (Copilot) (Instagram)
  {
    id: '6',
    chat_summary: 'Consulta mayorista en proceso',
    conversation_summary: 6,
    created_at: new Date(Date.now() - 60000 * 300).toISOString(),
    messages: messagesConv6,
    channel: mockChannelInstagram,
    name: mockCustomers[5].name,
    username: mockCustomers[5].username,
    chatSummary: 'Pedido mayorista',
    conversationSummary: 'Cotización 80 prendas',
    unreadMessages: 1,
    customer: mockCustomers[5],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q6', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'Mayorista' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[5].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv6,
    lastMessage: messagesConv6[messagesConv6.length - 1],
  },
  // Conversación 7: One-click payment (WhatsApp)
  {
    id: '7',
    chat_summary: 'Compra rápida vestido floral',
    conversation_summary: 7,
    created_at: waTime(60),
    messages: messagesConv7,
    channel: mockChannelWhatsApp,
    name: mockCustomers[6].name,
    username: mockCustomers[6].username,
    chatSummary: 'Link de pago enviado',
    conversationSummary: 'Vestido Floral Primavera',
    unreadMessages: 0,
    customer: mockCustomers[6],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q7', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'En proceso' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[6].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv7,
    lastMessage: messagesConv7[messagesConv7.length - 1],
  },
  // Conversación 8: Modificar pedido con audio (WhatsApp)
  {
    id: '8',
    chat_summary: 'Modificación de pedido en curso',
    conversation_summary: 8,
    created_at: waTime(45),
    messages: messagesConv8,
    channel: mockChannelWhatsApp,
    name: mockCustomers[7].name,
    username: mockCustomers[7].username,
    chatSummary: 'Agregando producto a pedido',
    conversationSummary: 'Modificación pedido #45123',
    unreadMessages: 1,
    customer: mockCustomers[7],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q8', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Modificación' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[7].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv8,
    lastMessage: messagesConv8[messagesConv8.length - 1],
  },
  // Conversación 9: Consulta simple (Instagram)
  {
    id: '9',
    chat_summary: 'Consulta sobre local físico',
    conversation_summary: 9,
    created_at: new Date(Date.now() - 60000 * 360).toISOString(),
    messages: messagesConv9,
    channel: mockChannelInstagram,
    name: mockCustomers[8].name,
    username: mockCustomers[8].username,
    chatSummary: 'Información del local',
    conversationSummary: 'Horarios y ubicación',
    unreadMessages: 0,
    customer: mockCustomers[8],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q9', class: 'general', created_at: new Date().toISOString(), name: 'General', description: 'Consulta' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[8].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv9,
    lastMessage: messagesConv9[messagesConv9.length - 1],
  },
  // Conversación 10: Pedido personalizado (WhatsApp)
  {
    id: '10',
    chat_summary: 'Remeras personalizadas para equipo de fútbol',
    conversation_summary: 10,
    created_at: waTime(150),
    messages: messagesConv10,
    channel: mockChannelWhatsApp,
    name: mockCustomers[9].name,
    username: mockCustomers[9].username,
    chatSummary: 'Pedido corporativo - Remeras',
    conversationSummary: '20 remeras con estampado',
    unreadMessages: 1,
    customer: mockCustomers[9],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q10', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'Corporativo' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[9].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv10,
    lastMessage: messagesConv10[messagesConv10.length - 1],
  },
  // Conversación 11: Múltiples tags urgente (Instagram)
  {
    id: '11',
    chat_summary: 'Pedido urgente no entregado - Cliente enojado',
    conversation_summary: 11,
    created_at: new Date(Date.now() - 60000 * 20).toISOString(),
    messages: messagesConv11,
    channel: mockChannelInstagram,
    name: mockCustomers[10].name,
    username: mockCustomers[10].username,
    chatSummary: '⚠️ URGENTE - Pedido retrasado',
    conversationSummary: 'Reclamo por entrega',
    unreadMessages: 3,
    customer: mockCustomers[10],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q11', class: 'support', created_at: new Date().toISOString(), name: 'Soporte', description: 'Urgente' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[10].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv11,
    lastMessage: messagesConv11[messagesConv11.length - 1],
  },
  // Conversación 12: Marketing (WhatsApp)
  {
    id: '12',
    chat_summary: 'Cliente interesado en promoción 2x1',
    conversation_summary: 12,
    created_at: waTime(480),
    messages: messagesConv12,
    channel: mockChannelWhatsApp,
    name: mockCustomers[11].name,
    username: mockCustomers[11].username,
    chatSummary: 'Respuesta a campaña marketing',
    conversationSummary: 'Interés en promo 2x1',
    unreadMessages: 0,
    customer: mockCustomers[11],
    unreadMessagesAfterAccepted: 0,
    qualification: { id: 'q12', class: 'sales', created_at: new Date().toISOString(), name: 'Venta', description: 'Marketing' },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockCustomers[11].name)}&background=eef5ff&color=0059d5`,
    virtual_assistant_failed: false,
    isPaused: false,
    messagesPanel: messagesConv12,
    lastMessage: messagesConv12[messagesConv12.length - 1],
  },
];

export const mockConversationsGrouped = {
  rows: mockConversations,
  total: mockConversations.length,
  page: 0,
  hasMore: false,
};

// Para la API que usa data en lugar de rows
export const mockConversationsResponse = {
  data: mockConversations,
  total: mockConversations.length,
  page: 1,
  hasMore: false,
};

// ============================================
// PRODUCTS DATA
// ============================================

export const mockProducts = Array.from({ length: 20 }, (_, idx) => ({
  id: idx + 1,
  name: {
    es: [
      'Remera Básica',
      'Pantalón Jean',
      'Campera de Cuero',
      'Zapatillas Running',
      'Vestido Floral',
      'Camisa Oxford',
      'Buzo Hoodie',
      'Shorts Deportivos',
      'Gorra Snapback',
      'Mochila Urbana',
      'Cinturón Cuero',
      'Lentes de Sol',
      'Reloj Deportivo',
      'Bufanda Lana',
      'Guantes Táctiles',
      'Medias Pack x3',
      'Bóxer Pack x2',
      'Pijama Set',
      'Traje de Baño',
      'Sandalias Verano',
    ][idx],
    pt: [
      'Camiseta Básica',
      'Calça Jeans',
      'Jaqueta de Couro',
      'Tênis Running',
      'Vestido Floral',
      'Camisa Oxford',
      'Moletom Hoodie',
      'Shorts Esportivos',
      'Boné Snapback',
      'Mochila Urbana',
      'Cinto de Couro',
      'Óculos de Sol',
      'Relógio Esportivo',
      'Cachecol de Lã',
      'Luvas Touch',
      'Meias Pack x3',
      'Cueca Pack x2',
      'Pijama Set',
      'Roupa de Banho',
      'Sandálias Verão',
    ][idx],
  },
  variants: [
    {
      id: idx * 10 + 1,
      image_id: idx + 1,
      product_id: idx + 1,
      position: 1,
      price: String((Math.floor(Math.random() * 50) + 10) * 1000),
      compare_at_price: String((Math.floor(Math.random() * 60) + 20) * 1000),
      promotional_price: null,
      stock_management: true,
      stock: Math.floor(Math.random() * 100) + 5,
      weight: '0.5',
      width: '30',
      height: '40',
      depth: '5',
      sku: `SKU-${idx + 1001}`,
      values: [],
      barcode: null,
      mpn: null,
      age_group: null,
      gender: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
      inventory_levels: [
        { id: 1, variant_id: idx * 10 + 1, location_id: 'loc-1', stock: 50 },
      ],
    },
  ],
  images: [
    {
      id: idx + 1,
      product_id: idx + 1,
      src: `https://picsum.photos/seed/${idx + 1}/400/400`,
      position: 1,
      alt: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  ],
}));

// ============================================
// CHANNELS DATA (for /channels/store endpoint - Instances)
// ============================================

// Connected channels for testing the configured chat view
// Includes WhatsApp (with phone number), Instagram (with username), and Facebook Messenger (with page name)
export const mockChannels = [
  {
    id: 'ch-001',
    username: '+54 9 11 1234-5678',
    phoneNumber: '+54 9 11 1234-5678',
    channelName: 'WhatsAppBusiness',
    basePath: '/whatsapps-business',
    country: 'AR',
    actualStatus: {
      id: 1,
      name: 'Connected',
    },
    state: {
      name: 'Active',
    },
    phone: '+5491112345678',
    type: 'whatsapp_business',
    channelType: 'whatsapp',
    bot_status: 'active',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ch-003',
    username: '@tienda_moda_ok',
    channelName: 'Instagram',
    basePath: '/instagram',
    country: 'AR',
    actualStatus: {
      id: 1,
      name: 'Connected',
    },
    state: {
      name: 'Active',
    },
    type: 'instagram',
    channelType: 'instagram',
    bot_status: 'active',
    created_at: '2024-02-15T00:00:00Z',
    profilePicture: 'https://i.pravatar.cc/150?img=47',
    followersCount: 12500,
  },
  {
    id: 'ch-004',
    username: 'Tienda Moda OK',
    pageName: 'Tienda Moda OK',
    channelName: 'Facebook',
    basePath: '/facebook',
    country: 'AR',
    actualStatus: {
      id: 1,
      name: 'Connected',
    },
    state: {
      name: 'Active',
    },
    type: 'facebook',
    channelType: 'facebook',
    bot_status: 'active',
    created_at: '2024-02-20T00:00:00Z',
    profilePicture: 'https://i.pravatar.cc/150?img=48',
    followersCount: 8500,
  },
];

// Empty channels for testing onboarding flow with disconnected channels
// export const mockChannels: any[] = [];

// ============================================
// CONFIGURATIONS DATA
// ============================================

export const mockIaConfig = {
  language: 'es',
  personality: 'friendly',
  responseLength: 'medium',
  emojisEnabled: true,
  agreeToUseInformationFromStore: true,
  purpose: 'sales',
  tone: 'professional',
};

export const mockLanguages = [
  { id: 'es', name: 'Español' },
  { id: 'pt', name: 'Português' },
  { id: 'en', name: 'English' },
];

export const mockPersonalities = [
  { id: 'friendly', name: 'Amigable', description: 'Tono cálido y cercano' },
  { id: 'professional', name: 'Profesional', description: 'Tono formal y serio' },
  { id: 'casual', name: 'Casual', description: 'Tono relajado e informal' },
];

export const mockResponsesLength = [
  { id: 'short', name: 'Corto', description: 'Respuestas breves y directas' },
  { id: 'medium', name: 'Medio', description: 'Respuestas balanceadas' },
  { id: 'long', name: 'Largo', description: 'Respuestas detalladas' },
];

export const mockPurposes = [
  { id: 'sales', name: 'Ventas', description: 'Enfocado en cerrar ventas' },
  { id: 'support', name: 'Soporte', description: 'Enfocado en resolver dudas' },
  { id: 'mixed', name: 'Mixto', description: 'Balance entre ventas y soporte' },
];

export const mockTones = [
  { id: 'professional', name: 'Profesional' },
  { id: 'friendly', name: 'Amigable' },
  { id: 'enthusiastic', name: 'Entusiasta' },
];

export const mockPersonalityTraits = [
  { id: 1, name: 'Empático', selected: true },
  { id: 2, name: 'Paciente', selected: true },
  { id: 3, name: 'Proactivo', selected: false },
  { id: 4, name: 'Detallista', selected: true },
  { id: 5, name: 'Conciso', selected: false },
];

// ============================================
// ACTION RULES DATA
// ============================================

export const mockActionRules = {
  data: [
    {
      id: 1,
      store_id: 12345,
      name: 'Transferir a humano por reclamos',
      action: 'transfer' as const,
      state: 'enabled' as const,
      instruction: 'Cuando el cliente mencione un reclamo o queja, transferir inmediatamente',
      triggers: [{ id: 1, action_rule_id: 1, content: 'reclamo, queja, problema, no funciona' }],
    },
    {
      id: 2,
      store_id: 12345,
      name: 'Recolectar datos para cotización',
      action: 'collect' as const,
      state: 'enabled' as const,
      instruction: 'Solicitar nombre, email y teléfono para enviar cotización',
      triggers: [{ id: 2, action_rule_id: 2, content: 'cotización, presupuesto, precio mayorista' }],
    },
    {
      id: 3,
      store_id: 12345,
      name: 'Transferir por devoluciones',
      action: 'transfer' as const,
      state: 'disabled' as const,
      instruction: null,
      triggers: [{ id: 3, action_rule_id: 3, content: 'devolución, cambio, reembolso' }],
    },
  ],
  total: 3,
  limit: 20,
  offset: 0,
};

// ============================================
// RELEVANT CONTENT DATA (BIBLIOTECA)
// ============================================

export const mockRelevantContentList = [
  {
    id: 1,
    title: 'Información de envíos',
    content: 'Realizamos envíos a todo el país. Los tiempos de entrega son: CABA y GBA 24-48hs, Interior 3-5 días hábiles. El costo de envío se calcula según el peso y destino. Envíos gratis en compras mayores a $50.000.',
    class: 'relevant_content_store',
    tool: false,
    tool_name: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Medios de pago',
    content: 'Aceptamos: Tarjetas de crédito (Visa, Mastercard, Amex) hasta 12 cuotas sin interés. Tarjetas de débito. Mercado Pago. Transferencia bancaria (10% descuento). Efectivo en puntos de pago.',
    class: 'relevant_content_store',
    tool: false,
    tool_name: null,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
  {
    id: 3,
    title: 'Política de devoluciones',
    content: 'Tenés 30 días para devolver tu compra. El producto debe estar sin uso y con etiquetas. Podés gestionar el cambio o devolución por WhatsApp. Te devolvemos el dinero o generamos crédito en la tienda.',
    class: 'relevant_content_mandatory',
    tool: true,
    tool_name: 'transfer_to_human',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  },
  {
    id: 4,
    title: 'Horarios de atención',
    content: 'Nuestro horario de atención es: Lunes a Viernes de 9:00 a 18:00hs. Sábados de 9:00 a 13:00hs. Domingos y feriados cerrado. Consultas por WhatsApp las 24hs, respondemos en horario comercial.',
    class: 'relevant_content_store',
    tool: false,
    tool_name: null,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: 5,
    title: 'Talles y medidas',
    content: 'Trabajamos con talles S, M, L, XL y XXL. Cada producto tiene su guía de talles específica. Si tenés dudas, envianos tus medidas (busto, cintura, cadera) y te asesoramos. Los talles pueden variar según el modelo.',
    class: 'relevant_content_store',
    tool: false,
    tool_name: null,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
  },
  {
    id: 6,
    title: 'Seguimiento de pedido',
    content: 'Una vez despachado tu pedido, recibirás un email con el código de seguimiento. Podés rastrear tu envío en la web del correo. El tiempo de procesamiento es de 24-48hs hábiles.',
    class: 'relevant_content_mandatory',
    tool: false,
    tool_name: null,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 7,
    title: 'Promociones vigentes',
    content: '🔥 PROMO VERANO: 2x1 en remeras seleccionadas. 30% OFF en segunda unidad de pantalones. Envío gratis en compras +$50.000. Cuotas sin interés con tarjetas bancarias.',
    class: 'relevant_content_store',
    tool: false,
    tool_name: null,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
  },
  {
    id: 8,
    title: 'Información de la tienda',
    content: 'Somos una tienda de indumentaria con más de 10 años de experiencia. Nos especializamos en ropa casual y deportiva de alta calidad. Nuestro local está ubicado en Palermo, CABA. También vendemos online a todo el país.',
    class: 'relevant_content_store',
    tool: false,
    tool_name: null,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
  {
    id: 9,
    title: 'Reclamos y problemas',
    content: 'Si tenés algún problema con tu pedido o querés hacer un reclamo, por favor contactanos. En caso de que no podamos resolver tu consulta, vamos a transferir para atención humana para que un agente te ayude personalmente.',
    class: 'relevant_content_store',
    tool: true,
    tool_name: 'transfer_to_human',
    state: 'to_review',
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z',
  },
  {
    id: 10,
    title: 'Consultas especiales',
    content: 'Para pedidos mayoristas, personalizaciones o consultas especiales que requieran atención personalizada, te vamos a derivar con nuestro equipo de atendimento humano para brindarte la mejor asistencia.',
    class: 'relevant_content_store',
    tool: true,
    tool_name: 'transfer_to_human',
    state: 'to_review',
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z',
  },
];

// Estructura que espera Step2DataProvider: { rows: [...], total: number }
export const mockRelevantContent = {
  rows: mockRelevantContentList,
  total: mockRelevantContentList.length,
};

// Optionals - contenido sugerido que el usuario puede agregar
export const mockRelevantContentOptionals = [
  {
    id: 'opt-1',
    title: 'Información de garantía',
    content: 'Todos nuestros productos tienen garantía de 6 meses por defectos de fabricación.',
    class: 'relevant_content_optional',
    suggested: true,
  },
  {
    id: 'opt-2',
    title: 'Cuidado de prendas',
    content: 'Recomendamos lavar a mano o en ciclo delicado. No usar secadora. Planchar a temperatura baja.',
    class: 'relevant_content_optional',
    suggested: true,
  },
  {
    id: 'opt-3',
    title: 'Compras mayoristas',
    content: 'Realizamos ventas mayoristas con descuentos especiales. Mínimo 10 unidades por modelo. Consultá precios por WhatsApp.',
    class: 'relevant_content_optional',
    suggested: true,
  },
];

export const mockRelevantContentCategories = [
  { id: 'shipping', name: 'Envíos' },
  { id: 'payment', name: 'Pagos' },
  { id: 'returns', name: 'Devoluciones' },
  { id: 'hours', name: 'Horarios' },
  { id: 'products', name: 'Productos' },
  { id: 'other', name: 'Otros' },
];

// ============================================
// AUTOMATIC MESSAGES DATA
// ============================================

export const mockAutomaticMessages = {
  welcomeMessage: '¡Hola! Bienvenido a nuestra tienda. ¿En qué puedo ayudarte?',
  awayMessage: 'En este momento no estamos disponibles. Te responderemos a la brevedad.',
  closingMessage: '¡Gracias por tu consulta! Que tengas un excelente día.',
};

// ============================================
// PLAYGROUND DATA
// ============================================

export const mockPlaygroundConversation = {
  id: 'playground-1',
  messages: [
    {
      id: 1,
      role: 'customer',
      content: '¡Hola! Estoy buscando un regalo para mi pareja.',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      role: 'bot',
      content: '¡Hola! Qué lindo que estés pensando en un regalo especial. ¿Me podrías contar un poco más sobre los gustos de tu pareja? ¿Le gustan más las prendas casuales o algo más elegante?',
      created_at: new Date().toISOString(),
    },
  ],
};

// ============================================
// TEMPLATE MESSAGES DATA
// ============================================

export const mockTemplateMessages = [
  {
    id: 'tmpl-1',
    name: 'welcome_message',
    status: 'approved',
    language: 'es',
    category: 'MARKETING',
    components: [
      {
        type: 'BODY',
        text: '¡Hola {{1}}! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?',
      },
    ],
  },
  {
    id: 'tmpl-2',
    name: 'order_confirmation',
    status: 'approved',
    language: 'es',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: 'Tu pedido #{{1}} ha sido confirmado. Te avisaremos cuando esté en camino.',
      },
    ],
  },
  {
    id: 'tmpl-3',
    name: 'shipping_update',
    status: 'pending',
    language: 'es',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: '¡Tu pedido está en camino! Número de seguimiento: {{1}}',
      },
    ],
  },
];

// ============================================
// ANNOUNCEMENTS DATA
// ============================================

export const mockAnnouncements = [
  {
    id: 1,
    title: 'Nueva función: Estadísticas mejoradas',
    content: 'Ahora podés ver métricas más detalladas de tus conversaciones.',
    type: 'feature',
    read: false,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Mantenimiento programado',
    content: 'El día 20/01 habrá un mantenimiento de 2 horas.',
    type: 'maintenance',
    read: true,
    created_at: '2024-01-10T08:00:00Z',
  },
];

// ============================================
// WHATSAPP HEALTH STATUS
// ============================================

export const mockWhatsappHealth = {
  status: 'healthy',
  phone_number_quality: 'HIGH',
  messaging_limit: 'TIER_1000',
  current_limit: 1000,
  used_today: 234,
};

// ============================================
// CHAT STATISTICS DATA
// ============================================

// Helper to generate trend data
const generateTrendData = (days: number, baseValue: number, variance: number = 0.3) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const trendFactor = 1 + (days - i) * 0.02; // slight upward trend
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue * randomFactor * trendFactor),
    });
  }
  return data;
};

// Generate CVR trend (percentage values)
const generateCvrTrend = (days: number, baseCvr: number) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomFactor = (Math.random() - 0.5) * 15;
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, Math.min(100, baseCvr + randomFactor)),
    });
  }
  return data;
};

export const mockChatStatistics = {
  // Conversation metrics
  conversations: {
    conversations: 847,
    conversations_with_bot_message: 723,
    conversations_full_ai: 0.68,
    messages: {
      bot: 12450,
      customer: 8320,
      merchant: 1890,
    },
    messages_grouped: generateDailyStats(),
    top_conversation_topics: [
      { name: 'Consultas de productos', count: 234, percentage: 27.6 },
      { name: 'Estado de pedidos', count: 189, percentage: 22.3 },
      { name: 'Precios y descuentos', count: 156, percentage: 18.4 },
      { name: 'Métodos de pago', count: 98, percentage: 11.6 },
      { name: 'Envíos y entregas', count: 87, percentage: 10.3 },
      { name: 'Devoluciones', count: 45, percentage: 5.3 },
      { name: 'Otros', count: 38, percentage: 4.5 },
    ],
  },

  // Sales metrics
  sales: {
    gmv_total: 1250000,
    gmv_total_trend: generateTrendData(30, 41667),
    paid_orders_count: 87,
    paid_orders_trend: generateTrendData(30, 3, 0.5),
    carts_generated: 156,
    carts_trend: generateTrendData(30, 5, 0.4),
    gmv_potential: 2100000,
    gmv_potential_trend: generateTrendData(30, 70000),
    cvr: 55.77,
    cvr_trend: generateCvrTrend(30, 55.77),
    average_ticket: 14367,
    average_ticket_trend: generateTrendData(30, 14367, 0.2),
    top_products_discussed: [
      { id: 1, name: 'Remera Básica Negra', count: 89, image: 'https://picsum.photos/seed/prod1/100/100' },
      { id: 2, name: 'Jean Clásico Azul', count: 67, image: 'https://picsum.photos/seed/prod2/100/100' },
      { id: 3, name: 'Zapatillas Running Pro', count: 54, image: 'https://picsum.photos/seed/prod3/100/100' },
      { id: 4, name: 'Vestido Floral Primavera', count: 48, image: 'https://picsum.photos/seed/prod4/100/100' },
      { id: 5, name: 'Campera de Cuero Premium', count: 41, image: 'https://picsum.photos/seed/prod5/100/100' },
      { id: 6, name: 'Buzo Hoodie Oversize', count: 38, image: 'https://picsum.photos/seed/prod6/100/100' },
      { id: 7, name: 'Pantalón Cargo', count: 29, image: 'https://picsum.photos/seed/prod7/100/100' },
      { id: 8, name: 'Camisa Oxford', count: 24, image: 'https://picsum.photos/seed/prod8/100/100' },
    ],
    // Conversation Funnel
    funnel: [
      {
        id: 'conversations',
        label: 'Conversaciones Iniciadas',
        value: 847,
        color: '#64B5F6',
        helpText: 'Total de conversaciones recibidas en el período',
      },
      {
        id: 'product_inquiries',
        label: 'Consultas de Productos',
        value: 412,
        color: '#4FC3F7',
        helpText: 'Conversaciones donde se consultó por productos específicos',
      },
      {
        id: 'carts_created',
        label: 'Carritos Creados',
        value: 156,
        color: '#4DB6AC',
        helpText: 'Carritos generados dentro de conversaciones',
      },
      {
        id: 'purchases',
        label: 'Compras Completadas',
        value: 87,
        color: '#81C784',
        helpText: 'Órdenes pagadas atribuidas a Chat',
      },
    ],
  },

  // Efficiency metrics
  efficiency: {
    time_to_purchase_avg: 42, // minutes
    ai_response_time_avg: 3, // seconds
    human_response_time_avg: 180, // seconds (3 minutes)
    estimated_savings: 45000, // currency
    handover_to_cart_rate: 34.5, // percentage
    top_derivation_reasons: [
      { name: 'Consultas de envío', count: 45, percentage: 28.1 },
      { name: 'Problemas de stock', count: 32, percentage: 20.0 },
      { name: 'Solicitud explícita', count: 28, percentage: 17.5 },
      { name: 'Devoluciones/cambios', count: 24, percentage: 15.0 },
      { name: 'Pedidos mayoristas', count: 18, percentage: 11.3 },
      { name: 'Reclamos', count: 13, percentage: 8.1 },
    ],
  },

  currency: 'ARS',
};

// ============================================
// CUSTOM TAGS DATA
// ============================================

export const mockCustomTags = [
  { id: 1, name: 'VIP', color: '#8B5CF6', createdAt: '2024-01-10T10:00:00Z' },
  { id: 2, name: 'Urgente', color: '#EF4444', createdAt: '2024-01-11T10:00:00Z' },
  { id: 3, name: 'Mayorista', color: '#F59E0B', createdAt: '2024-01-12T10:00:00Z' },
  { id: 4, name: 'Recurrente', color: '#10B981', createdAt: '2024-01-13T10:00:00Z' },
];

// ============================================
// STORE USERS DATA (for conversation assignment)
// ============================================

export const mockStoreUsers = [
  { id: 1, name: 'Mariana López', email: 'mariana@tienda.com', avatar: 'https://ui-avatars.com/api/?name=Mariana+Lopez&background=c7d2fe&color=4338ca' },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@tienda.com', avatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&background=fecaca&color=991b1b' },
  { id: 3, name: 'Ana García', email: 'ana@tienda.com', avatar: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=bbf7d0&color=166534' },
];

// ============================================
// QUICK REPLIES DATA
// ============================================

export const mockQuickReplies = [
  { id: 1, title: 'Saludo', shortcut: 'hola', content: '¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?' },
  { id: 2, title: 'Envíos', shortcut: 'envio', content: 'Realizamos envíos a todo el país. CABA y GBA: 24-48hs. Interior: 3-5 días hábiles. Envío gratis en compras mayores a $50.000.' },
  { id: 3, title: 'Horarios', shortcut: 'horario', content: 'Nuestro horario de atención es: Lunes a Viernes de 9:00 a 18:00hs. Sábados de 9:00 a 13:00hs.' },
  { id: 4, title: 'Devoluciones', shortcut: 'devolucion', content: 'Tenés 30 días para devolver tu compra. El producto debe estar sin uso y con etiquetas originales.' },
  { id: 5, title: 'Despedida', shortcut: 'chau', content: '¡Gracias por tu consulta! Si necesitás algo más, no dudes en escribirnos. ¡Que tengas un excelente día!' },
];

// ============================================
// DEFAULT EXPORT - All mock data
// ============================================

export default {
  storeInfo: mockStoreInfo,
  session: mockSessionData,
  billing: mockBillingData,
  plans: mockPlans,
  currentCycle: mockCurrentCycle,
  paymentsHistory: mockPaymentsHistory,
  statistics: mockStatistics,
  conversations: mockConversations,
  conversationsGrouped: mockConversationsGrouped,
  products: mockProducts,
  channels: mockChannels,
  iaConfig: mockIaConfig,
  languages: mockLanguages,
  personalities: mockPersonalities,
  responsesLength: mockResponsesLength,
  purposes: mockPurposes,
  tones: mockTones,
  personalityTraits: mockPersonalityTraits,
  actionRules: mockActionRules,
  relevantContent: mockRelevantContent,
  relevantContentCategories: mockRelevantContentCategories,
  automaticMessages: mockAutomaticMessages,
  playgroundConversation: mockPlaygroundConversation,
  templateMessages: mockTemplateMessages,
  announcements: mockAnnouncements,
  whatsappHealth: mockWhatsappHealth,
  chatStatistics: mockChatStatistics,
  customTags: mockCustomTags,
  storeUsers: mockStoreUsers,
  quickReplies: mockQuickReplies,
};

