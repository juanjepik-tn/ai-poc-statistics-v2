import { Box, Button, Modal, Text } from '@nimbus-ds/components';
import { Trans, useTranslation } from 'react-i18next';

type ConfirmDeleteModalProps = {
  open: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  channelName?: string;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onDismiss,
  onConfirm,
  channelName,
}) => {
  const { t } = useTranslation('translations');
  const isWhatsAppBusiness = channelName === 'WhatsAppBusiness';

  return (
    <Modal
      maxWidth={{ xs: '100%', md: '311px' }}
      open={open}
      onDismiss={onDismiss}
      padding="base"
    >
      <Modal.Header title={t('instances.remove-alert.title')} />
      <Modal.Body padding="none">
        {!isWhatsAppBusiness ? (
          <Text fontSize="base" fontWeight="regular" textAlign="left">
            {t('instances.remove-alert.description')}
          </Text>
        ) : (
          <Text fontSize="base" fontWeight="regular" textAlign="left">
            <Box>
              <Text fontSize="base" fontWeight="regular" textAlign="left">
                {t('instances.remove-alert.steps.description')}
              </Text>
            </Box>
            <Box marginLeft="4">
              <ol>
                <li>{t('instances.remove-alert.steps.step1')}</li>
                <li>
                  <Trans
                    i18nKey="instances.remove-alert.steps.step2"
                    components={{ bold: <strong /> }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="instances.remove-alert.steps.step3"
                    components={{ bold: <strong /> }}
                  />
                </li>
              </ol>
            </Box>
          </Text>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onDismiss}>
          {t('instances.remove-alert.cancel')}
        </Button>
        <Button appearance="danger" onClick={onConfirm}>
          {t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
