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
import { Box, Spinner, Tag, Text } from '@nimbus-ds/components';
import ConversationMessageItem from './conversation-message-item';
import { useTranslation } from 'react-i18next';
import { useStoreDetails, useWindowWidth } from '@/hooks';
import { StopIcon } from '@nimbus-ds/icons';

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

  return (
    <>
      <Box
        pt="4"
        ref={containerRef}
        overflowY="auto"
        paddingLeft="5"
        pb={isMobile ? '10' : 'none'}
        width="100%"
        height="100%"
        key="conversation-message-list-box"
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

        {messages.map((message, index) => (
          <div
            key={`message-${index}`}
            id={`message-${message.id}`}
            style={{
              marginBottom: index === messages.length - 1 ? '10px' : '10px',
            }}
          >      
          {message?.isFirstMessage && (
             <Box display="flex" alignItems="center" my="2">
             <hr style={{ flex: 1, border: '1px solid #935B00', margin: '0 10px' }} />
             <Tag appearance="warning" style={{ display: 'flex', alignItems: 'center' }}>
               <StopIcon size={12} />
               <Text color="warning-textLow">{t('conversations.end-conversation')}</Text>
             </Tag>
             <hr style={{ flex: 1, border: '1px solid #935B00', margin: '10px 10px' }} />
              </Box>
            )}
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
                />
              </div>
            </Grow>            
          </div>
        ))}
      </Box>
    </>
  );
}
