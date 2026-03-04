import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Radio, Text, Textarea, Input } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { ActionRule, ActionRuleFormData } from '../types/actionRule';

interface TransferScenarioModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ActionRuleFormData) => Promise<void>;
  editingRule?: ActionRule | null;
}

const TransferScenarioModal: React.FC<TransferScenarioModalProps> = ({
  open,
  onClose,
  onSave,
  editingRule,
}) => {
  const { t } = useTranslation('translations');

  const [name, setName] = useState<string>('');
  const [trigger, setTrigger] = useState<string>('');
  const [askBeforeTransfer, setAskBeforeTransfer] = useState<boolean>(false);
  const [instruction, setInstruction] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  // Initialize form when modal opens or editing rule changes
  useEffect(() => {
    if (editingRule) {
      setName(editingRule.name);
      setTrigger(editingRule.trigger);
      setAskBeforeTransfer(editingRule.action === 'collect');
      setInstruction(editingRule.instruction || '');
    } else {
      // Reset form for new rule
      setName('');
      setTrigger('');
      setAskBeforeTransfer(false);
      setInstruction('');
    }
  }, [editingRule, open]);

  const isValid = name.trim() !== '' && trigger.trim() !== '' && 
    (!askBeforeTransfer || instruction.trim() !== '');

  const handleSave = async () => {
    if (!isValid) return;

    setSaving(true);
    try {
      const formData: ActionRuleFormData = {
        name: name.trim(),
        trigger: trigger.trim(),
        action: askBeforeTransfer ? 'collect' : 'transfer',
        state: editingRule?.state || 'enabled',
        instruction: askBeforeTransfer ? instruction.trim() : null,
      };
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving action rule:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '20px',
    fontWeight: 500,
    color: '#5d5d5d',
  };

  return (
    <Modal open={open} onDismiss={handleClose}>
      <Modal.Header title={t('humanSupport.modal.title')} />
      <Modal.Body padding="none">
        <Box padding="4" display="flex" flexDirection="column" gap="6">
          <Text
            fontSize="base"
            color="neutral-textDisabled"
          >
            {t('humanSupport.modal.subtitle')}
          </Text>

          <Box display="flex" flexDirection="column" gap="4">
            <Box display="flex" flexDirection="column" gap="2">
              <Text style={labelStyle}>
                {t('humanSupport.modal.nameLabel')}
              </Text>
              <Input
                placeholder={t('humanSupport.modal.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap="2">
              <Text style={labelStyle}>
                {t('humanSupport.modal.triggerLabel')}
              </Text>
              <Textarea
                id="trigger"
                placeholder={t('humanSupport.modal.triggerPlaceholder')}
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                rows={3}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap="2">
              <Text style={labelStyle}>
                {t('humanSupport.modal.askBeforeLabel')}
              </Text>
              <Box display="flex" gap="2">
                <Radio
                  name="askBeforeTransfer"
                  label={t('common.no')}
                  checked={!askBeforeTransfer}
                  onChange={() => setAskBeforeTransfer(false)}
                />
                <Radio
                  name="askBeforeTransfer"
                  label={t('common.yes')}
                  checked={askBeforeTransfer}
                  onChange={() => setAskBeforeTransfer(true)}
                />
              </Box>
            </Box>

            {askBeforeTransfer && (
              <Textarea
                id="instruction"
                placeholder={t('humanSupport.modal.instructionPlaceholder')}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={2}
              />
            )}
          </Box>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="neutral" onClick={handleClose} disabled={saving}>
          {t('common.cancel')}
        </Button>
        <Button appearance="primary" onClick={handleSave} disabled={!isValid || saving}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferScenarioModal;
