import { useState, useEffect } from 'react';
import { Box, Button, Input, Modal, Text, Spinner, useToast } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import TemplateMessagePicker from './TemplateMessagePicker';

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
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
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

  const handleClose = () => {
    setStep(1);
    setPhone('');
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
          <Button appearance="neutral" onClick={handleBack}>
            {t('common.back', 'Voltar')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NewConversationModal;
