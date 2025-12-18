import React, { useEffect, useState } from 'react';
import { Box, Button, Label, Modal, Radio, Text, Textarea, Input } from '@nimbus-ds/components';
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

  return (
    <Modal open={open} onDismiss={handleClose}>
      <Modal.Header title={t('humanSupport.modal.title')} />
      <Modal.Body padding="none">
        <Box padding="4" display="flex" flexDirection="column" gap="4">
          <Text color="neutral-textLow">
            {t('humanSupport.modal.subtitle')}
          </Text>

          {/* Scenario name */}
          <Box display="flex" flexDirection="column" gap="1">
            <Label>{t('humanSupport.modal.nameLabel')}</Label>
            <Input
              placeholder={t('humanSupport.modal.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          {/* Describe when the AI should transfer */}
          <Box display="flex" flexDirection="column" gap="1">
            <Label>{t('humanSupport.modal.triggerLabel')}</Label>
            <Textarea
              id="trigger"
              placeholder={t('humanSupport.modal.triggerPlaceholder')}
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              rows={3}
            />
          </Box>

          {/* Do you want the AI to ask something before transferring? */}
          <Box display="flex" flexDirection="column" gap="2">
            <Text fontWeight="bold">{t('humanSupport.modal.askBeforeLabel')}</Text>
            <Box display="flex" gap="4">
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family, "CentraNube", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                  fontSize: '14px',
                  color: '#0a0a0a',
                  gap: '8px'
                }}
              >
                <input
                  type="radio"
                  name="askBeforeTransfer"
                  value="no"
                  checked={!askBeforeTransfer}
                  onChange={() => setAskBeforeTransfer(false)}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    accentColor: '#0059d5',
                    cursor: 'pointer'
                  }}
                />
                {t('common.no')}
              </label>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family, "CentraNube", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                  fontSize: '14px',
                  color: '#0a0a0a',
                  gap: '8px'
                }}
              >
                <input
                  type="radio"
                  name="askBeforeTransfer"
                  value="yes"
                  checked={askBeforeTransfer}
                  onChange={() => setAskBeforeTransfer(true)}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    accentColor: '#0059d5',
                    cursor: 'pointer'
                  }}
                />
                {t('common.yes')}
              </label>
            </Box>
          </Box>

          {/* Instruction textarea - only shown when askBeforeTransfer is true */}
          {askBeforeTransfer && (
            <Box display="flex" flexDirection="column" gap="1">
              <Textarea
                id="instruction"
                placeholder={t('humanSupport.modal.instructionPlaceholder')}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={3}
              />
            </Box>
          )}
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
