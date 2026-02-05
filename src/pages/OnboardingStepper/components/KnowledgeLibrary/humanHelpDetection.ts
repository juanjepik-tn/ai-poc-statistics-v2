/**
 * Keywords that indicate human help instructions in content
 * Includes Portuguese and Spanish variants
 */
const HUMAN_HELP_KEYWORDS = [
  // Portuguese - common phrases
  'atendimento humano',
  'falar com atendente',
  'transferir para humano',
  'ajuda humana',
  'suporte humano',
  'atendente humano',
  'falar com pessoa',
  'atendimento ao vivo',
  'falar com um humano',
  'contato humano',
  'assistente humano',
  'atendente real',
  'pessoa real',
  // Portuguese - action phrases
  'encaminhe para',
  'direcione para',
  'transfira para',
  'transferir para o time',
  'time de suporte',
  'equipe de suporte',
  'equipe de atendimento',
  'agente humano',
  'finalizado com atendimento',
  'encerrado com atendimento',
  // Spanish - common phrases
  'atención humana',
  'hablar con agente',
  'transferir a humano',
  'ayuda humana',
  'soporte humano',
  'agente humano',
  'hablar con persona',
  'atención en vivo',
  'hablar con un humano',
  'contacto humano',
  'asistente humano',
  'agente real',
  'persona real',
  // Spanish - action phrases
  'derivar a',
  'transferir a',
  'dirigir a',
  'equipo de soporte',
  'equipo de atención',
  'finalizado con atención',
];

/**
 * Detects if the content contains instructions for human help/support
 * @param content - The content text to analyze
 * @returns true if human help instructions are detected
 */
export function detectHumanHelpInstructions(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  const normalizedContent = content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  return HUMAN_HELP_KEYWORDS.some(keyword => {
    const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalizedContent.includes(normalizedKeyword);
  });
}

/**
 * Returns the list of human help keywords for reference
 */
export function getHumanHelpKeywords(): string[] {
  return [...HUMAN_HELP_KEYWORDS];
}
