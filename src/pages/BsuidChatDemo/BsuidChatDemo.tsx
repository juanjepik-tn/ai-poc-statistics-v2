import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Icon,
  IconButton,
  Input,
  Tag,
  Text,
  Title,
  Tooltip,
  useToast,
} from '@nimbus-ds/components';
import { Page } from '@nimbus-ds/patterns';
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  PaperPlaneIcon,
  UserCircleIcon,
} from '@nimbus-ds/icons';
import {
  MOCK_CONVERSATIONS,
  MOCK_TEMPLATES,
  BsuidConversation,
  BsuidMessage,
  IdentifierType,
} from './mock-data';

/* ─── Helpers ─── */

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const truncateBsuid = (bsuid: string) => {
  if (bsuid.length <= 12) return bsuid;
  return `${bsuid.slice(0, 5)}...${bsuid.slice(-4)}`;
};

const getContactDisplay = (conv: BsuidConversation) => {
  const { contact } = conv;
  switch (contact.identifierType) {
    case 'phone':
      return { name: contact.name, subtitle: contact.phone!, badge: null };
    case 'username':
      return { name: contact.name, subtitle: contact.username!, badge: 'Username' as const };
    case 'bsuid_only':
      return { name: 'Usuario sin identificar', subtitle: truncateBsuid(contact.bsuid!), badge: 'BSUID' as const };
  }
};

const AVATAR_COLORS: Record<string, string> = {
  'conv-phone': '#7C3AED',
  'conv-username': '#2563EB',
  'conv-bsuid': '#6B7280',
};

/* ─── Sub-components ─── */

const ContactAvatar: React.FC<{ conv: BsuidConversation; size?: number }> = ({ conv, size = 40 }) => {
  const display = getContactDisplay(conv);
  const initial = display.name.charAt(0).toUpperCase();
  const bg = AVATAR_COLORS[conv.id] || '#6B7280';

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        background: conv.contact.identifierType === 'bsuid_only' ? '#E5E7EB' : bg,
        color: conv.contact.identifierType === 'bsuid_only' ? '#6B7280' : 'white',
        fontWeight: 600,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {conv.contact.identifierType === 'bsuid_only' ? (
        <Icon source={<UserCircleIcon size={size * 0.6} />} color="neutral-textLow" />
      ) : (
        initial
      )}
    </Box>
  );
};

/* ─── Conversation Nav Item ─── */

const ConvNavItem: React.FC<{
  conv: BsuidConversation;
  selected: boolean;
  onClick: () => void;
}> = ({ conv, selected, onClick }) => {
  const display = getContactDisplay(conv);

  return (
    <Box
      as="button"
      display="flex"
      gap="3"
      padding="3"
      width="100%"
      alignItems="center"
      borderRadius="base"
      style={{
        background: selected ? '#EFF6FF' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onClick={onClick}
    >
      <ContactAvatar conv={conv} size={40} />
      <Box display="flex" flexDirection="column" gap="0-5" style={{ flex: 1, overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text
            fontWeight={conv.unread > 0 ? 'bold' : 'medium'}
            fontSize="base"
            color={conv.contact.identifierType === 'bsuid_only' ? 'neutral-textLow' : 'neutral-textHigh'}
          >
            {display.name}
          </Text>
          <Text fontSize="caption" color="neutral-textDisabled">
            {formatTime(conv.lastMessageTime)}
          </Text>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="1">
          <Box display="flex" alignItems="center" gap="1" style={{ overflow: 'hidden' }}>
            {conv.contact.identifierType === 'username' && (
              <Text fontSize="caption" color="primary-interactive" fontWeight="medium">
                {display.subtitle}
              </Text>
            )}
            {conv.contact.identifierType === 'bsuid_only' && (
              <Text fontSize="caption" color="neutral-textDisabled" style={{ fontFamily: 'monospace' }}>
                {display.subtitle}
              </Text>
            )}
            {conv.contact.identifierType === 'phone' && (
              <Text fontSize="caption" color="neutral-textLow" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conv.lastMessage}
              </Text>
            )}
          </Box>
          {conv.unread > 0 && (
            <Badge appearance="primary" count={conv.unread} />
          )}
        </Box>
        {conv.contact.identifierType !== 'phone' && (
          <Text fontSize="caption" color="neutral-textLow" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {conv.lastMessage}
          </Text>
        )}
      </Box>
    </Box>
  );
};

/* ─── Chat Header ─── */

const ChatHeader: React.FC<{ conv: BsuidConversation; onBack: () => void }> = ({ conv, onBack }) => {
  const display = getContactDisplay(conv);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      padding="3"
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <Box display="flex" style={{ flexShrink: 0 }}>
        <IconButton size="small" onClick={onBack}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <ContactAvatar conv={conv} size={36} />
      <Box display="flex" flexDirection="column" gap="0-5" style={{ flex: 1 }}>
        <Box display="flex" alignItems="center" gap="2">
          <Text fontWeight="bold" fontSize="base">{display.name}</Text>
          {display.badge && (
            <Tooltip content={
              display.badge === 'Username'
                ? 'Este usuario usa WhatsApp con username. Su número no está disponible.'
                : 'Este usuario solo se identifica por BSUID. Su número y username no están disponibles.'
            }>
              <Tag appearance={display.badge === 'Username' ? 'primary' : 'neutral'}>
                <Text fontSize="caption" color={display.badge === 'Username' ? 'primary-textLow' : 'neutral-textLow'}>
                  {display.badge}
                </Text>
              </Tag>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap="1"
        paddingLeft="2"
        paddingRight="2"
        paddingTop="1"
        paddingBottom="1"
        borderRadius="base"
        backgroundColor="success-surface"
      >
        <Box
          borderRadius="full"
          style={{ width: '8px', height: '8px', background: '#22C55E' }}
        />
        <Text fontSize="caption" color="success-textHigh">Online</Text>
      </Box>
    </Box>
  );
};

/* ─── Message Bubble ─── */

const MessageBubble: React.FC<{ msg: BsuidMessage }> = ({ msg }) => {
  if (msg.role === 'system') {
    return (
      <Box display="flex" justifyContent="center" paddingTop="2" paddingBottom="2">
        <Box
          display="flex"
          alignItems="center"
          gap="1"
          paddingLeft="3"
          paddingRight="3"
          paddingTop="1"
          paddingBottom="1"
          borderRadius="base"
          style={{ background: '#FEF3C7' }}
        >
          <Icon source={<InfoCircleIcon size={14} />} color="warning-textHigh" />
          <Text fontSize="caption" color="warning-textHigh">{msg.text}</Text>
        </Box>
        <Text fontSize="caption" color="neutral-textLow">
          {conv.contact.identifierType === 'phone'
            ? conv.contact.phone
            : conv.contact.identifierType === 'username'
              ? conv.contact.username
              : 'Sin número disponible'}
        </Text>
      </Box>
    );
  }

  const isUser = msg.role === 'user';

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-start' : 'flex-end'}
      paddingTop="1"
      paddingBottom="1"
    >
      <Box
        paddingLeft="3"
        paddingRight="3"
        paddingTop="2"
        paddingBottom="2"
        borderRadius="base"
        style={{
          background: isUser ? '#F3F4F6' : '#EEF5FF',
          maxWidth: '75%',
        }}
      >
        <Text fontSize="base" color="neutral-textHigh">{msg.text}</Text>
        <Box display="flex" justifyContent="flex-end" paddingTop="0-5">
          <Text fontSize="caption" color="neutral-textDisabled">{formatTime(msg.timestamp)}</Text>
        </Box>
      </Box>
    </Box>
  );
};

/* ─── REQUEST_CONTACT_INFO Banner ─── */

const RequestContactBanner: React.FC<{
  identifierType: IdentifierType;
  requestState: 'idle' | 'sent' | 'received';
  onRequest: () => void;
  onSave: () => void;
  receivedPhone?: string;
}> = ({ identifierType, requestState, onRequest, onSave, receivedPhone }) => {
  if (identifierType === 'phone') return null;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="3"
      paddingLeft="4"
      paddingRight="4"
      paddingTop="2"
      paddingBottom="2"
      style={{ borderTop: '1px solid #E5E7EB', background: '#FFFBEB' }}
    >
      <Box display="flex" alignItems="center" gap="2" style={{ flex: 1 }}>
        <Icon source={<ExclamationTriangleIcon size={16} />} color="warning-textHigh" />
        {requestState === 'idle' && (
          <Text fontSize="caption" color="warning-textHigh">
            No tenés el número de este contacto
          </Text>
        )}
        {requestState === 'sent' && (
          <Text fontSize="caption" color="warning-textHigh">
            Solicitud enviada, esperando respuesta...
          </Text>
        )}
        {requestState === 'received' && (
          <Box display="flex" alignItems="center" gap="1">
            <Icon source={<CheckCircleIcon size={14} />} color="success-interactive" />
            <Text fontSize="caption" color="success-textHigh">
              El contacto compartió su número: {receivedPhone}
            </Text>
          </Box>
        )}
      </Box>
      {requestState === 'idle' && (
        <Button appearance="neutral" size="small" onClick={onRequest}>
          Solicitar número
        </Button>
      )}
      {requestState === 'received' && (
        <Button appearance="primary" size="small" onClick={onSave}>
          Guardar
        </Button>
      )}
    </Box>
  );
};

/* ─── Template Picker ─── */

const TemplatePicker: React.FC<{
  open: boolean;
  identifierType: IdentifierType;
  onClose: () => void;
  onSelect: (template: typeof MOCK_TEMPLATES[0]) => void;
}> = ({ open, identifierType, onClose, onSelect }) => {
  if (!open) return null;
  const hasPhone = identifierType === 'phone';

  return (
    <Box
      position="absolute"
      style={{
        bottom: '100%',
        left: 0,
        right: 0,
        zIndex: 10,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
      }}
    >
      <Card padding="base">
        <Box display="flex" flexDirection="column" gap="3">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" fontSize="base">Templates</Text>
            <Button appearance="neutral" size="small" onClick={onClose}>Fechar</Button>
          </Box>
          {MOCK_TEMPLATES.map((t) => {
            const isAuth = t.category === 'AUTHENTICATION';
            const disabled = isAuth && !hasPhone;

            return (
              <Tooltip
                key={t.id}
                content={disabled ? 'Los templates de autenticación requieren el número de teléfono del contacto' : ''}
              >
                <Box
                  as="button"
                  display="flex"
                  flexDirection="column"
                  gap="1"
                  padding="3"
                  width="100%"
                  borderRadius="base"
                  style={{
                    border: '1px solid #E5E7EB',
                    background: disabled ? '#F9FAFB' : 'white',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    textAlign: 'left',
                  }}
                  onClick={() => !disabled && onSelect(t)}
                >
                  <Box display="flex" alignItems="center" gap="2">
                    <Text fontWeight="medium" fontSize="base" color={disabled ? 'neutral-textDisabled' : 'neutral-textHigh'}>
                      {t.name}
                    </Text>
                    <Tag appearance={
                      t.category === 'MARKETING' ? 'primary' :
                      t.category === 'UTILITY' ? 'success' : 'warning'
                    }>
                      <Text fontSize="caption">{t.category}</Text>
                    </Tag>
                    {disabled && (
                      <Icon source={<ExclamationTriangleIcon size={14} />} color="warning-textHigh" />
                    )}
                  </Box>
                  <Text fontSize="caption" color="neutral-textLow">{t.text}</Text>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
};

/* ─── Main Component ─── */

const BsuidChatDemo: React.FC = () => {
  const { addToast } = useToast();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [requestStates, setRequestStates] = useState<Record<string, 'idle' | 'sent' | 'received'>>({
    'conv-username': 'idle',
    'conv-bsuid': 'idle',
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages.length]);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !selectedId) return;

    const newMsg: BsuidMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedId,
      role: 'assistant',
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: inputText, lastMessageTime: newMsg.timestamp }
          : c,
      ),
    );
    setInputText('');
  }, [inputText, selectedId]);

  const handleRequestContact = useCallback((convId: string) => {
    setRequestStates((prev) => ({ ...prev, [convId]: 'sent' }));

    setTimeout(() => {
      setRequestStates((prev) => ({ ...prev, [convId]: 'received' }));
    }, 3000);
  }, []);

  const handleSaveContact = useCallback((convId: string) => {
    addToast({
      type: 'success',
      text: 'Número guardado en el contacto',
      duration: 3000,
      id: 'contact-saved',
    });
    setRequestStates((prev) => ({ ...prev, [convId]: 'idle' }));
  }, [addToast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <Page maxWidth="1200px">
      <Page.Header
        title="BSUID & Usernames"
        subtitle="Demo de la experiencia de chat con contactos identificados por username y BSUID"
      >
        <Tag appearance="warning">
          <Text fontSize="caption" color="warning-textHigh">Demo standalone</Text>
        </Tag>
      </Page.Header>
      <Page.Body>
        <Card padding="none" style={{ height: '70vh', overflow: 'hidden' }}>
          <Box display="flex" height="100%">
            {/* ─── Sidebar ─── */}
            <Box
              display="flex"
              flexDirection="column"
              style={{
                width: '340px',
                minWidth: '340px',
                borderRight: '1px solid #E5E7EB',
              }}
            >
              <Box padding="3" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <Title as="h4">Conversas</Title>
              </Box>
              <Box display="flex" flexDirection="column" style={{ flex: 1, overflowY: 'auto' }}>
                {conversations.map((conv) => (
                  <ConvNavItem
                    key={conv.id}
                    conv={conv}
                    selected={conv.id === selectedId}
                    onClick={() => {
                      setSelectedId(conv.id);
                      setShowTemplates(false);
                    }}
                  />
                ))}
              </Box>

              {/* Legend */}
              <Box padding="3" display="flex" flexDirection="column" gap="2" style={{ borderTop: '1px solid #E5E7EB' }}>
                <Text fontSize="caption" fontWeight="bold" color="neutral-textLow">Tipos de contacto:</Text>
                <Box display="flex" flexDirection="column" gap="1">
                  <Box display="flex" alignItems="center" gap="1">
                    <Box borderRadius="full" style={{ width: '8px', height: '8px', background: '#7C3AED' }} />
                    <Text fontSize="caption" color="neutral-textLow">phone — número visible</Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap="1">
                    <Box borderRadius="full" style={{ width: '8px', height: '8px', background: '#2563EB' }} />
                    <Text fontSize="caption" color="neutral-textLow">username — @handle visible</Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap="1">
                    <Box borderRadius="full" style={{ width: '8px', height: '8px', background: '#6B7280' }} />
                    <Text fontSize="caption" color="neutral-textLow">bsuid_only — solo ID opaco</Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* ─── Chat area ─── */}
            <Box display="flex" flexDirection="column" style={{ flex: 1 }}>
              {selectedConv ? (
                <>
                  <ChatHeader conv={selectedConv} onBack={() => setSelectedId(null)} />

                  {/* Messages */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    padding="4"
                    style={{ flex: 1, overflowY: 'auto' }}
                  >
                    {selectedConv.messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* REQUEST_CONTACT_INFO Banner */}
                  <RequestContactBanner
                    identifierType={selectedConv.contact.identifierType}
                    requestState={requestStates[selectedConv.id] || 'idle'}
                    onRequest={() => handleRequestContact(selectedConv.id)}
                    onSave={() => handleSaveContact(selectedConv.id)}
                    receivedPhone="+54 11 5555-9876"
                  />

                  {/* Input area */}
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="2"
                    padding="3"
                    style={{ borderTop: '1px solid #E5E7EB', position: 'relative' }}
                  >
                    <TemplatePicker
                      open={showTemplates}
                      identifierType={selectedConv.contact.identifierType}
                      onClose={() => setShowTemplates(false)}
                      onSelect={(t) => {
                        setInputText(t.text);
                        setShowTemplates(false);
                      }}
                    />
                    <Button
                      appearance="neutral"
                      size="small"
                      onClick={() => setShowTemplates(!showTemplates)}
                    >
                      Templates
                    </Button>
                    <Box style={{ flex: 1 }}>
                      <Input
                        placeholder="Escreva uma mensagem..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </Box>
                    <IconButton
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                    >
                      <PaperPlaneIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap="4"
                  style={{ flex: 1 }}
                >
                  <Icon source={<InfoCircleIcon size="large" />} color="neutral-textDisabled" />
                  <Text color="neutral-textLow" textAlign="center">
                    Selecione uma conversa para ver as mensagens
                  </Text>
                  <Box display="flex" flexDirection="column" gap="2" style={{ maxWidth: '400px' }}>
                    <Text fontSize="caption" color="neutral-textDisabled" textAlign="center">
                      Esta demo muestra cómo se ven las conversaciones con los nuevos tipos de contacto
                      de WhatsApp: teléfono, username y BSUID.
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </Page.Body>
    </Page>
  );
};

export default BsuidChatDemo;
