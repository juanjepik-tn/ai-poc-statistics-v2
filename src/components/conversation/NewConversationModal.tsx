import { useState, useEffect } from 'react';
import { Box, Button, Input, Modal, Text, Spinner, useToast } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import TemplateMessagePicker from './TemplateMessagePicker';
import { useDirectSendMode } from './providers/DirectSendModeProvider';

export interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onConversationCreated: () => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  open,
  onClose,
  onConversationCreated,
}) => {
  const { t } = useTranslation('translations');
  const { addToast } = useToast();
  const { request } = useFetch();
  const { isDirectSendMode } = useDirectSendMode();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [directMessage, setDirectMessage] = useState('');
  const [sendMode, setSendMode] = useState<'direct' | 'template'>('direct');
  const [sending, setSending] = useState(false);
  const [channelId, setChannelId] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    request<any>({ url: API_ENDPOINTS.channel.list, method: 'GET' })
      .then(({ content }) => {
        const waChannel = (content ?? []).find(
          (ch: any) => ch.channelType === 'whatsapp' && ch.state?.name === 'Active'
        );
        setChannelId(waChannel?.id ?? '');
      })
      .catch(() => setChannelId(''));
  }, [open, request]);

  useEffect(() => {
    setSendMode(isDirectSendMode ? 'direct' : 'template');
  }, [isDirectSendMode]);

  const handleClose = () => {
    setStep(1);
    setPhone('');
    setDirectMessage('');
    setSending(false);
    onClose();
  };

  const handleSendTemplate = async (templateId: string, templateName: string) => {
    const phoneTrimmed = phone.trim();
    if (!phoneTrimmed) return;
    const phoneFormatted = phoneTrimmed.startsWith('+') ? phoneTrimmed : `+55${phoneTrimmed.replace(/\D/g, '')}`;

    setSending(true);
    try {
      await request({
        url: API_ENDPOINTS.conversation.createNew,
        method: 'POST',
        data: {
          phone: phoneFormatted,
          channelId,
          templateId,
          templateName,
        },
      });
      onConversationCreated();
      handleClose();
    } catch {
      setSending(false);
      addToast({
        type: 'danger',
        text: t('newConversation.error', 'Erro ao criar a conversa'),
        duration: 4000,
        id: 'new-conversation-error',
      });
    }
  };

  const handleSendDirect = () => {
    if (!directMessage.trim()) return;
    setSending(true);
    setTimeout(() => {
      addToast({
        type: 'success',
        text: 'Mensagem enviada via Direct Send (mock)',
        duration: 4000,
        id: 'direct-send-success',
      });
      onConversationCreated();
      handleClose();
    }, 800);
  };

  const handleStep1Next = () => {
    if (phone.trim()) setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <Modal open={open} onDismiss={handleClose}>
      <Modal.Header
        title={
          step === 1
            ? t('newConversation.step1Title', 'Nova conversa')
            : sendMode === 'direct'
              ? 'Direct Send (utility)'
              : t('newConversation.step2Title', 'Selecionar template')
        }
      />
      <Modal.Body padding="none">
        <Box padding="4" display="flex" flexDirection="column" gap="4">
          {step === 1 ? (
            <>
              <Text color="neutral-textLow">
                {t('newConversation.step1Description', 'Insira o número de telefone do cliente com código do país.')}
              </Text>
              <Box display="flex" alignItems="center" gap="2">
                <Box
                  padding="2"
                  backgroundColor="neutral-surfaceDisabled"
                  borderRadius="2"
                  minWidth="60px"
                  textAlign="center"
                >
                  <Text fontSize="base">+55</Text>
                </Box>
                <Box flex="1">
                  <Input
                    placeholder={t('newConversation.phonePlaceholder', '11 98765-4321')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1Next()}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box display="flex" alignItems="center" gap="2" paddingBottom="2">
                <Text fontWeight="medium">
                  {t('newConversation.phoneLabel', 'Telefone:')}
                </Text>
                <Text color="neutral-textLow">
                  {phone.startsWith('+') ? phone : `+55 ${phone}`}
                </Text>
              </Box>

              {isDirectSendMode && (
                <Box display="flex" gap="2" paddingBottom="2">
                  <button
                    onClick={() => setSendMode('direct')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: sendMode === 'direct' ? '2px solid #0059d5' : '1px solid #d1d1d1',
                      backgroundColor: sendMode === 'direct' ? '#eef5ff' : '#fff',
                      cursor: 'pointer',
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 13,
                      fontWeight: sendMode === 'direct' ? 600 : 400,
                      color: sendMode === 'direct' ? '#0059d5' : '#404040',
                      transition: 'all 0.15s',
                    }}
                  >
                    Direct Send (utility)
                  </button>
                  <button
                    onClick={() => setSendMode('template')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: sendMode === 'template' ? '2px solid #0059d5' : '1px solid #d1d1d1',
                      backgroundColor: sendMode === 'template' ? '#eef5ff' : '#fff',
                      cursor: 'pointer',
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 13,
                      fontWeight: sendMode === 'template' ? 600 : 400,
                      color: sendMode === 'template' ? '#0059d5' : '#404040',
                      transition: 'all 0.15s',
                    }}
                  >
                    Template
                  </button>
                </Box>
              )}

              {sendMode === 'direct' && isDirectSendMode ? (
                <Box display="flex" flexDirection="column" gap="3">
                  <Box
                    padding="2"
                    borderRadius="2"
                    backgroundColor="primary-surface"
                  >
                    <Text fontSize="caption" color="primary-textLow">
                      A mensagem será enviada como Direct Send (utility). Meta gera o template automaticamente.
                    </Text>
                  </Box>
                  <textarea
                    value={directMessage}
                    onChange={(e) => setDirectMessage(e.target.value)}
                    placeholder="Escreva sua mensagem..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #d1d1d1',
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 14,
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0059d5')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d1d1')}
                  />
                </Box>
              ) : (
                <>
                  {channelId ? (
                    <TemplateMessagePicker
                      channelId={channelId}
                      onSendTemplate={handleSendTemplate}
                      onClose={undefined}
                    />
                  ) : (
                    <Box padding="4">
                      <Text color="neutral-textLow" textAlign="center">
                        {t('newConversation.noChannel', 'Nenhum canal de WhatsApp conectado')}
                      </Text>
                    </Box>
                  )}
                </>
              )}

              {sending && (
                <Box display="flex" justifyContent="center" padding="4">
                  <Spinner size="small" />
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal.Body>
      <Modal.Footer>
        {step === 1 ? (
          <>
            <Button appearance="neutral" onClick={handleClose}>
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              appearance="primary"
              onClick={handleStep1Next}
              disabled={!phone.trim()}
            >
              {t('common.continue', 'Continuar')}
            </Button>
          </>
        ) : (
          <Box display="flex" gap="2" width="100%" justifyContent="space-between">
            <Button appearance="neutral" onClick={handleBack}>
              {t('common.back', 'Voltar')}
            </Button>
            {sendMode === 'direct' && isDirectSendMode && (
              <Button
                appearance="primary"
                onClick={handleSendDirect}
                disabled={!directMessage.trim() || sending}
              >
                Enviar Direct Send
              </Button>
            )}
          </Box>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NewConversationModal;
