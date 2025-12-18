// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
// import axios, { API_ENDPOINTS } from 'src/utils/axios';
// import { enqueueSnackbar } from 'notistack';
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// types
// import { IChatParticipant, IChatMessage } from 'src/types/chat';
// components
//
import { AudioPlayer } from 'react-audio-play';
// import { IPlaygroundMessage } from 'src/types/playground';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import { trackingPlaygroundResponseFeedback } from '@/tracking';
import { Box, IconButton, Spinner, Text, useToast } from '@nimbus-ds/components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormattedTextWrapper from '../conversation/providers/FormattedTextWrapper';
import Iconify from '../iconify';
import { useGetMessage } from './hooks';

// ----------------------------------------------------------------------

type Props = {
  message: any;
  participants: any[];
  onOpenLightbox: (value: string) => void; 
  store: string;
  toggleOpenForm: () => void;
  rejectFeedback: boolean;
  source: 'onboarding' | 'settings';
};

export default function PlaygroundMessageItem({
  message,
  participants,
  toggleOpenForm,
  rejectFeedback,
  // onOpenLightbox,
  //store,
  source,
}: Props) {
  
  useEffect(() => {
    if (rejectFeedback) {
      setIsRejecting(true);
      handleFeedbackStatus('0');
    }
  }, [rejectFeedback]);
  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    participants,
    currentUserId: '3',
  });
  // 0 es no ha votado, 1 es votado, -1 es votado negativamente
  const [feedbackStatus, setFeedbackStatus] = useState<boolean | null>(null);
  const { t } = useTranslation('translations');
  const { firstName } = senderDetails;

  const { content } = message;
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { request } = useFetch();
  const { addToast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const MAX_CARACTERS = 50;
  useEffect(() => {
    setFeedbackStatus(message?.response_accepted ?? null);
  }, [message]);
  
  
  const handleFeedbackStatus = (status: string) => {    
   
      return request<any>({
        url: API_ENDPOINTS.messages.updateMessageFeedbackStatus(message.id, status),
        method: 'PUT',      
      })
        .then(() => {     
          setFeedbackStatus(status === '1');
          setIsApproving(false);
          setIsRejecting(false);        
          if (status === '0') {          
            toggleOpenForm();
          }
          trackingPlaygroundResponseFeedback({
            feedback: status === '1' ? 'Positive' : 'Negative',
            source: source,
          });
          return true;
        })
        .catch((error) => {        
          addToast({
            type: 'danger',
            text: error.message.description ?? error.message,
            duration: 4000,
            id: 'error-update-ia-configurations',
          });
          return false;
        });    
  }
  /*
    const downloadBase64Data = (base64Data: any) => {
      const base64Prefix = base64Data.match(
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/,
      );
  
      let fixedBase64Data = base64Data;
      let mimeType = 'application/octet-stream';
  
      if (base64Prefix) {
        fixedBase64Data = base64Data.replace(base64Prefix[0], '');
        mimeType = base64Prefix[1];
      }
      const paddedBase64Data = fixedBase64Data.padEnd(
        fixedBase64Data.length + ((4 - (fixedBase64Data.length % 4)) % 4),
        '=',
      );
  
      const finalBase64Data = paddedBase64Data
        .replace(/-/g, '+')
        .replace(/_/g, '/');
  
      try {
        const binaryData = atob(finalBase64Data);
        const arrayBuffer = Uint8Array.from(binaryData, (char) =>
          char.charCodeAt(0),
        ).buffer;
        const blob = new Blob([arrayBuffer], { type: mimeType });
  
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `VICI-${store}.${message.mimetype}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error decoding Base64 data:', error);
      }
    };
    */
  /*
    const handleDownloadFiles = () => {
      if (message.extra_data) {
        downloadBase64Data(message.extra_data);
      } else {
        const URL = API_ENDPOINTS.store.pdf(store, '1', '1');
        axios
          .get(URL, { responseType: 'blob' })
          .then(({ data }) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `VICI-${store}.pdf`); // or any other extension
            document.body.appendChild(link);
            link.click();
          })
          .catch((error) => {
            enqueueSnackbar('Se ha producido un error al descargar el Menú', {
              variant: 'error',
            });
          });
      }
    };
  */
  const renderPreview = () => {
    if (!message.extra_data || message.mimetype === 'message-menu') {
      return renderIcon();
    }
    if (message.extra_data) {
      return <img src={message.extra_data} alt="Imagen" />;
    }
    return null;
  }; 
  const renderIcon = () => {
    const isPdf = !message.extra_data || message.mimetype === 'pdf';

    return (
      <>
        <Iconify
          width={48}
          icon={
            isPdf
              ? 'vscode-icons:file-type-pdf2'
              : 'material-symbols:image-sharp'
          }
        />

        <Typography variant="body1" component="span">
          Menú
        </Typography>
      </>
    );
  };

  const downloadFile = async (
    message: any,
  ): Promise<string | null> => {
    if (message.mimetype) {
      try {
        console.log('downloadFile', message);
        const { content } = await request<any>({
          url: API_ENDPOINTS.message.downloadFile(message.id),
          method: 'GET',
          responseType: 'blob',
        });

        const blobUrl = URL.createObjectURL(content);
        setAudioUrl(blobUrl);
        return blobUrl;
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
        return null;
      }
    }
    return null;
  };

  const renderAudio = () => {
    useEffect(() => {
      if (!audioUrl && message.class === 'message-customer-audio') {
        downloadFile(message).then((url) => {
          if (url) {
            setAudioUrl(url as string);
          }
        });
      }
    }, [audioUrl, message]);
  
    return (
      <>
        
        <Box width="400px">
          <AudioPlayer
            width="350px"
            preload="metadata"
            color="#135D66"
            sliderColor="#00A884"
            src={audioUrl || `data:${message.mimetype};base64,${message.extra_data}`}
            onError={(event, errorMessage) => {
              console.error("Error al cargar el audio:", errorMessage);
              console.log("Evento de error:", event);
            }}
          />
          <Typography variant="body2" color="textSecondary" mt={1}>
            {!expanded ? (
              <>
                {message.content.slice(0, MAX_CARACTERS)}{message.content.length > MAX_CARACTERS && "..."}
                {message.content.length > MAX_CARACTERS && (
                  <Typography
                    variant="body2"
                    color="primary"
                    component="span"
                    onClick={() => setExpanded(true)}
                    sx={{ cursor: 'pointer', ml: 1 }}
                  >
                    {t('conversations.view-more')}
                  </Typography>
                )}
              </>
            ) : (
              <>
                {message.content}
                <Typography
                  variant="body2"
                  color="primary"
                  component="span"
                  onClick={() => setExpanded(false)}
                  sx={{ cursor: 'pointer', ml: 1 }}
                >
                  {t('conversations.view-less')}
                </Typography>
              </>
            )}
          </Typography>
        </Box>
        
      </>
    );
  };

  

  const renderPDF = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      // onClick={handleDownloadFiles}
      sx={{ cursor: 'pointer' }}
    >
      {renderPreview()}
    </Stack>
  );

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        color: 'text.disabled',
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {!me && `${firstName},`} &nbsp;
    </Typography>
  );




const renderContent = (
  <Box>
       <FormattedTextWrapper text={content}>
        {(formattedContent: any) => (
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        )}
      </FormattedTextWrapper>
  </Box>
);

  const renderBody = (
    <Box
      p={hasImage ? 'none' : '2'}
      minWidth="48px"
      maxWidth="700px"
      borderRadius="1"
      backgroundColor={
        me ? 'primary-surface' : 'neutral-surface'
      }

    /* sx={{
      p: 1.5,
      minWidth: 48,
      maxWidth: 700,
      borderRadius: 1,
      typography: 'body2',
      bgcolor: 'color-light-neutral-surface',
      ...(me && {
        color: 'grey.800',
        bgcolor: 'primary.lighter',
      }),
      ...(hasImage && {
        p: 0,
        bgcolor: 'transparent',
      }),
    }} */
    >
      <Text color="neutral-textLow">
        {message.class === 'message-menu'
          ? renderPDF
          : message.class === 'message-audio' || message.class === 'message-customer-audio'
            ? renderAudio()
            : renderContent}
      </Text>
      {!me && feedbackStatus !== null && <Box display="flex" justifyContent="flex-end" gap="2" alignItems="center">
        <img src={feedbackStatus === false ? "/imgs/thumb-down-icon.svg" : "/imgs/thumb-up-icon.svg"} alt="Thumb icon" width="10px" height="10px"/>        
        <Text as="span" fontSize="caption" color={feedbackStatus === false ? "danger-interactive" : "success-interactive"}>{feedbackStatus === false ? t('settings.step4.feedback-rejected') : t('settings.step4.feedback-approved')}</Text>        
      </Box>}
    </Box>
  );

  return (
    <>
      <style>
        {`
          .rap-current-time {
            display: none; /* Oculta el elemento */
          }
        `}
      </style>
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'}>
      <Box display="flex" flexDirection="column" gap="2">

        <Stack alignItems="flex-end">
          {renderInfo}

          <Stack
            direction="row"
            alignItems="center"
            sx={{
              position: 'relative',
              '&:hover': {
                '& .message-actions': {
                  opacity: 1,
                },
              },
            }}
          >
            {renderBody}
          </Stack>
        </Stack>
        {!me && feedbackStatus === null && (
          <Box display="flex" gap="0-5" flexDirection="column">
            <Box display="flex" justifyContent="flex-start">
              <Text as="span" color="neutral-textHigh">{t('settings.step4.feedback-question')}</Text>
            </Box>
            <Box display="flex" gap="0-5">
              <IconButton disabled={isRejecting} color="success-surface" source={isApproving ? <Spinner size="small" color="success-interactive" /> : <img src="/imgs/thumb-up-button.svg" alt="Thumb up" />} backgroundColor="transparent" borderColor="transparent" onClick={() => {setIsApproving(true); handleFeedbackStatus('1')}}/>
              <IconButton disabled={isApproving} source={isRejecting ? <Spinner size="small" color="danger-interactive"/> : <img src="/imgs/thumb-down-button.svg" alt="Thumb down" />} backgroundColor="transparent" borderColor="transparent" onClick={toggleOpenForm}/>
            </Box>
          </Box>
        )}
      </Box>
    </Stack>
    </>
  );
}
