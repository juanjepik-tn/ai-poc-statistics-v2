import React, { useState } from 'react';
import { Box, Button, Modal, Text, useToast } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { ActionRule } from '../types/actionRule';

interface DeleteScenarioModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  actionRule: ActionRule | null;
}

const DeleteScenarioModal: React.FC<DeleteScenarioModalProps> = ({
  open,
  onClose,
  onConfirm,
  actionRule,
}) => {
  const { t } = useTranslation('translations');
  const { addToast } = useToast();
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!actionRule?.id) return;

    setDeleting(true);
    try {
      await onConfirm(actionRule.id);
      onClose();
    } catch (error) {
      console.error('Error deleting action rule:', error);
      addToast({
        type: 'danger',
        text: t('humanSupport.deleteModal.error'),
        duration: 4000,
        id: 'error-delete-scenario',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      onClose();
    }
  };

  return (
    <Modal open={open} onDismiss={handleClose}>
      <Modal.Header title={t('humanSupport.deleteModal.title')} />
      <Modal.Body padding="none">
        <Box padding="4">
          <Text>
            {t('humanSupport.deleteModal.description', { name: actionRule?.name || '' })}
          </Text>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="neutral" onClick={handleClose} disabled={deleting}>
          {t('common.cancel')}
        </Button>
        <Button appearance="danger" onClick={handleConfirm} disabled={deleting}>
          {deleting ? t('common.deleting') : t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteScenarioModal;
