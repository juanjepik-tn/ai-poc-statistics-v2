import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { Box, Grow, Popover } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import {
  Box as BoxNimbus,
  Icon,
  IconButton as IconButtonNimbus,
  Link,
  Spinner,
  Text,
  useToast
} from '@nimbus-ds/components';
import {
  CheckCircleIcon,
  CloseIcon,
  MagicWandIcon,
  PlusIcon,
  RedoIcon,
  StopIcon,
  TrashIcon
} from '@nimbus-ds/icons';
import { AudioPlayer } from 'react-audio-play';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../iconify/iconify';
import MicIcon from '../MicButton/MicButton';
import { useModeCustomer } from './providers/ModeCustomerDataProvider';
import { ModeContext } from './providers/ModeDataProvider';
import { BillingDTO } from '@/types/billingDTO';
import { IQuickReply } from '@/types/conversation';
import QuickReplyList from './QuickReplyList';
import TemplateMessagePicker from './TemplateMessagePicker';
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
  onSendFile?: (file: File) => void;
  onSendTemplate?: (templateId: string, templateName: string) => void;
};

// Check if 24h window has expired since last customer message
function is24hExpired(conversation: any): boolean {
  if (!conversation?.messagesPanel?.length) return false;
  // Find the last customer message
  const customerMessages = conversation.messagesPanel.filter(
    (m: any) => m.role === 'customer' || m.role === 'user'
  );
  if (customerMessages.length === 0) return true; // No customer messages = can't send
  const lastCustomerMsg = customerMessages[customerMessages.length - 1];
  const lastTimestamp = new Date(lastCustomerMsg.created_at).getTime();
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return (now - lastTimestamp) > twentyFourHours;
}

export default function ConversationMessageInput({
  recipients,
  onSendCompose,
  onSendMessage,
  onSendAudio,
  currentConversation,
  isLoadingInitialMessages,
  lastMessage,
  newTag,
  onSendImage,
  onSendFile,
  onSendTemplate,
}: Props) {

  const [width] = useState<number>(window.innerWidth);
  const { t } = useTranslation('translations');

  const isMobile = width <= 768;

  const { request } = useFetch();
  const { addToast } = useToast();
  const [suggestResponse, setSuggestResponse] = useState<string>('');
  const [selectedSuggestResponse, setSelectedSuggestResponse] =
    useState<string>('');
  const [, setShowOperationMode] = useState<boolean>(true);
  const [generatingResponse, setGeneratingResponse] = useState<Boolean>(false);
  const [idConversationResponse, setIdConversationResponse] = useState<String>('');  
  const notification = useSelector((state: any) => state.notification);
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);

  // Feature 2: 24h check
  const expired24h = is24hExpired(currentConversation);
  const isWhatsApp = currentConversation?.channel?.channelType === 'whatsapp';
  const show24hBlock = expired24h && isWhatsApp;

  // Feature 4: Emoji/Sticker picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Feature 6: File attachment menu
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Feature 9: Quick replies
  const [quickReplies, setQuickReplies] = useState<IQuickReply[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [quickReplyQuery, setQuickReplyQuery] = useState('');

  // Load quick replies
  useEffect(() => {
    request<any>({
      url: API_ENDPOINTS.quickReplies.list,
      method: 'GET',
    })
      .then(({ content }: any) => {
        const replies = Array.isArray(content) ? content : [];
        setQuickReplies(replies);
      })
      .catch(() => {}); // Silent fail for quick replies
  }, []);

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
    handleChange: originalHandleChange,
    handleKeyDown,
    setCurrentConversation,
    sendImage,
    handleSend,
    isRecording,
  } = useMessageInput({
    onSendMessage, onSendCompose, onSendAudio, onSendImage, sendMessageOptions: {
      trimMessage: true,
      validateSend: (_message) => !!currentConversation.id,
      onBeforeSend: (msg) => {
        if (selectedSuggestResponse) {
          const similarity = similarityPercentage(msg, selectedSuggestResponse);
          if (similarity > 70) {
            trackingMessageSent(currentConversation.id);
          }
        }
      },
      onAfterSend: () => {
        if (isCustomerActive()) {
          setUserToTemporaryManualMode();
        }
      }
    }
  });

  // Wrap handleChange to detect "/" for quick replies (Feature 9)
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleChange(event);
    const value = event.target.value;
    if (value.startsWith('/')) {
      setShowQuickReplies(true);
      setQuickReplyQuery(value.substring(1));
    } else {
      setShowQuickReplies(false);
      setQuickReplyQuery('');
    }
  }, [originalHandleChange]);

  const handleQuickReplySelect = useCallback((content: string) => {
    setMessage(content);
    setShowQuickReplies(false);
    setQuickReplyQuery('');
    inputRef.current?.focus();
  }, [setMessage, inputRef]);

  useEffect(() => {
    setCurrentConversation(currentConversation);
  }, [currentConversation]);
  const { id } = currentConversation;
  const { selectedMode, isActive } = useContext(ModeContext);
  const {
    selectedModeCustomer,
    setSelectedModeCustomer,
    modeOptions,
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
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  const dispatch = useDispatch();
  const [canGenerateSuggest, setCanGenerateSuggest] = useState<boolean>(false);

  const onEmojiClick = (event: any) => {
    setMessage((prevInput) => prevInput + event.native);
    setShowEmojiPicker(false);
  };

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

  const similarityPercentage = (a: string, b: string): number => {
    const distance = levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    return ((maxLength - distance) / maxLength) * 100;
  };

  useEffect(() => {
    if (notification.operationMode.conversation_id) {
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

  // Feature 6: File upload handler
  const handleFileUpload = useCallback((acceptTypes: string) => {
    setShowAttachMenu(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptTypes;
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.type.startsWith('image/')) {
        sendImage(file);
      } else if (onSendFile) {
        onSendFile(file);
      }
    };
    input.click();
  }, [sendImage, onSendFile]);

  // Feature 2: 24h expired — locked state
  // conv '16' = com templates (evolução), conv '17' = sem templates (texto definitivo)
  const hasTemplateSupport = currentConversation?.id === '16';
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  if (show24hBlock) {
    return (
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e7e7e7',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          p: '16px',
        }}
      >
        {/* Alert */}
        <Box
          sx={{
            backgroundColor: '#f6f6f6',
            border: '1px solid #d1d1d1',
            borderRadius: '8px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
            p: '16px',
            overflow: 'hidden',
          }}
        >
          <Iconify
            icon="mdi:information-outline"
            width={16}
            color="#6d6d6d"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
            <span style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              lineHeight: '20px',
              color: '#0a0a0a',
            }}>
              {t('conversations.24h-title', {
                defaultValue: 'Não é possível enviar mensagens',
              })}
            </span>
            <span style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#5d5d5d',
            }}>
              {hasTemplateSupport
                ? t('conversations.24h-description-template', {
                    defaultValue: 'Respostas são permitidas até 24h após a última mensagem recebida do cliente. Envie um template de mensagem para retomar a conversa.',
                  })
                : t('conversations.24h-description', {
                    defaultValue: 'Respostas são permitidas até 24h após a última mensagem recebida do cliente. Aguarde uma nova mensagem ou envie pelo aplicativo do WhatsApp Business.',
                  })
              }
            </span>
          </Box>
        </Box>

        {/* Template picker (when supported) */}
        {hasTemplateSupport && (
          <>
            {showTemplatePicker ? (
              <Box
                sx={{
                  border: '1px solid #d1d1d1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Picker header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: '16px',
                    py: '10px',
                    borderBottom: '1px solid #e7e7e7',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Iconify icon="mdi:file-document-multiple-outline" width={18} color="#0059d5" />
                    <span style={{
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#0a0a0a',
                    }}>
                      {t('conversations.24h-template-picker-title', {
                        defaultValue: 'Templates de mensagem',
                      })}
                    </span>
                  </Box>
                  <IconButton
                    onClick={() => setShowTemplatePicker(false)}
                    sx={{
                      p: '4px',
                      borderRadius: '6px',
                      '&:hover': { backgroundColor: '#f0f0f0' },
                    }}
                  >
                    <Icon source={<CloseIcon size={16} />} color="neutral-textLow" />
                  </IconButton>
                </Box>
                <TemplateMessagePicker
                  channelId={currentConversation?.channel?.id ?? ''}
                  conversationId={currentConversation?.id}
                  onSendTemplate={(templateId, templateName) => {
                    onSendTemplate?.(templateId, templateName);
                    setShowTemplatePicker(false);
                  }}
                  onClose={() => setShowTemplatePicker(false)}
                />
              </Box>
            ) : (
              <Box
                onClick={() => setShowTemplatePicker(true)}
                sx={{
                  backgroundColor: '#0059d5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  py: '10px',
                  px: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { backgroundColor: '#004bb3', transform: 'translateY(-1px)' },
                  '&:active': { transform: 'translateY(0)' },
                }}
              >
                <Iconify icon="mdi:file-document-multiple-outline" width={18} color="#ffffff" />
                <span style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#ffffff',
                }}>
                  {t('conversations.24h-send-template', {
                    defaultValue: 'Enviar template de mensagem',
                  })}
                </span>
              </Box>
            )}
          </>
        )}

        {/* Disabled chat input */}
        <Box
          sx={{
            backgroundColor: '#e7e7e7',
            border: '1px solid #d1d1d1',
            borderRadius: '8px',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ px: '12px', pt: '10px', pb: '4px' }}>
            <span style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#6d6d6d',
            }}>
              {t('conversations.24h-input-placeholder', {
                defaultValue: 'Escreva uma mensagem',
              })}
            </span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              px: '4px',
              pb: '4px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton disabled sx={{ p: '8px' }}>
                <Icon source={<PlusIcon size={16} />} color="neutral-textDisabled" />
              </IconButton>
              <IconButton disabled sx={{ p: '8px' }}>
                <Iconify icon="ic:outline-emoji-emotions" width={18} color="#b5b5b5" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconButton disabled sx={{ p: '8px' }}>
                <MicIcon />
              </IconButton>
              <IconButton
                disabled
                sx={{
                  backgroundColor: '#d1d1d1',
                  borderRadius: '8px',
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  p: 0,
                  '&.Mui-disabled': {
                    backgroundColor: '#d1d1d1',
                  },
                }}
              >
                <Iconify width={16} icon="mdi:arrow-up" color="#8c8c8c" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

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

          {/* Chat Input Container */}
          <div ref={inputContainerRef} style={{ position: 'relative' }}>
            {/* Quick Reply List (Feature 9) */}
            <QuickReplyList
              query={quickReplyQuery}
              replies={quickReplies}
              onSelect={handleQuickReplySelect}
              onClose={() => { setShowQuickReplies(false); setQuickReplyQuery(''); }}
              visible={showQuickReplies}
            />

            <Box
              sx={{
                backgroundColor: 'white',
                border: '1px solid #b0b0b0',
                borderRadius: '8px',
                mx: 1,
                mb: 1,
              }}
            >
              {/* Input field */}
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

              {/* Actions bar */}
              <BoxNimbus 
                display="flex" 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="space-between"
                paddingX="2"
                paddingBottom="2"
              >
                {/* Left side actions */}
                <BoxNimbus display="flex" alignItems="center" gap="1">
                  {/* Attachment menu (Feature 6) */}
                  <div>
                    <IconButton
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (!billingData?.activeStatus) return;
                        setShowAttachMenu(!showAttachMenu);
                      }}
                      disabled={!billingData?.activeStatus}
                      sx={{ p: 1 }}
                    >
                      <Icon source={<PlusIcon size={16} />} color="neutral-textHigh" />
                    </IconButton>
                    <Popover
                      open={showAttachMenu}
                      anchorEl={inputContainerRef.current}
                      onClose={() => setShowAttachMenu(false)}
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      slotProps={{
                        paper: {
                          sx: {
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                            border: '1px solid #e0e0e0',
                            minWidth: 180,
                            py: 0.5,
                            mb: 0.5,
                          },
                        },
                      }}
                    >
                      <div
                        onClick={() => handleFileUpload('image/jpeg,image/png,image/gif,image/webp')}
                        style={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontFamily: "'Geist', sans-serif",
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Iconify icon="ic:baseline-photo" width={18} />
                        {t('conversations.attach-image', { defaultValue: 'Imagem' })}
                      </div>
                      <div
                        onClick={() => handleFileUpload('.pdf,.xlsx,.xls,.doc,.docx,.csv,.txt,.zip')}
                        style={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontFamily: "'Geist', sans-serif",
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Iconify icon="ic:baseline-insert-drive-file" width={18} />
                        {t('conversations.attach-document', { defaultValue: 'Documento' })}
                      </div>
                    </Popover>
                  </div>

                  {/* Emoji button (Feature 4) */}
                  <IconButton
                    onClick={() => {
                      if (!billingData?.activeStatus) return;
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    disabled={!billingData?.activeStatus}
                    sx={{ p: 1 }}
                  >
                    <Iconify icon="ic:outline-emoji-emotions" width={18} color="#404040" />
                  </IconButton>

                  {/* Mic button */}
                  <IconButton
                    onClick={handleRecordClick}
                    disabled={!billingData?.activeStatus}
                    sx={{ p: 1 }}
                  >
                    <MicIcon />
                  </IconButton>
                </BoxNimbus>

                {/* Right side actions */}
                <BoxNimbus display="flex" alignItems="center" gap="2">
                  {/* AI suggest button */}
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

                  {/* Send button */}
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
          </div>

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
