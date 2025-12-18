import { useCallback, useEffect, useState } from 'react';
// import axios, { API_ENDPOINTS } from 'src/utils/axios';
import { TypeAnimation } from 'react-type-animation';
// @mui

import Stack from '@mui/material/Stack';
// redux
// import { RootState, useDispatch } from 'src/redux/store';

// components
// import { reset } from 'src/redux/slices/notification';
// import { useSettingsContext } from 'src/components/settings';
// import { useSelector } from 'react-redux/es/hooks/useSelector';
//
// import { IPlaygroundMessage } from 'src/types/playground';
// import { Mixpanel } from 'src/Mixpanel';
// import StoreSeach from 'src/components/store-search/store-search';
// import useHasRoles from 'src/hooks/use-has-roles';
// import EmptyContent from 'src/components/empty-content';
// import { useSnackbar } from 'src/components/snackbar';
// import { useChat } from '../hooks';
import { Box, Button, Card, Icon, Spinner, Text, Title, useToast } from '@nimbus-ds/components';
import { RedoIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import PlaygroundMessageInput from '../playground-message-input';
import PlaygroundMessageList from '../playground-message-list';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import PlaygroundQuickQuestions from './playground-quick-questions';
import { trackingPlaygroundAudioSend, trackingPlaygroundMessageSent, trackingPlaygroundReset, trackingQuestionUsed } from '@/tracking';

// ----------------------------------------------------------------------
type Props = {
  showTitle?: boolean;
  currentStore?: any;
  source: 'onboarding' | 'settings';
};
export default function PlaygroundView({ currentStore, source }: Props) {

  const { t } = useTranslation('translations');

  const [conversation, setConversation] = useState<any>({});
  const [selectedStore] = useState(currentStore?.id || '');

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorLoadingMessages] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  // const notification = useSelector((state: any) => state.notification);
  const { request } = useFetch();
  const { addToast } = useToast();
  const [question] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  useEffect(() => {
    resetQuestions();
  }, []);

  const resetQuestions = () => {
    setQuestions(t('settings.step4.quick-questions', { returnObjects: true }) as string[]);
  }

  const reset = () => {
    setIsResetting(true);
    setIsSendingMessage(false);
    request<any[]>({
      url: API_ENDPOINTS.playground.reset,
      method: 'POST',
    })
      .then(() => {
        setMessages([]);
        setIsResetting(false);
        resetQuestions();
        addToast({
          type: 'success',
          text: t('settings.step4.reset-success'),
          duration: 4000,
          id: 'reset-success',
        });
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-content',
        });
        setIsResetting(false);
      });
  };


  const getLastConversation = useCallback(() => {
    setLoadingMessages(true);
    request<any[]>({
      url: API_ENDPOINTS.playground.lastConversation,
      method: 'GET',
    })
      .then(({ content }: any) => {        
        setConversation(content.conversation);
        setMessages(content.conversation?.messagesPanel || []);
        setLoadingMessages(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMessages(false);
      });
  }, [selectedStore, setLoadingMessages, setConversation, setMessages]);

  useEffect(() => {
    getLastConversation();
  }, [getLastConversation]);

  /*
  useEffect(() => {
    getLastConversation();

  }, [newOrder, selectedStore, getLastConversation]);

  useEffect(() => {

    if (notification.conversationUpdate) {
      const conversationUpdate = notification.conversationUpdate;
      if (conversationUpdate && conversationUpdate.conversation_id) {
          if (conversationUpdate.conversation_id === conversation?.id) {
            getLastConversation();
          }
      }
    }
  }, [notification, getLastConversation, conversation?.id]);

*/

  
  const onSendAudio = useCallback(
    async (body: any) => {
      const buffer = await body.arrayBuffer();
      const binaryString = Array.from(new Uint8Array(buffer), byte => String.fromCharCode(byte)).join('');
      const theAudio = btoa(binaryString);
      const DATA = {
        store: parseInt(selectedStore,10),
        content: theAudio,
        type: 'audio'
      }
      const actualMessages = [...messages];
      const msg: any = {
        id: "1",
        content: "",
        role: "user",
        created_at: new Date(),
        class: "message-audio",
        extra_data: theAudio,
        mimetype: "audio/wav",
        type: "audio"

      }
      actualMessages.push(msg)
      setMessages(actualMessages)
      setIsSendingMessage(true);
      trackingPlaygroundAudioSend({
        source: source,
      });
      try {
        request<any[]>({
          url: API_ENDPOINTS.playground.message,
          method: 'POST',
          data: DATA,
        })
          .then(( data:any ) => {
            setIsSendingMessage(false);
            setConversation(data?.content?.conversation);
            setMessages(data?.content?.conversation?.messagesPanel || []);

          })
          .catch(() => {
           
            setIsSendingMessage(false);
            actualMessages.pop();
            setMessages(actualMessages);
            addToast({
              type: 'danger',
              text: t('settings.step4.Could not process audio due to external issues with the service that processes the audio.'),
              duration: 4000,
              id: 'error-send-audio',
            });


          });

      } catch (error) {
        setIsSendingMessage(false)
        console.error(error);
      }
    },

    [messages, selectedStore]
  );


  /*

  const onSendMessage = useCallback(
    (body: string) => {
      const DATA = {
        store: parseInt(selectedStore,10),
        content: body
      }
      const actualMessages = [...messages];
      const msg: IPlaygroundMessage = {
        id: "1",
        content: body,
        role: "user",
        created_at: new Date(),
        class: "customer-message",
        extra_data: "",
        mimetype: "",
        type: "text"

      }
      actualMessages.push(msg)

      setMessages(actualMessages)


      setIsSendingMessage(true);

      try {
        axios
          .post(API_ENDPOINTS.playground.sendMessage, DATA)
          .then(({ data }) => {
            setConversation(data.conversation)
            Mixpanel.track('Playground test', {id: selectedStore, content: body});
            setMessages(data?.conversation?.messages || []);
            setIsSendingMessage(false)

          })
          .catch((error) => {
            setIsSendingMessage(false)
            enqueueSnackbar('Ha ocurrido un error al enviar el mensaje', {variant: 'error'});
            actualMessages.pop();
            setMessages(actualMessages)

          });

      } catch (error) {
        setIsSendingMessage(false)
        console.error(error);
      }
    },

    [messages, selectedStore,enqueueSnackbar]
  );

*/



  const onSendMessage = useCallback(
    (body: string) => {
      const DATA = {
        store: parseInt(selectedStore, 10),
        content: body,
      };
      const actualMessages = [...messages];
      const msg: any = {
        id: '1',
        content: body,
        role: 'user',
        created_at: new Date(),
        class: 'customer-message',
        extra_data: '',
        mimetype: '',
        type: 'text',
      };
      actualMessages.push(msg);

      setMessages(actualMessages);

      setIsSendingMessage(true);
      trackingPlaygroundMessageSent({
        source: source,
        message: body,
      });
      request<any[]>({
        url: API_ENDPOINTS.playground.message,
        method: 'POST',
        data: DATA,
      })
        .then((data: any) => {          
          setIsSendingMessage(false);
          setConversation(data?.content?.conversation);
          setMessages(data?.content?.conversation?.messagesPanel || []);
        })
        .catch((error) => {
          console.log(error);
          setLoadingMessages(false);
        });
    },

    [messages, selectedStore],
  );
  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {loadingMessages ? (
        <Box padding="3">
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
            repeat={5}
            style={{ display: 'inline-block' }}
          />
        </Box>
      ) : errorLoadingMessages ? (
        <Text as='p' color='primary-textLow'>Error en la carga de mensajes</Text>
      ) : (
        <>
  <Box display="flex" flexGrow="1" flexDirection="column" overflowY="scroll" backgroundImage="url(/imgs/conversations-background.jpg)">
            {messages.length === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column">
                <Box marginBottom="2">
                  <Title as='h3'>{t('settings.step4.title-questions')}</Title>
                </Box>

                <PlaygroundQuickQuestions isShortView={false} onQuestionClick={(question) => {
                  trackingQuestionUsed({
                    source: source,
                    question: question,
                  });
                  setQuestions(prevQuestions => prevQuestions.filter((q: string) => q !== question));
                  onSendMessage(question)
                }} questions={questions} />
              </Box>
            ) : (
              <>

                <PlaygroundMessageList
                  source={source}
                  messages={messages}
                  store={selectedStore}
                  participants={[]}
                  isSendingMessage={isSendingMessage}
                />

                <PlaygroundQuickQuestions isShortView={true} onQuestionClick={(question) => {
                  setQuestions(prevQuestions => prevQuestions.filter((q: string) => q !== question));
                  trackingQuestionUsed({
                    source: source,
                    question: question,
                  });
                  onSendMessage(question)
                }} questions={questions} />
              </>
            )}
    </Box>
          <PlaygroundMessageInput
            recipients={[]}
            source={source}
            onSendMessage={onSendMessage}
            onSendAudio={onSendAudio}
            currentConversationId={conversation?.id}
            question={question}
          />
        </>
      )}
    </Stack>
  );


  return (
    <Card padding="none">
      <Card.Header padding="base">
        <Button onClick={() => {
          reset();
          trackingPlaygroundReset({
            source: source,
          });
        }}>
          {t('settings.step4.reset')}
          {!isResetting && <Icon color="currentColor" source={<RedoIcon size="small" />} />}
          {isResetting && <Spinner size="small" />}
        </Button>
      </Card.Header>
      <Card.Body padding="none">
        <Box height="65vh">
          <Stack
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
          >
            <Stack
              direction="row"
              sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              {renderMessages}
            </Stack>
          </Stack>
        </Box>
      </Card.Body>
    </Card>
  );
}
