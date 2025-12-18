import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import { trackingPlaygroundAudioStartRecording, trackingPlaygroundAudioStopRecording, trackingPlaygroundMessageUpdate } from '@/tracking';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import { Box, useToast } from '@nimbus-ds/components';
import { PaperPlaneIcon } from '@nimbus-ds/icons';
import { AudioPlayer } from 'react-audio-play';
import { useTranslation } from 'react-i18next';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  recipients: any;
  onSendMessage: any;
  currentConversationId: any;
  onSendAudio: any;
  question: string;
  source: 'onboarding' | 'settings';
};

export default function PlaygroundMessageInput({
  onSendMessage,
  onSendAudio,
  question,
  source,
}: Props) {
  // const router = useRouter();

  // const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [iconAudio, setIconAudio] = useState('ic:outline-mic');
  const { t } = useTranslation('translations');
  // referencias para dibujar el audio grabado
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const bufferLengthRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (question) {
      setMessage(question);
    }
  }, [question]);

  

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    const analyser = analyserRef.current;
    if (!analyser) return;
    const dataArray = dataArrayRef.current;
    if (!dataArray) return;
    const bufferLength = bufferLengthRef.current;

    const drawVisual = () => {
      requestAnimationFrame(drawVisual);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] / 255;
        const barHeight = (amplitude * canvas.height) / 2;

        canvasCtx.fillStyle = '#7abcf7';
        canvasCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
        canvasCtx.fillRect(x, centerY, barWidth, barHeight);

        x += barWidth + 2;
      }
    };

    drawVisual();
  };
  useEffect(() => {
    if (mediaRecorder) {
      draw();
    }
    return () => {
      if (audioContextRef.current) {
        // audioContextRef.current.close();
      }
    };
  }, [mediaRecorder]);
  
  const startRecording = () => {
    trackingPlaygroundAudioStartRecording({
      source: source
    });
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        bufferLengthRef.current = bufferLength;
        audioContextRef.current = audioContext;

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          setAudioChunks((prev) => [...prev, e.data]);
        };
        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-create-content',
         });   
      }

      );
  };
  
  const stopRecording = () => {
    trackingPlaygroundAudioStopRecording({
      source: source
    });
    if (mediaRecorder) {
      mediaRecorder.stop();
      //setMediaRecorder(null);
    }
     // Detiene todas las pistas del stream
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch((error) => {
        console.error('Error al cerrar el AudioContext: ', error);
      });
      audioContextRef.current = null;
    }
  }; 

  const handleRecordClick = () => {
    setIsTyping(false);
    if (!mediaRecorder) {
      setIconAudio('material-symbols:pause-circle-outline');
      startRecording();
    } else {
      setIconAudio('ic:outline-mic');
      stopRecording();
    }
  }; 
  /*
  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []); */

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setMessage(value);
      setIsTyping(!!value.trim());
    },
    [],
  );

  const handleSend = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (message) {
          onSendMessage(message);
        }
         setIsTyping(false);
        setMessage('');
      }
    },
    [message, onSendMessage],
  );
  const sendMessage = () => {
    if (message) {
      onSendMessage(message);
      setIsTyping(false);
    }
    setMessage('');
  };

  const sendAudio = () => {
    if (audioChunks.length > 0) {
      onSendAudio(new Blob(audioChunks, { type: 'audio/wav' }));
      setAudioChunks([]);
      setMediaRecorder(null);
    }
  };

  const deleteAudio = () => {
    setMediaRecorder(null);
    setAudioChunks([]);
  };

  const handleKeyDown = useCallback(

    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          // Insert a line break
          event.preventDefault();
          const cursorPosition = inputRef.current?.selectionStart || 0;
          const newValue =
            message.slice(0, cursorPosition) +
            '\n' +
            message.slice(cursorPosition);
          setMessage(newValue);
          setTimeout(() => {
            inputRef.current?.setSelectionRange(
              cursorPosition + 1,
              cursorPosition + 1,
            );
          }, 0);
        } else {
          // Send the message
          event.preventDefault();
          handleSend(event);
        }
      }
    },
    [handleSend, message],
  );

  return (
    <>
     <style>
        {`
          .rap-current-time {
            display: none; 
          }
        `}
      </style>
      {!mediaRecorder && (
        <InputBase
          multiline
          minRows={1}
          maxRows={5}
          inputRef={inputRef}
          value={message}
          onKeyDown={handleKeyDown}
          onChange={handleChange} 
          placeholder={t('settings.step4.write')}
          endAdornment={
            <Stack direction="row" sx={{ flexShrink: 0 }}>
              {isTyping ? (
                  <IconButton onClick={sendMessage}>
                      <PaperPlaneIcon color='#0050C3' />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleRecordClick}>
                    <Iconify width={25} icon={iconAudio} />
                  </IconButton>
                )}
            </Stack>
          }
          sx={{
            px: 1,
            flexShrink: 0,
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            height: 'auto',
            maxHeight: 200

          }}
          onBlur={() => {
            trackingPlaygroundMessageUpdate({
              source: source,
              message: message,
            });
          }}
        />
      )}

      {mediaRecorder && audioChunks.length === 0 && (
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <canvas ref={canvasRef} id="audioCanvas" width="auto" height="50px" />
          <InputBase
            endAdornment={
              <Stack direction="row" sx={{ flexShrink: 0 }}>
                {isTyping ? (
                  <IconButton onClick={sendMessage}>
                    <PaperPlaneIcon color='#0050C3' />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleRecordClick}>
                    <Iconify width={25} icon={iconAudio} />
                  </IconButton>
                )}
              </Stack>
            }
            sx={{
              px: 1,
              height: 56,
              flexShrink: 0,
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          />
        </Box>
      )}

      {audioChunks.length > 0 && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          marginBottom="1"
          marginTop="1"
        >
          <IconButton onClick={deleteAudio}>
            <Iconify icon="ic:baseline-delete" width={25} />
          </IconButton>

          <AudioPlayer
            preload="metadata"
            width="40%"
            style={{ height: 'auto' }}
            color="#002c53"
            sliderColor="#006bc8"
            src={URL.createObjectURL(new Blob(audioChunks))}
          />
          <IconButton onClick={sendAudio}>
            <PaperPlaneIcon color='#0050C3' />
          </IconButton>
        </Box>
      )}
    </>
  );
}
