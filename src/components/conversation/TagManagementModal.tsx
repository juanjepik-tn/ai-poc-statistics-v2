import React, { useState } from 'react';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Input,
  Modal,
  Text,
  Tag,
} from '@nimbus-ds/components';
import { PlusIcon, TrashIcon, CloseIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import type { ICustomTag } from '@/types/conversation';

const COLOR_PALETTE = [
  '#5C7CFA', // blue
  '#20C997', // green
  '#F59F00', // amber
  '#F03E3E', // red
  '#7950F2', // violet
  '#E64980', // pink
  '#1098AD', // cyan
  '#868E96', // gray
];

interface TagManagementModalProps {
  open: boolean;
  onClose: () => void;
  tags: ICustomTag[];
  onCreateTag: (name: string, color: string) => void;
  onDeleteTag: (id: number) => void;
  onUpdateTag: (id: number, name: string, color: string) => void;
}

const ColorDot: React.FC<{
  color: string;
  selected: boolean;
  size?: number;
  onClick: () => void;
}> = ({ color, selected, size = 28, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      border: selected
        ? '2px solid #1a1a1a'
        : '2px solid transparent',
      cursor: 'pointer',
      flexShrink: 0,
      padding: 0,
    }}
  />
);

const TagManagementModal: React.FC<TagManagementModalProps> = ({
  open,
  onClose,
  tags,
  onCreateTag,
  onDeleteTag,
  onUpdateTag,
}) => {
  const { t } = useTranslation('translations');
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleCreateTag = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) return;
    onCreateTag(trimmedName, selectedColor);
    setNewTagName('');
    setSelectedColor(COLOR_PALETTE[0]);
  };

  const handleStartEdit = (tag: ICustomTag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const handleSaveEdit = () => {
    if (editingTagId === null) return;
    const trimmedName = editName.trim();
    if (!trimmedName) return;
    onUpdateTag(editingTagId, trimmedName, editColor);
    setEditingTagId(null);
    setEditName('');
    setEditColor('');
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditName('');
    setEditColor('');
  };

  return (
    <Modal
      maxWidth={{ xs: '100%', md: '480px' }}
      open={open}
      onDismiss={onClose}
      padding="none"
    >
      <Modal.Header
        title={t('conversations.tags.management.title', {
          defaultValue: 'Manage custom tags',
        })}
      />
      <Modal.Body padding="base">
        <Box display="flex" flexDirection="column" gap="4">
          {/* Create new tag section */}
          <Box display="flex" flexDirection="column" gap="3">
            <Text
              fontSize="caption"
              fontWeight="medium"
              color="neutral-textHigh"
            >
              {t('conversations.tags.management.newTag', {
                defaultValue: 'Create new tag',
              })}
            </Text>
            <Box display="flex" flexDirection="column" gap="2">
              <Input
                placeholder={t('conversations.tags.management.namePlaceholder', {
                  defaultValue: 'Tag name',
                })}
                value={newTagName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewTagName(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') handleCreateTag();
                }}
              />
              <Box display="flex" alignItems="center" gap="2" flexWrap="wrap">
                <Text
                  fontSize="caption"
                  color="neutral-textLow"
                  style={{ minWidth: 'fit-content' }}
                >
                  {t('conversations.tags.management.color', {
                    defaultValue: 'Color',
                  })}
                  :
                </Text>
                {COLOR_PALETTE.map((color) => (
                  <ColorDot
                    key={color}
                    color={color}
                    selected={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Box>
              <Button
                appearance="primary"
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
              >
                <Box display="flex" alignItems="center" gap="2">
                  <Icon source={<PlusIcon size="small" />} color="neutral-background" />
                  <Text color="neutral-background">
                    {t('conversations.tags.management.addTag', {
                      defaultValue: 'Add tag',
                    })}
                  </Text>
                </Box>
              </Button>
            </Box>
          </Box>

          {/* Existing tags list */}
          <Box display="flex" flexDirection="column" gap="2">
            <Text
              fontSize="caption"
              fontWeight="medium"
              color="neutral-textHigh"
            >
              {t('conversations.tags.management.existingTags', {
                defaultValue: 'Existing tags',
              })}
            </Text>
            {tags.length === 0 ? (
              <Text fontSize="base" color="neutral-textLow">
                {t('conversations.tags.management.noTags', {
                  defaultValue: 'No custom tags yet. Create one above.',
                })}
              </Text>
            ) : (
              <Box display="flex" flexDirection="column" gap="2">
                {tags.map((tag) => (
                  <Box
                    key={tag.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="3"
                    backgroundColor="neutral-surface"
                    borderRadius="2"
                  >
                    {editingTagId === tag.id ? (
                      <Box
                        display="flex"
                        flex="1"
                        gap="2"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Input
                          value={editName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditName(e.target.value)
                          }
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          style={{ flex: 1, minWidth: 100 }}
                        />
                        <Box display="flex" gap="1" alignItems="center">
                          {COLOR_PALETTE.map((color) => (
                            <ColorDot
                              key={color}
                              color={color}
                              selected={editColor === color}
                              size={20}
                              onClick={() => setEditColor(color)}
                            />
                          ))}
                        </Box>
                        <Box display="flex" gap="1">
                          <Button
                            size="small"
                            appearance="primary"
                            onClick={handleSaveEdit}
                          >
                            {t('conversations.tags.management.save', {
                              defaultValue: 'Save',
                            })}
                          </Button>
                          <Button
                            size="small"
                            appearance="transparent"
                            onClick={handleCancelEdit}
                          >
                            {t('conversations.tags.management.cancel', {
                              defaultValue: 'Cancel',
                            })}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap="2"
                          flex="1"
                          minWidth="0"
                        >
                          <Box
                            width="12px"
                            height="12px"
                            borderRadius="full"
                            flexShrink="0"
                            style={{ backgroundColor: tag.color }}
                          />
                          <button
                            type="button"
                            onClick={() => handleStartEdit(tag)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            <Tag appearance="primary">
                              {tag.name}
                            </Tag>
                          </button>
                        </Box>
                        <IconButton
                          source={<TrashIcon size="small" />}
                          size="2rem"
                          onClick={() => onDeleteTag(tag.id)}
                        />
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="transparent" onClick={onClose}>
          <Box display="flex" alignItems="center" gap="2">
            <Icon source={<CloseIcon size="small" />} color="neutral-textHigh" />
            <Text color="neutral-textHigh">
              {t('conversations.tags.management.close', {
                defaultValue: 'Close',
              })}
            </Text>
          </Box>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TagManagementModal;
