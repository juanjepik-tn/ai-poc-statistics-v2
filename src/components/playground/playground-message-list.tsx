// @mui
import Box from '@mui/material/Box';
// types
// import { IChatParticipant, IChatMessage } from 'src/types/chat';
// components
// import Lightbox, { useLightBox } from 'src/components/lightbox';
import { TypeAnimation } from 'react-type-animation';
//
// import { IPlaygroundMessage } from 'src/types/playground';
import PlaygroundMessageItem from './playground-message-item';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DisapprovalForm from '@/pages/OnboardingStepper/components/Playground/DisapprovalForm';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
// import Scrollbar from '../scrollbar';

// ----------------------------------------------------------------------

type Props = {
  messages: any[];
  participants: any[];
  isSendingMessage: boolean;
  store: string;
  source: 'onboarding' | 'settings';
};

export default function PlaygroundMessageList({
  messages,
  participants,
  isSendingMessage,
  store,
  source,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  /* const slides = messages?.length > 0
  ? messages.map((message) => ({ src: message.content }))
  : []
*/
  // const lightbox = useLightBox(slides);
  const { t } = useTranslation('translations');
  const [openForm, setOpenForm] = useState(false);
  const toggleOpenForm = () => setOpenForm((prevState) => !prevState);
  const [currentFeedbackMessage, setCurrentFeedbackMessage] = useState<any>(null);
  const [previousMessage, setPreviousMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { request } = useFetch();
  const [rejectFeedback, setRejectFeedback] = useState(false);
  const getPreviousCustomerMessage = (messageId: number) => {
    const currentIndex = messages.findIndex((msg) => msg.id === messageId);
    if (currentIndex === -1) return null;

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (messages[i].class.startsWith('message-customer')) {
        return messages[i].content;
      }
    }
    return null;
  };
  const createContent = async (data: any): Promise<boolean> => {  
    setRejectFeedback(true);
    setLoading(true);
    return request<any>({
      url: API_ENDPOINTS.messages.updateMessageFeedbackRejected(currentFeedbackMessage.id),      
      method: 'POST',
      data: {
        title: data.title,
        content: data.content,
      },
    })
      .then(() => {
        setLoading(false);
        // setCurrentFeedbackMessage(null);        
        setPreviousMessage('');        
        setTimeout(() => {
          setRejectFeedback(false);
        }, 1000);
        toggleOpenForm();
        addToast({
          type: 'success',
          text: t('settings.step4.rejected-modal.success'),
          duration: 4000,
          id: 'success-products',
        });
        return true;
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-products',
        });
        return false;
      });
  }
  return (
    <>
  
      <Box
        ref={containerRef}
        sx={{ px: 3, py: 5, height: 1 , overflowY: 'scroll'}}
      >
        <Box>
          {messages &&
            messages.map((message) => (
              <PlaygroundMessageItem
                source={source}
                key={message.id}
                message={message}
                participants={participants}
                onOpenLightbox={() => {}}
                store={store}
                toggleOpenForm={() => {
                  const prevMessage = getPreviousCustomerMessage(message.id);                  
                  setCurrentFeedbackMessage((_prev: any) => {
                    return message;
                  });
                  setPreviousMessage((_prev: any) => {
                    return prevMessage ?? '';
                  });                  
                  toggleOpenForm();
                }}
                rejectFeedback={rejectFeedback && message.id === currentFeedbackMessage?.id}
              />
            ))}
        </Box>
      </Box>
      {isSendingMessage ? (
        <Box sx={{ p: 3 }}>
          <TypeAnimation
            sequence={[
              t('settings.step4.writing') + "...",
              500, // Waits 1s
              '',
              100,
              t('settings.step4.writing') + "...",
              500, // Waits 1s
            ]}
            wrapper="span"
            // omitDeletionAnimation
            repeat={5}
            style={{ display: 'inline-block' }}
          />
        </Box>
      ) : null}
   
      <DisapprovalForm open={openForm} title={previousMessage} toggleOpen={toggleOpenForm} onCreateContent={createContent} loading={loading}/>

    </>
  );
}
