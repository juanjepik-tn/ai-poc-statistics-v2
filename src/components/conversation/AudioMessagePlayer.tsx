import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AudioPlayer } from 'react-audio-play';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@nimbus-ds/components';

type AudioMessagePlayerProps = {
  audioUrl: string | null;
  message: any;
};

export const AudioMessagePlayer = ({ audioUrl, message }: AudioMessagePlayerProps) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation('translations');
  const MAX_CARACTERS = 50;
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [width] = useState<number>(window.innerWidth);
  const isMobile = width <= 768;
  const [hasAudioSource, setHasAudioSource] = useState(true);

  useEffect(() => {
    if (message.id === 'temporal') {
      setIsLoadingTranscription(true);
    } else {
      setIsLoadingTranscription(false);
    }
  }, [message.id]);
  useEffect(() => {
    // los mensajes temporales no tienen id para descargar    
    if (audioUrl || message?.extra_data) {
      setHasAudioSource(true);
    } else {
      setHasAudioSource(false);
    }
  }, [audioUrl, message]);
  return (
    <Box width={isMobile ? 'fit-content' : '400px'}>
      {hasAudioSource ? (
        <AudioPlayer
          preload="metadata"
          color="#135D66"
          sliderColor="#00A884"
          width={isMobile ? '' : '350px'}
          src={audioUrl || `data:${message.mimetype};base64,${message.extra_data}`}
          onError={(event, errorMessage) => {
            console.error("Error al cargar el audio:", errorMessage);
            console.log("Evento de error:", event);
          }}
        />
      ) : (
        <Box display="flex" alignItems="start" justifyContent="start">
          <Spinner size="small" />
        </Box>
      )}
      <Typography variant="body2" color="textSecondary" mt={1}>
        {isLoadingTranscription && (
          <Box display="flex" alignItems="center" gap={1}>
            <Spinner size="small" />
            <Typography variant="body2">{t('conversations.transcribing-audio')}</Typography>
          </Box>
        )}
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
  );
};