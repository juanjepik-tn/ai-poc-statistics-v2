export const HELP_LINK_CONFIG = {
  ResponseCustomization: {
    links: {
      BR: "https://atendimento.nuvemshop.com.br/configure-seu-assistente/como-personalizar-meu-assistente-virtual-do-nuvem-chat",
      AR: "https://ayuda.tiendanube.com/es_AR/configurar-tu-asistente/como-configurar-la-personalidad-de-mi-asistente-virtual",
      MX: "https://ayuda.tiendanube.com/es_MX/configurar-tu-asistente/como-configurar-la-personalidad-de-mi-asistente-virtual",
      CO: "https://ayuda.tiendanube.com/es_CO/configurar-tu-asistente/como-configurar-la-personalidad-de-mi-asistente-virtual",
      ES: "https://ayuda.tiendanube.com/es_ES/configurar-tu-asistente/como-configurar-la-personalidad-de-mi-asistente-virtual"
    },
    textKey: 'settings.more-about.assistant-personalization'
  },
  KnowledgeLibrary: {
    links: {
      BR: "https://atendimento.nuvemshop.com.br/pt_BR/configure-seu-assistente/como-configurar-a-biblioteca-de-conhecimento-do-meu-assistente-virtual-do-nuvem-chat",
      AR: "https://ayuda.tiendanube.com/es_AR/configurar-tu-asistente/como-configurar-la-biblioteca-de-conocimiento-de-mi-asistente-virtual",
      MX: "https://ayuda.tiendanube.com/es_MX/configurar-tu-asistente/como-configurar-la-biblioteca-de-conocimiento-de-mi-asistente-virtual",
      CO: "https://ayuda.tiendanube.com/es_CO/configurar-tu-asistente/como-configurar-la-biblioteca-de-conocimiento-de-mi-asistente-virtual",
      ES: "https://ayuda.tiendanube.com/es_ES/configurar-tu-asistente/como-configurar-la-biblioteca-de-conocimiento-de-mi-asistente-virtual"
    },
    textKey: 'settings.more-about.knowledge-library'
  },
  Playground: {
    links: {
      BR: "https://atendimento.nuvemshop.com.br/configure-seu-assistente/como-testar-meu-assistente-virtual-do-nuvem-chat",
      AR: "https://ayuda.tiendanube.com/es_AR/configurar-tu-asistente/como-probar-a-tu-asistente-virtual-antes-de-que-empiece-a-responder",
      MX: "https://ayuda.tiendanube.com/es_MX/configurar-tu-asistente/como-probar-a-tu-asistente-virtual-antes-de-que-empiece-a-responder",
      CO: "https://ayuda.tiendanube.com/es_CO/configurar-tu-asistente/como-probar-a-tu-asistente-virtual-antes-de-que-empiece-a-responder",
      ES: "https://ayuda.tiendanube.com/es_ES/configurar-tu-asistente/como-probar-a-tu-asistente-virtual-antes-de-que-empiece-a-responder"
    },
    textKey: 'settings.more-about.test-assistant'
  },
  Channels: {
    links: {
      BR: "https://atendimento.nuvemshop.com.br/pt_BR/configure-seu-assistente/como-conectar-meu-assistente-virtual-do-nuvem-chat-ao-whatsapp",
      AR: "https://ayuda.tiendanube.com/es_AR/configurar-tu-asistente/como-conectar-mi-asistente-virtual-a-whatsapp-para-que-empiece-a-responder",
      MX: "https://ayuda.tiendanube.com/es_MX/configurar-tu-asistente/como-conectar-mi-asistente-virtual-a-whatsapp-para-que-empiece-a-responder",
      CO: "https://ayuda.tiendanube.com/es_CO/configurar-tu-asistente/como-conectar-mi-asistente-virtual-a-whatsapp-para-que-empiece-a-responder",
      ES: "https://ayuda.tiendanube.com/es_ES/configurar-tu-asistente/como-conectar-mi-asistente-virtual-a-whatsapp-para-que-empiece-a-responder"
    },
    textKey: 'settings.more-about.connect-whatsapp'
  }
} as const;

export type OnboardingStep = keyof typeof HELP_LINK_CONFIG;
