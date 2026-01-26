import { useCallback, useContext, useEffect, useState } from 'react';
// @mui
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import { useMessageInput } from '@/hooks/useMessageInput/useMessageInput';
import { setNotificationOperationMode } from '@/redux/slices/notification';
import {
  trackingCopilotRequested,
  trackingCopilotUsed,
  trackingMessageSent,
} from '@/tracking';
import data from '@emoji-mart/data';
import i18n from '@emoji-mart/data/i18n/es.json';
import Picker from '@emoji-mart/react';
import { Box, Grow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import {
  Box as BoxNimbus,
  Icon,
  IconButton as IconButtonNimbus,
  Link,
  Popover,
  Spinner,
  Text,
  useToast
} from '@nimbus-ds/components';
import {
  CameraIcon,
  CheckCircleIcon,
  CloseIcon,
  MagicWandIcon,
  PlusIcon,
  RedoIcon,
  StopIcon,
  TrashIcon
} from '@nimbus-ds/icons';
import { InteractiveList } from '@nimbus-ds/patterns';
import { AudioPlayer } from 'react-audio-play';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../iconify/iconify';
import MicIcon from '../MicButton/MicButton';
import { useModeCustomer } from './providers/ModeCustomerDataProvider';
import { ModeContext } from './providers/ModeDataProvider';
import { BillingDTO } from '@/types/billingDTO';
import './styles.css';
type Props = {
  recipients: any;
  onSendCompose: any;
  onSendMessage: any;
  currentConversation: any;
  onShowImagePreview: any;
  onSendAudio: any;
  isLoadingInitialMessages: boolean;
  lastMessage: any;
  markAsResolved?: boolean;
  newTag?: any;
  onSendImage: any;
};

export default function ConversationMessageInput({
  recipients,
  onSendCompose,
  onSendMessage,
  onSendAudio,
  currentConversation,
  isLoadingInitialMessages,
  lastMessage,
  newTag,
  onSendImage
}: Props) {

  // const [setImgUrl] = useState<string | null>(null);
  const [width] = useState<number>(window.innerWidth);
  // const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const { t } = useTranslation('translations');

  const isMobile = width <= 768;

  // const [selectedMode, setSelectedMode] = useState('');
  const { request } = useFetch();
  const { addToast } = useToast();
  const [suggestResponse, setSuggestResponse] = useState<string>('');
  const [selectedSuggestResponse, setSelectedSuggestResponse] =
    useState<string>('');
  const [showOperationMode, setShowOperationMode] = useState<boolean>(true);
  const [generatingResponse, setGeneratingResponse] = useState<Boolean>(false);
  const [idConversationResponse, setIdConversationResponse] = useState<String>('');  
  const notification = useSelector((state: any) => state.notification);
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);

  const {
    mediaRecorder,
    audioChunks,
    handleRecordClick,
    sendAudio,
    deleteAudio,
    canvasRef,
    inputRef,
    message,
    setMessage,
    handleChange,
    handleKeyDown,
    setCurrentConversation,
    sendImage,
    handleSend,
    isRecording,
  } = useMessageInput({
    onSendMessage, onSendCompose, onSendAudio, onSendImage, sendMessageOptions: {
      trimMessage: true,
      validateSend: (_message) => !!currentConversation.id,
      onBeforeSend: (message) => {
        if (selectedSuggestResponse) {
          const similarity = similarityPercentage(message, selectedSuggestResponse);
          if (similarity > 70) {
            trackingMessageSent(currentConversation.id);
          }
        }
      },
      onAfterSend: () => {
        console.log('onAfterSend', isCustomerActive());
        if (isCustomerActive()) {
          setUserToTemporaryManualMode();
        }
      }
    }
  });
  useEffect(() => {
    setCurrentConversation(currentConversation);
  }, [currentConversation]);
  const { id } = currentConversation;
  const { selectedMode, isActive } = useContext(ModeContext);
  const {
    selectedModeCustomer,
    setSelectedModeCustomer,
    modeOptions,
    handleCustomerRadioChange,
    isCustomerActive,
    setUserToTemporaryManualMode,
  } = useModeCustomer();

  const handleSuggestClick = (ev: any) => {
    ev.stopPropagation();
    setMessage(suggestResponse.toString());
    setSelectedSuggestResponse(suggestResponse.toString());
    trackingCopilotUsed(currentConversation.id);
    setSuggestResponse('');
  };

  useEffect(() => {
    setShowOperationMode(selectedMode.number !== 3);
  }, [selectedMode]);

  const generateSuggestResponse = useCallback(() => {
    const currentId = currentConversation.id;
    request<any[]>({
      url: API_ENDPOINTS.conversation.suggestResponse(currentId),
      method: 'GET',
    })
      .then(({ content }: any) => {
        if (currentId === content.id) {
          setGeneratingResponse(false);
          setIdConversationResponse(content.id);
          setSuggestResponse(content.message);
        }
      })
      .catch((error) => {
        setGeneratingResponse(false);
        addToast({
          type: 'danger',
          text: t(`conversations.${error.message}`),
          duration: 4000,
          id: 'error-suggest-message',
        });
      });
  }, [currentConversation.id]);


  useEffect(() => {
    // solo se hace para desktop
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  // const fileRef = useRef<HTMLInputElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const [canGenerateSuggest, setCanGenerateSuggest] = useState<boolean>(false);

  const onEmojiClick = (event: any) => {
    setMessage((prevInput) => prevInput + event.native);
    setShowEmojiPicker(false);
  };

  // const handleAttach = useCallback(() => {
  //   if (fileRef.current) {
  //     fileRef.current.click();
  //   }
  // }, []);


  const handleRedoSuggestion = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    setGeneratingResponse(true);
    generateSuggestResponse();
  };
  const handleDismissSuggestion = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    setSuggestResponse('');
    setIdConversationResponse('');
  };

  const levenshteinDistance = (a: string, b: string): number => {
    const matrix = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0),
    );

    for (let i = 0; i <= a.length; i++) {
      for (let j = 0; j <= b.length; j++) {
        if (i === 0) {
          matrix[i][j] = j;
        } else if (j === 0) {
          matrix[i][j] = i;
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
          );
        }
      }
    }

    return matrix[a.length][b.length];
  };

  // Función para calcular el porcentaje de similitud
  const similarityPercentage = (a: string, b: string): number => {
    const distance = levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    return ((maxLength - distance) / maxLength) * 100;
  };
  //TODO validar si se puede eliminar
  useEffect(() => {
    // if (notification.conversationUpdate?.conversation_id) {
    //const conversationUpdate = notification.conversationUpdate;
    /*if (conversationUpdate && (conversationUpdate.conversation_id == currentConversation.id) && [selectedModeCustomer.number, selectedMode.number].includes(2) && lastMessage?.role === 'user') {
      setGeneratingResponse(true);
      generateSuggestResponse();
    }*/
    // if (conversationUpdate && (conversationUpdate.conversation_id == currentConversation.id) && (selectedMode == 'Manual' || storeSelectedMode.number === 2) && lastMessage?.role === 'user') {
    //   setGeneratingResponse(true);
    //   generateSuggestResponse();
    // }
    // }
    if (notification.operationMode.conversation_id) {
      console.log('notification.operationMode', notification.operationMode);
      const operationMode = notification.operationMode;
      if (
        operationMode &&
        operationMode.conversation_id === currentConversation?.id
      ) {
        setUserToTemporaryManualMode();
      }
    }
    dispatch(setNotificationOperationMode(false));
  }, [notification, generateSuggestResponse]);
  useEffect(() => {
    setSuggestResponse('');
    setIdConversationResponse('');
  }, [
    selectedMode,
    currentConversation,
    isLoadingInitialMessages,
    lastMessage,
    selectedModeCustomer,
  ]);

  useEffect(() => {
    if (newTag?.customer) {
      setSelectedModeCustomer(
        modeOptions.find(
          (option: any) =>
            option.customerName === newTag?.customer?.state?.name,
        ),
      );
    }
  }, [newTag, currentConversation?.customer?.undoneTags]);
  useEffect(() => {
    setCanGenerateSuggest(
      !generatingResponse &&
      lastMessage?.role === 'user' &&
      !isLoadingInitialMessages &&
      (!isActive() || !isCustomerActive()),
    );
  }, [
    generatingResponse,
    lastMessage,
    selectedModeCustomer,
    isLoadingInitialMessages,
    selectedMode,
  ]);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-message-input.tsx:310',message:'Input render',data:{hasConversation:!!currentConversation,conversationId:currentConversation?.id,hasBillingData:!!billingData},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
  // #endregion

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
        <>
          {showEmojiPicker && (
            <BoxNimbus>
              <Picker
                previewPosition="none"
                perLine={isMobile ? 9 : 10}
                data={data}
                onEmojiSelect={onEmojiClick}
                i18n={i18n}
              />
            </BoxNimbus>
          )}
          {/* Chat Input Container - Figma style */}
          <Box
            sx={{
              backgroundColor: 'white',
              border: '1px solid #b0b0b0',
              borderRadius: '8px',
              overflow: 'hidden',
              mx: 1,
              mb: 1,
            }}
          >
            {/* Input field - top section */}
            <InputBase
              multiline
              minRows={1}
              maxRows={5}
              inputRef={inputRef}
              value={message}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              placeholder={t('settings.step4.write')}
              disabled={!billingData?.activeStatus || (recipients.length > 0 && !id && message.length > 0)}
              sx={{
                px: 1,
                py: 0.5,
                width: '100%',
                backgroundColor: 'transparent',
                fontFamily: "'Geist', sans-serif",
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontFamily: "'Geist', sans-serif",
                  padding: '4px',
                  backgroundColor: 'transparent',
                  '&::placeholder': {
                    color: '#6d6d6d',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Actions bar - bottom section */}
            <BoxNimbus 
              display="flex" 
              flexDirection="row" 
              alignItems="center" 
              justifyContent="space-between"
              paddingX="2"
              paddingBottom="2"
            >
              {/* Plus button on the left */}
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (!billingData?.activeStatus) {
                    return;
                  }
                  const input = document.getElementById('selectImage');
                  if (input) {
                    input.onchange = function (event: any) {
                      sendImage(event.target.files[0]);
                    };
                    input?.click();
                  }
                }}
                disabled={!billingData?.activeStatus}
                sx={{ p: 1 }}
              >
                <Icon source={<PlusIcon size={16} />} color="neutral-textHigh" />
              </IconButton>

              {/* Right side actions */}
              <BoxNimbus display="flex" alignItems="center" gap="2">
                {/* Magic wand / AI suggest button */}
                <IconButton
                  disabled={!canGenerateSuggest || !billingData?.activeStatus}
                  onClick={() => {
                    setGeneratingResponse(true);
                    generateSuggestResponse();
                    setSelectedSuggestResponse('');
                    trackingCopilotRequested(currentConversation.id);
                  }}
                  sx={{ p: 1 }}
                >
                  <Icon
                    source={<MagicWandIcon size={16} />}
                    color={canGenerateSuggest ? 'neutral-textHigh' : 'neutral-textDisabled'}
                  />
                </IconButton>

                {/* Send button - Figma style with gray background */}
                <IconButton
                  onClick={handleSend}
                  disabled={!message || !billingData?.activeStatus}
                  sx={{
                    backgroundColor: '#e7e7e7',
                    border: '1px solid #d1d1d1',
                    borderRadius: '8px',
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    p: 0,
                    '&:hover': {
                      backgroundColor: '#d1d1d1',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e7e7e7',
                      border: '1px solid #d1d1d1',
                    },
                  }}
                >
                  <Iconify
                    width={16}
                    icon="mdi:arrow-up"
                    color="#0a0a0a"
                  />
                </IconButton>
              </BoxNimbus>

            </BoxNimbus>

            <Box sx={{ display: 'none' }}>
              <input type="file" accept="*.*" required id="selectFile" />
              <input
                type="file"
                accept="image/jpeg, image/png"
                required
                id="selectImage"
              />
            </Box>
          </Box>

          {generatingResponse && suggestResponse === '' && (
              <BoxNimbus display="flex" alignItems="center" gap="1" mt="2">
                <img src="/imgs/ia-icon.svg" alt="WandIcon" />
                <Text fontSize="base" color="primary-interactive">
                  {t('conversations.ia-generating')}
                </Text>
                <Spinner size="small" />
              </BoxNimbus>
            )}
            {suggestResponse &&
              idConversationResponse === currentConversation.id && (
                <Grow in timeout={300}>
                  <BoxNimbus
                    display="flex"
                    borderRadius="4"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    backgroundColor="primary-surface"
                    flexDirection="column"
                    padding="4"
                  >
                    <BoxNimbus
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <BoxNimbus display="flex" alignItems="center" gap="1">
                        <img src="/imgs/ia-icon.svg" alt="WandIcon" />
                        <Text fontSize="caption" color="primary-textLow">
                          {t('conversations.ia-generated')}
                        </Text>
                      </BoxNimbus>
                      <BoxNimbus
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        gap="1"
                      >
                        <BoxNimbus
                          cursor="pointer"
                          gap="2"
                          display="flex"
                          flexDirection="row"
                          color="primary-interactive"
                        >
                          <CloseIcon
                            size="small"
                            onClick={handleDismissSuggestion}
                          />
                        </BoxNimbus>
                      </BoxNimbus>
                    </BoxNimbus>
                    <div
                      className="no-scroll"
                      style={{
                        maxHeight: '50px',
                        overflow: 'hidden',
                        overflowY: 'auto',
                      }}
                    >
                      <BoxNimbus
                        p="1"
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Text fontSize="base" color="primary-textLow">
                          {suggestResponse}
                        </Text>
                      </BoxNimbus>
                    </div>
                    <BoxNimbus
                      p="1"
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      color="primary-interactive"
                      textAlign="center"
                      gap="4"
                    >
                      <Link
                        appearance="primary"
                        textDecoration="none"
                        as="a"
                        onClick={handleRedoSuggestion}
                      >
                        {generatingResponse && <Spinner size="small" />}
                        {!generatingResponse && (
                          <Icon
                            color="primary-interactive"
                            source={<RedoIcon />}
                          />
                        )}
                        {t('conversations.ia-redo')}
                      </Link>
                      <Link
                        appearance="primary"
                        textDecoration="none"
                        as="a"
                        onClick={handleSuggestClick}
                      >
                        <Icon
                          color="primary-interactive"
                          source={<CheckCircleIcon />}
                        />
                        {t('conversations.ia-use')}
                      </Link>
                    </BoxNimbus>
                  </BoxNimbus>
                </Grow>
              )}
        </>
      )}

      {mediaRecorder && audioChunks.length === 0 && (
        <BoxNimbus display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" width="100%" height={isMobile ? 'auto' : '56px'}>

          <canvas ref={canvasRef} id="audioCanvas" width="auto" height="56px" />
          <InputBase
            endAdornment={
              <Stack direction="row" sx={{ flexShrink: 0 }}>            
                  <IconButtonNimbus onClick={handleRecordClick} source={isRecording ? <StopIcon /> : <MicIcon />} borderColor="transparent" />
              </Stack>
            }
            sx={{
              px: 1,
              height: 56,
              flexShrink: 0,
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          />
        </BoxNimbus>
      )}

      {audioChunks.length > 0 && (
        <BoxNimbus
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          marginBottom="2"
          marginTop="2"
          height="auto"
        >
          <IconButtonNimbus source={<TrashIcon />} onClick={deleteAudio} borderColor="transparent" backgroundColor="transparent" />

          <AudioPlayer
            preload="metadata"
            width="40%"
            style={{ height: 'auto' }}
            color="#002c53"
            sliderColor="#006bc8"
            src={URL.createObjectURL(new Blob(audioChunks))}
          />
          <IconButton onClick={sendAudio}>
            <Iconify
              width={25}
              icon="ic:baseline-send"
              color='primary-interactive'
            />
          </IconButton>
        </BoxNimbus>
      )}
    </>
  );
}
