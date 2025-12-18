import React from 'react';
import { Box, Button, Card, Icon, Tag, Text, Toggle } from '@nimbus-ds/components';
import { LockIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { ActionRule, ActionRuleSuggestion } from '../types/actionRule';

interface TransferScenarioCardProps {
  actionRule?: ActionRule;
  suggestion?: ActionRuleSuggestion;
  onEdit?: (actionRule: ActionRule) => void;
  onDelete?: (actionRule: ActionRule) => void;
  onToggle?: (id: number) => void;
  onActivateSuggestion?: (suggestion: ActionRuleSuggestion) => void;
}

const TransferScenarioCard: React.FC<TransferScenarioCardProps> = ({
  actionRule,
  suggestion,
  onEdit,
  onDelete,
  onToggle,
  onActivateSuggestion,
}) => {
  const { t } = useTranslation('translations');
  const isSuggestion = !!suggestion;

  // Get display name
  const displayName = isSuggestion ? suggestion.name : actionRule?.name || '';

  // Get description (trigger for action rules, description for suggestions)
  const description = isSuggestion
    ? suggestion.description
    : (actionRule?.trigger || t('humanSupport.noDescription'));

  // Determine if this is a system rule (locked)
  // TODO: Replace hardcoded name comparison with a backend-provided flag (e.g., isSystem or isLocked).
  // Current implementation is fragile and breaks i18n. Coordinate with backend team to extend ActionRule contract.
  const isLocked = actionRule?.state === 'enabled' && 
    ['Cliente frustrado', 'Cliente solicita atendimento'].includes(actionRule.name);

  const getTagAppearance = () => {
    if (isSuggestion) return 'neutral';
    switch (actionRule?.state) {
      case 'to_review':
        return 'warning';
      case 'enabled':
        return 'success';
      case 'disabled':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getTagLabel = () => {
    if (isSuggestion) return t('humanSupport.status.suggestion');
    // Only show tag for 'to_review', don't show for 'enabled' or 'disabled'
    if (actionRule?.state === 'to_review') {
      return t('humanSupport.status.review');
    }
    return null;
  };

  const isEnabled = actionRule?.state === 'enabled';

  return (
    <Card padding="base" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        display="flex" 
        flexDirection="column" 
        style={{ 
          height: '100%', 
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Header - Title and Tag */}
        <Box 
          display="flex" 
          alignItems="center" 
          gap="2" 
          flexWrap="wrap" 
          style={{ 
            height: '32px',
            minHeight: '32px',
            maxHeight: '32px',
            alignItems: 'center'
          }}
        >
          <Text fontSize="base" fontWeight="bold" color="neutral-textHigh">
            {displayName}
          </Text>
          {getTagLabel() && (
            <Tag appearance={getTagAppearance()}>{getTagLabel()}</Tag>
          )}
        </Box>

        {/* Body - Description */}
        <Box 
          style={{ 
            height: '72px',
            minHeight: '72px',
            maxHeight: '72px',
            marginTop: '8px',
            marginBottom: '8px'
          }}
        >
          <Text 
            fontSize="caption" 
            color="neutral-textLow"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '100%',
              lineHeight: '16px',
              textAlign: 'justify'
            }}
          >
            {description}
          </Text>
        </Box>

        {/* Footer - Buttons and Toggle */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            paddingTop: '8px'
          }}
        >
          {!isSuggestion && actionRule && !isLocked ? (
            <Box display="flex" gap="2" alignItems="center" style={{ height: '100%' }}>
              <Button
                appearance="neutral"
                onClick={() => onEdit?.(actionRule)}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {t('humanSupport.actions.edit')}
              </Button>
              <Button
                appearance="transparent"
                onClick={() => onDelete?.(actionRule)}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {t('humanSupport.actions.delete')}
              </Button>
            </Box>
          ) : (
            <Box style={{ height: '100%' }} />
          )}

          <Box 
            display="flex" 
            alignItems="center" 
            gap="2"
            style={{ height: '100%' }}
          >
            {isLocked && (
              <Icon source={<LockIcon />} color="neutral-textLow" />
            )}
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
              disabled={isLocked && !isSuggestion}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default TransferScenarioCard;
