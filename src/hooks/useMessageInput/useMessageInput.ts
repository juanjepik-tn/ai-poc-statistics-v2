import { useToast } from '@nimbus-ds/components';
import { useState, useCallback, useRef, useEffect } from 'react';

interface SendMessageOptions {
  onBeforeSend?: (message: string) => void;
  onAfterSend?: () => void;
  validateSend?: (message: string) => boolean;
  trimMessage?: boolean;
}

interface UseMessageInputProps {
  onSendMessage: (message: string) => void;
  onSendCompose: (message: string) => void;
  onSendAudio: (blob: Blob) => void;
  onSendImage: (imageUrl: string) => void;
  sendMessageOptions?: SendMessageOptions;
}
export const useMessageInput = ({ onSendMessage, onSendCompose, onSendAudio, onSendImage, sendMessageOptions }: UseMessageInputProps) => {
  const [message, setMessage] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [iconAudio, setIconAudio] = useState('ic:outline-mic');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const bufferLengthRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const { addToast } = useToast();

  const startRecording = useCallback(() => {
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
  }, []);

  const stopRecording = () => {
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


  const handleRecordClick = useCallback(() => {
    setIsTyping(false);
    if (!mediaRecorder) {
      setIconAudio('material-symbols:pause-circle-outline');
      setIsRecording(true);
      startRecording();
    } else {
      setIconAudio('ic:outline-mic');
      setIsRecording(false);
      stopRecording();
    }
  }, [mediaRecorder, startRecording, stopRecording]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMessage(value);
    setIsTyping(!!value.trim());
  }, []);

  const sendMessage = useCallback(() => {
    if (message) {
      if (currentConversation?.id) {
        onSendMessage(message);
        if (sendMessageOptions?.onBeforeSend) {
          sendMessageOptions.onBeforeSend(message);
        }
      } else {
        onSendCompose(message);
      }
      setIsTyping(false);
      setMessage('');
    }
  }, [message, onSendMessage]);

  const sendAudio = useCallback(() => {    
    if (audioChunks.length > 0) {
      onSendAudio(new Blob(audioChunks, { type: 'audio/wav' }));
      if (sendMessageOptions?.onAfterSend) {
        sendMessageOptions.onAfterSend();
      }  
      setAudioChunks([]);
      setMediaRecorder(null);
    }
  }, [audioChunks, onSendAudio]);
  const sendImage = useCallback((image: File) => {    
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string; 
        onSendImage(imageUrl);
        if (sendMessageOptions?.onAfterSend) {
          sendMessageOptions.onAfterSend();
        }
      };
      reader.readAsDataURL(image);
    }
  }, [onSendImage]);

  const deleteAudio = useCallback(() => {
    setMediaRecorder(null);
    setAudioChunks([]);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          event.preventDefault();
          const cursorPosition = inputRef.current?.selectionStart || 0;
          const newValue = message.slice(0, cursorPosition) + '\n' + message.slice(cursorPosition);
          setMessage(newValue);
          setTimeout(() => {
            inputRef.current?.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
          }, 0);
        } else {
          event.preventDefault();
          handleSend();
        }
      }
    },
    [message, sendMessage]
  );
  const handleSend = useCallback(() => {
    const messageToSend = sendMessageOptions?.trimMessage ? message.trim() : message;
    
    if (!messageToSend) return;
    
    // Validación personalizada
    if (sendMessageOptions?.validateSend && !sendMessageOptions?.validateSend(messageToSend)) {
      return;
    }

    // Callback antes de enviar
    if (sendMessageOptions?.onBeforeSend) {
      sendMessageOptions.onBeforeSend(messageToSend);
    }

    // Enviar mensaje
    onSendMessage(messageToSend);

    // Callback después de enviar
    if (sendMessageOptions?.onAfterSend) {
      sendMessageOptions.onAfterSend();
    }

    setIsTyping(false);
    setMessage('');
  }, [message, onSendMessage, sendMessageOptions]);

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

        canvasCtx.fillStyle = '#0059d5';
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
  return {
    message,
    setMessage,
    mediaRecorder,
    audioChunks,
    iconAudio,
    isRecording,
    isTyping,
    inputRef,
    handleChange,
    handleKeyDown,
    handleRecordClick,
    sendMessage,
    sendAudio,
    deleteAudio,
    startRecording,
    stopRecording,
    draw,
    canvasRef,
    setIsTyping,
    handleSend,
    setCurrentConversation,
    sendImage
  };
};
