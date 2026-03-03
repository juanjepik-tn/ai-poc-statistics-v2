import React, { useState } from 'react';
import { Box, Button, Card, IconButton, Popover, Tag, Text, Toggle } from '@nimbus-ds/components';
import { EllipsisIcon, LockIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { ActionRule, ActionRuleSuggestion } from '../types/actionRule';
import { useWindowWidth } from '@/hooks';

export type CardLayout = 'grid' | 'list';

interface TransferScenarioCardProps {
  actionRule?: ActionRule;
  suggestion?: ActionRuleSuggestion;
  onEdit?: (actionRule: ActionRule) => void;
  onDelete?: (actionRule: ActionRule) => void;
  onToggle?: (id: number) => void;
  onActivateSuggestion?: (suggestion: ActionRuleSuggestion) => void;
  layout?: CardLayout;
}

const TransferScenarioCard: React.FC<TransferScenarioCardProps> = ({
  actionRule,
  suggestion,
  onEdit,
  onDelete,
  onToggle,
  onActivateSuggestion,
  layout = 'grid',
}) => {
  const { t } = useTranslation('translations');
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== null && windowWidth < 768;
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isSuggestion = !!suggestion;
  const displayName = isSuggestion ? suggestion.name : actionRule?.name || '';
  const description = isSuggestion
    ? suggestion.description
    : (actionRule?.trigger || t('humanSupport.noDescription'));
  const isLocked = actionRule?.state === 'enabled' &&
    ['Cliente frustrado', 'Cliente solicita atendimento'].includes(actionRule.name);
  const isEnabled = actionRule?.state === 'enabled';


  const renderToggle = () => (
    <Toggle
      name={`toggle-${isSuggestion ? suggestion?.id : actionRule?.id}`}
      active={isSuggestion ? false : isEnabled}
      onChange={() => {
        if (isSuggestion && suggestion && onActivateSuggestion) {
          onActivateSuggestion(suggestion);
        } else if (actionRule?.id && onToggle) {
          onToggle(actionRule.id);
        }
      }}
      disabled={false}
    />
  );

  if (isMobile || layout === 'list') {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 2px rgba(136, 136, 136, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
            <Text
              fontSize="base"
              fontWeight="medium"
              color="neutral-textHigh"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '20px',
              }}
            >
              {displayName}
            </Text>
          </div>
          {isSuggestion && (
            <div style={{ flexShrink: 0 }}>
              <Tag appearance="neutral">{t('humanSupport.status.suggestion')}</Tag>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
            <Text
              fontSize="caption"
              color="neutral-textLow"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                lineHeight: '16px',
              }}
            >
              {description}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {!isSuggestion && actionRule && !isLocked && (
              <Popover
                visible={popoverOpen}
                onVisibility={setPopoverOpen}
                enabledClick
                enabledDismiss
                arrow={false}
                position="bottom-end"
                padding="small"
                content={
                  <Box display="flex" flexDirection="column" gap="1">
                    <Button
                      appearance="transparent"
                      onClick={() => {
                        setPopoverOpen(false);
                        onEdit?.(actionRule);
                      }}
                    >
                      {t('humanSupport.actions.edit')}
                    </Button>
                    <Button
                      appearance="transparent"
                      onClick={() => {
                        setPopoverOpen(false);
                        onDelete?.(actionRule);
                      }}
                    >
                      <Text color="danger-interactive">
                        {t('humanSupport.actions.delete')}
                      </Text>
                    </Button>
                  </Box>
                }
              >
                <IconButton
                  source={<EllipsisIcon />}
                  size="2rem"
                  borderRadius="full"
                  borderColor="transparent"
                  backgroundColor="transparent"
                />
              </Popover>
            )}
            {isLocked && (
              <IconButton
                source={<LockIcon />}
                size="2rem"
                borderRadius="full"
                borderColor="transparent"
                backgroundColor="transparent"
              />
            )}
            {renderToggle()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card padding="none" style={{ height: '100%' }}>
      <Box
        display="flex"
        flexDirection="column"
        gap="2"
        padding="4"
        width="100%"
        height="100%"
      >
        <Box display="flex" gap="2" alignItems="flex-start" width="100%">
          <Box flex="1" style={{ minWidth: 0 }}>
            <div>
              <Text
                fontSize="base"
                fontWeight="medium"
                color="neutral-textHigh"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '20px',
                }}
              >
                {displayName}
              </Text>
            </div>
          </Box>
          {isSuggestion && (
            <Tag appearance="primary">{t('humanSupport.status.suggestion')}</Tag>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap="2"
          alignItems="flex-end"
          flex="1"
        >
          <div style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}>
            <Text
              fontSize="caption"
              color="neutral-textLow"
            >
              {description}
            </Text>
          </div>

          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            {!isSuggestion && actionRule && !isLocked ? (
              <Box display="flex" gap="2" alignItems="center">
                <Button
                  appearance="neutral"
                  size="small"
                  onClick={() => onEdit?.(actionRule)}
                >
                  {t('humanSupport.actions.edit')}
                </Button>
                <Button
                  appearance="transparent"
                  size="small"
                  onClick={() => onDelete?.(actionRule)}
                >
                  {t('humanSupport.actions.delete')}
                </Button>
              </Box>
            ) : (
              <Box />
            )}

            <Box display="flex" alignItems="center" gap="2">
              {isLocked && (
                <IconButton
                  source={<LockIcon />}
                  size="2rem"
                  borderRadius="full"
                  borderColor="transparent"
                  backgroundColor="transparent"
                />
              )}
              {renderToggle()}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default TransferScenarioCard;
