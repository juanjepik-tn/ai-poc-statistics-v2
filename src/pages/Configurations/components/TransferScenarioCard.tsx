import React, { useState } from 'react';
import { Box, Button, Card, Icon, IconButton, Popover, Tag, Text, Toggle } from '@nimbus-ds/components';
import { EditIcon, EllipsisIcon, LockIcon, TrashIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { Responsive } from '@/components';
import { ActionRule, ActionRuleSuggestion } from '../types/actionRule';

const styles: Record<string, React.CSSProperties> = {
  card: {
    minHeight: 200,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    height: '100%',
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  header: {
    minWidth: 0,
    width: '100%',
    height: 44,
    flexShrink: 0,
    overflow: 'hidden',
  },
  headerTitleWrap: {
    minWidth: 0,
    flex: 1,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  headerTagWrap: {
    flexShrink: 0,
  },
  title: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '20px',
    wordBreak: 'break-all',
    overflowWrap: 'anywhere',
    maxWidth: '100%',
  },
  body: {
    minWidth: 0,
    width: '100%',
    height: 54,
    flexShrink: 0,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  },
  descriptionWrapper: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  footer: {
    marginTop: 'auto',
    height: 48,
    flexShrink: 0,
  },
  footerSpacer: {
    flex: 1,
  },
  footerLeft: {
    minWidth: 0,
  },
  footerRight: {
    flexShrink: 0,
  },
};

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
  const [menuOpen, setMenuOpen] = useState(false);
  const isSuggestion = !!suggestion;

  const displayName = isSuggestion ? suggestion.name : actionRule?.name || '';

  const description = isSuggestion
    ? suggestion.description
    : (actionRule?.trigger || t('humanSupport.noDescription'));

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
    if (actionRule?.state === 'to_review') {
      return t('humanSupport.status.review');
    }
    return null;
  };

  const isEnabled = actionRule?.state === 'enabled';

  const toggleElement = (
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
  );

  const mobileMenuElement = !isSuggestion && actionRule && !isLocked ? (
    <Popover
      visible={menuOpen}
      onVisibility={setMenuOpen}
      enabledClick
      enabledDismiss
      arrow={false}
      position="bottom-end"
      padding="small"
      content={
        <Box display="flex" flexDirection="column">
          <Button appearance="transparent" onClick={() => { setMenuOpen(false); onEdit?.(actionRule); }}>
            <Icon source={<EditIcon />} color="currentColor" />
            {t('humanSupport.actions.edit')}
          </Button>
          <Button appearance="transparent" onClick={() => { setMenuOpen(false); onDelete?.(actionRule); }}>
            <Icon source={<TrashIcon />} color="currentColor" />
            {t('humanSupport.actions.delete')}
          </Button>
        </Box>
      }
    >
      <IconButton
        size="2rem"
        source={<EllipsisIcon />}
        aria-label={t('settings.more_options')}
      />
    </Popover>
  ) : null;

  const desktopCard = (
    <Card padding="base" style={styles.card}>
      <Box display="flex" flexDirection="column" gap="4" style={styles.content}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap="3" style={styles.header}>
          <Box display="flex" flexDirection="column" gap="1" style={styles.headerTitleWrap}>
            <Text fontSize="base" fontWeight="bold" color="neutral-textHigh" style={styles.title}>
              {displayName}
            </Text>
          </Box>
          {getTagLabel() && (
            <Box style={styles.headerTagWrap}>
              <Tag appearance={getTagAppearance()}>{getTagLabel()}</Tag>
            </Box>
          )}
        </Box>
        <Box style={styles.body}>
          <Text as="p" fontSize="caption" color="neutral-textLow" style={styles.descriptionWrapper}>
            {description}
          </Text>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="4" style={styles.footer}>
          {!isSuggestion && actionRule && !isLocked ? (
            <Box display="flex" gap="2" alignItems="center" style={styles.footerLeft}>
              <Button appearance="neutral" onClick={() => onEdit?.(actionRule)}>
                {t('humanSupport.actions.edit')}
              </Button>
              <Button appearance="transparent" onClick={() => onDelete?.(actionRule)}>
                {t('humanSupport.actions.delete')}
              </Button>
            </Box>
          ) : (
            <Box style={styles.footerSpacer} />
          )}
          <Box display="flex" alignItems="center" gap="2" style={styles.footerRight}>
            {isLocked && <Icon source={<LockIcon />} color="neutral-textLow" />}
            {toggleElement}
          </Box>
        </Box>
      </Box>
    </Card>
  );

  const mobileCard = (
    <Card padding="base">
      <Box display="flex" alignItems="center" gap="3">
        <Box flex="1" display="flex" flexDirection="column" gap="1" style={{ minWidth: 0 }}>
          <Text fontSize="base" fontWeight="bold" color="neutral-textHigh" style={styles.title}>
            {displayName}
          </Text>
          <Text as="p" fontSize="caption" color="neutral-textLow" lineClamp={2}>
            {description}
          </Text>
        </Box>
        {getTagLabel() && (
          <Tag appearance={getTagAppearance()}>{getTagLabel()}</Tag>
        )}
        {mobileMenuElement}
        {isLocked && <Icon source={<LockIcon />} color="neutral-textLow" />}
        {toggleElement}
      </Box>
    </Card>
  );

  return (
    <Responsive
      desktopContent={desktopCard}
      mobileContent={mobileCard}
    />
  );
};

export default TransferScenarioCard;
