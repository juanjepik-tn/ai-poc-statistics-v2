import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
// types
// import { IChatParticipant } from 'src/types/chat';
// components
// import Lightbox, { useLightBox } from 'src/components/lightbox';

//
import { TypeAnimation } from 'react-type-animation';
// import { IConversation, IConversationMessage } from 'src/types/conversation';
import { Grow } from '@mui/material';
import { Box, Spinner, Text } from '@nimbus-ds/components';
import ConversationMessageItem from './conversation-message-item';
import { useTranslation } from 'react-i18next';
import { useStoreDetails, useWindowWidth } from '@/hooks';
import ConversationEndDivider from './ConversationEndDivider';

function getDateKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateLabel(dateStr: string, t: (key: string) => string): string {
  const msgDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(msgDate, today)) return t('conversations.date-today');
  if (isSameDay(msgDate, yesterday)) return t('conversations.date-yesterday');

  return msgDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ----------------------------------------------------------------------

type Props = {
  messages: any[];
  participants: any[];
  loadMoreConversations: () => void;
  store: string;
  newMessage?: boolean;
  isLoading?: boolean;
  conversation: any;
  isLoadingInitialMessages?: boolean;
  onClickConversation?: (conversation: any) => void;
  hasMore: boolean;
  fetchingMoreMessages: boolean;
};

export default function ConversationMessageList({
  messages,
  participants,
  loadMoreConversations,
  store,
  newMessage,
  isLoading,
  conversation,
  isLoadingInitialMessages,
  hasMore,
  fetchingMoreMessages,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollAdjusted, setScrollAdjusted] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  // const [prevScrollTop, setPrevScrollTop] = useState(0);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== null && windowWidth <= 768;
  const { t } = useTranslation('translations');
  const [renderedMessages, setRenderedMessages] = useState<Set<string>>(
    new Set(),
  );
  const { storeDetails } = useStoreDetails();

  // const scrollRef = useRef<any>(null);

  // const unreadMessagesCount =
  //   conversation?.order != null
  //     ? conversation?.unreadMessagesAfterAccepted
  //     : conversation?.unreadMessages ?? 0;
  // const unreadIndex = messages.length - unreadMessagesCount;

  useEffect(() => {
    if (containerRef.current && !scrollAdjusted) {
      const unreadMessagesHeader = containerRef.current.querySelector(
        '#unread-messages-header',
      );
      if (unreadMessagesHeader) {
        unreadMessagesHeader.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        setScrollAdjusted(true);
      }
    }
  }, [scrollAdjusted]);

  useEffect(() => {
    if (!isLoadingInitialMessages) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoadingInitialMessages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (newMessage) {
      setTimeout(scrollToBottom, 100);
    }
  }, [newMessage]);

  useEffect(() => {
    console.log('prevScrollHeight', prevScrollHeight);
    if (lastMessageId && containerRef.current) {
      console.log('containerRef.current', containerRef.current);
     // const newScrollTop =
        //containerRef.current.scrollHeight - prevScrollHeight + prevScrollTop;
       // containerRef.current.scrollTop = newScrollTop;     
       scrollToMessage(lastMessageId); 
       setLastMessageId(null);
    } else {
      if (messages.length > 0) {
        console.log('scrollToBottom');
        scrollToBottom();
      }
    }
    const newRenderedMessages = new Set(renderedMessages);
    messages.forEach((message) => {
      if (message?.id) {
        newRenderedMessages.add(message.id);
      }
    });
    setRenderedMessages(newRenderedMessages);
  }, [messages]);

  // useEffect(() => {
  //   if (onClickConversation && isLoadingInitialMessages) {
  //     scrollToBottom();
  //   }
  // }, [onClickConversation]);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const scrollListener = useCallback(
    debounce(() => {
      const top = containerRef.current && containerRef.current.scrollTop;
      const threshold = 100; // Ajusta este valor según sea necesario     
      if (
        top !== null &&
        top <= threshold &&
        hasMore &&
        !fetchingMoreMessages &&
        !isLoadingInitialMessages
      ) {        
        setPrevScrollHeight(containerRef?.current?.scrollHeight || 0);
        // setPrevScrollTop(top); 
        setLastMessageId(messages[0].id);
        loadMoreConversations();
      }
    }, 200), // Ajusta el tiempo de debounce según lo que necesites (200ms en este caso)
    [hasMore, fetchingMoreMessages, isLoadingInitialMessages],
  );
  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: 'auto', // Desplazamiento suave
        block: 'start',   
      });
      if (containerRef.current) {
        containerRef.current.scrollTop -= 100;
      }
    }
  };
  useEffect(() => {
    const tableRef: any = containerRef.current;
    if (tableRef) {
      tableRef.addEventListener('scroll', scrollListener);
    }
    return () => {
      if (tableRef) {
        tableRef.removeEventListener('scroll', scrollListener);
      }
    };
  }, [scrollListener]);

  // const slides =
  //   !!messages && messages.map((message) => ({ src: message.content }));

  // #region agent log
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const cs = window.getComputedStyle(el);
      const parent = el.parentElement;
      const parentCs = parent ? window.getComputedStyle(parent) : null;
      fetch('http://127.0.0.1:7246/ingest/c2947b57-3094-42da-965c-5d20fee898a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-message-list.tsx:scrollContainer',message:'Scroll container DOM metrics',data:{offsetHeight:el.offsetHeight,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,flex:cs.flex,minHeight:cs.minHeight,overflowY:cs.overflowY,parentTag:parent?.tagName,parentOffsetH:parent?.offsetHeight,parentDisplay:parentCs?.display,parentFlex:parentCs?.flex,parentFlexDir:parentCs?.flexDirection,msgCount:messages.length},timestamp:Date.now(),hypothesisId:'H2,H3'})}).catch(()=>{});
    }
  });
  // #endregion

  return (
    <>
      <div
        ref={containerRef}
        key="conversation-message-list-box"
        style={{
          backgroundColor: '#ffffff',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingTop: 'var(--nimbus-spacing-4)',
          paddingLeft: 'var(--nimbus-spacing-5)',
          paddingRight: 'var(--nimbus-spacing-4)',
          paddingBottom: isMobile ? 'var(--nimbus-spacing-10)' : undefined,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {isLoading && (
          <TypeAnimation
            sequence={[
              'Cargando mensajes ...',
              500, // Waits 1s
              '',
              100,
              'Cargando mensajes ...',
              500, // Waits 1s
            ]}
            wrapper="span"
            // omitDeletionAnimation
            repeat={5}
            style={{ display: 'inline-block' }}
          />
        )}
        {fetchingMoreMessages && (
          <>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Spinner size="small" />
              <Text>{t('conversations.loading-more')}</Text>
            </Box>
          </>
        )}

        {messages.map((message, index) => {
          const currentDateKey = message?.created_at ? getDateKey(message.created_at) : null;
          const prevDateKey = index > 0 && messages[index - 1]?.created_at
            ? getDateKey(messages[index - 1].created_at)
            : null;
          const showDateDivider = currentDateKey && currentDateKey !== prevDateKey;

          return (
          <div
            key={`message-${index}`}
            id={`message-${message.id}`}
            style={{
              marginBottom: index === messages.length - 1 ? '10px' : '10px',
            }}
          >
          {showDateDivider && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              my="4"
            >
              <div style={{
                backgroundColor: '#e2e2e2',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '12px',
                color: '#54656f',
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                lineHeight: '20px',
              }}>
                {getDateLabel(message.created_at, t)}
              </div>
            </Box>
          )}
          {message?.isFirstMessage && (() => {
              let unread = 0;
              for (let j = index; j < messages.length; j++) {
                if (messages[j].role === 'customer' || messages[j].role === 'user') {
                  unread++;
                } else {
                  break;
                }
              }
              return (
                <ConversationEndDivider
                  endedAt={index > 0 ? messages[index - 1]?.created_at : undefined}
                  unreadCount={unread}
                />
              );
            })()}
            <Grow
              in={renderedMessages.has(message?.id)}
              timeout={300}
              key={message?.id}
            >
              <div>
                <ConversationMessageItem
                  message={message}
                  participants={participants}
                  onOpenLightbox={() => {}}
                  store={store}
                  channelType={conversation?.channel?.channelType}
                  assignee={conversation?.assignee}
                />
              </div>
            </Grow>            
          </div>
          );
        })}
      </div>
    </>
  );
}
