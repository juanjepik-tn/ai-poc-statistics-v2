import { Box, Text } from '@nimbus-ds/components';
import ConversationEndDivider from '@/components/conversation/ConversationEndDivider';

const MOCK_MESSAGES = [
  {
    role: 'customer',
    content: 'Hola! Estoy buscando camiseta Harlem',
    created_at: '2026-01-20T11:18:00.000Z',
  },
  {
    role: 'assistant',
    content:
      'Oi! Eu sou a Ana, assistente virtual da loja! Encontrei a Camiseta Harlem por apenas R$11,00 (de R$149,00), em Branco, Cinza e Azul, tamanhos G, GG e XGG.\nQual cor e tamanho você prefere?',
    created_at: '2026-01-20T11:19:00.000Z',
  },
  {
    role: 'customer',
    content: 'Olá! Gostaria de saber onde se encontra o meu envio',
    created_at: '2026-02-24T19:49:00.000Z',
    isFirstMessage: true,
    unreadAfter: 3,
  },
  {
    role: 'customer',
    content: 'Ola! Gostaria de saber onde se encontra o meu envio',
    created_at: '2026-02-24T19:50:00.000Z',
  },
  {
    role: 'customer',
    content: 'Hola',
    created_at: '2026-02-24T19:52:00.000Z',
  },
  {
    role: 'assistant',
    content:
      'Olá! Claro, posso ajudar com o rastreio do seu envio. Pode me informar o número do seu pedido?',
    created_at: '2026-02-24T19:53:00.000Z',
  },
  {
    role: 'customer',
    content: 'Obrigado pela ajuda!',
    created_at: '2026-02-24T20:10:00.000Z',
  },
  {
    role: 'customer',
    content: 'Olá, preciso trocar um produto',
    created_at: '2026-03-02T14:30:00.000Z',
    isFirstMessage: true,
    unreadAfter: 1,
  },
];

function Bubble({
  message,
}: {
  message: (typeof MOCK_MESSAGES)[number];
}) {
  const isMe = message.role === 'assistant';
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <Box
      display="flex"
      justifyContent={isMe ? 'flex-end' : 'flex-start'}
      width="100%"
      marginBottom="2"
    >
      <Box
        display="flex"
        flexDirection="column"
        maxWidth="80%"
        gap="0-5"
        alignItems={isMe ? 'flex-end' : 'flex-start'}
      >
        <div
          style={{
            backgroundColor: isMe ? '#eef5ff' : '#ffffff',
            borderRadius: '16px',
            padding: '10px 16px',
            fontFamily: "'Geist', sans-serif",
            fontSize: '14px',
            lineHeight: '20px',
            color: '#0a0a0a',
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.content}
        </div>
        <span
          style={{
            color: '#5d5d5d',
            fontSize: '12px',
            fontFamily: "'Geist', sans-serif",
          }}
        >
          {time}
        </span>
      </Box>
    </Box>
  );
}

export default function PreviewEndDivider() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="6"
      style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}
    >
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="700px"
        gap="2"
      >
        <Text fontSize="highlight" fontWeight="bold" textAlign="center">
          Preview: Novo "Fim de conversa"
        </Text>
        <Text fontSize="base" color="neutral-textLow" textAlign="center">
          Simulação de 3 sessões de conversa com divisores entre elas
        </Text>

        <Box
          display="flex"
          flexDirection="column"
          padding="4"
          marginTop="4"
          style={{
            backgroundColor: '#f6f6f6',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
          }}
        >
          {MOCK_MESSAGES.map((message, index) => (
            <div key={index}>
              {message.isFirstMessage && (
                <ConversationEndDivider
                  endedAt={
                    index > 0
                      ? MOCK_MESSAGES[index - 1].created_at
                      : undefined
                  }
                  unreadCount={message.unreadAfter}
                />
              )}
              <Bubble message={message} />
            </div>
          ))}
        </Box>

        <Box marginTop="6" padding="4" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Text fontSize="base" fontWeight="bold">Comparação com o anterior:</Text>
          <Box marginTop="2">
            <Text fontSize="caption" color="neutral-textLow">
              Antes: Linhas sólidas amber + tag warning sem data
            </Text>
            <Box display="flex" alignItems="center" my="2">
              <hr style={{ flex: 1, border: '1px solid #935B00', margin: '0 10px' }} />
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                backgroundColor: '#FFF3CD',
                border: '1px solid #935B00',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#935B00',
              }}>
                ⊙ Fim de conversa
              </div>
              <hr style={{ flex: 1, border: '1px solid #935B00', margin: '0 10px' }} />
            </Box>
          </Box>
          <Box marginTop="4">
            <Text fontSize="caption" color="neutral-textLow">
              Depois: Linha tracejada neutra + pill com data/hora + mensagens não lidas
            </Text>
            <ConversationEndDivider
              endedAt="2026-01-20T11:19:00.000Z"
              unreadCount={3}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
