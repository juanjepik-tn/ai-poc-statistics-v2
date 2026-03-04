import { Box, Button, Card, Icon, IconButton, Popover, Tag, Text, Tooltip } from '@nimbus-ds/components';
import { EditIcon, EllipsisIcon, ExclamationTriangleIcon, TrashIcon } from '@nimbus-ds/icons';
import { DataList } from '@nimbus-ds/patterns';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContentItem } from './step2.types';
import { trackingLibraryContentOptionsMenu, trackingLibraryContentOptionsMenuSelect } from '@/tracking';
import { MCP_TITLES, MCP_SECTION_LINKS } from '@/constants/mcpRelevantContent';
import { goTo } from '@tiendanube/nexo';
import { nexo } from '@/app';

export type CardLayout = 'grid' | 'list';

type InfoCardProps = {
  onClick: () => void;
  onDelete: () => void;
  content: IContentItem;
  color?: "primary" | "danger" | "neutral" | "warning" | "success" | undefined;
  showTags?: boolean;
  source: 'onboarding' | 'settings';
  layout?: CardLayout;
};

const InfoCard: React.FC<InfoCardProps> = ({ onClick, onDelete, content, color, showTags, source, layout = 'list' }) => {
  const { t } = useTranslation('translations');
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const MAX_LENGTH = 300;
  
  const isMCPTool = useMemo(() => {
    const isDummy = content?.class === 'relevant_content_dummy';
    const mcpToolTitle = MCP_TITLES.includes(content?.title as any);
    return isDummy && mcpToolTitle;
  }, [content?.class, content?.title]);

  const sectionName = useMemo(() => {
    const handleLinkClick = (ev: React.MouseEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
      goTo(nexo, MCP_SECTION_LINKS[content?.title as keyof typeof MCP_SECTION_LINKS] || '');
    };

    return (
      <Text color="primary-interactive" as="span">
        <a
          onClick={handleLinkClick}
          target="_blank"
          color="primary-interactive"
          style={{ textDecoration: 'underline', fontWeight: 'normal' }}
        >
          {t(`conversations.tags.${content?.title}`, { defaultValue: content?.title }).toLowerCase()}
        </a>
      </Text>
    );
  }, [content?.title, t]);

  const handlePopoverToggle = useCallback(() => {
    trackingLibraryContentOptionsMenu({
      source: source,
    });
    setPopoverOpen(prev => !prev);
  }, [source]);

  const handleEditClick = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
    setPopoverOpen(false);
    onClick();
    trackingLibraryContentOptionsMenuSelect({
      source: source,
      selected_option: 'edit',
    });
  }, [onClick, source]);

  const handleDeleteClick = useCallback(() => {
    setPopoverOpen(false);
    onDelete();
    trackingLibraryContentOptionsMenuSelect({
      source: source,
      selected_option: 'delete',
    });
  }, [onDelete, source]);

  const renderTags = () => (
    <>
      {isMCPTool ? (
        <Tag appearance="success">
          {t('settings.step2.tags.connected')}
        </Tag>
      ) : (
        <>
          {content?.class === 'relevant_content_mandatory' && source === 'onboarding' && !content?.content ? 
            <Tag appearance={color}>{t('settings.step2.mandatory-content')}</Tag> : 
            showTags && <Tag appearance="success">{t('settings.step2.optional-content')}</Tag>
          }
          {content?.content == '.' && content?.class === 'relevant_content_mandatory' && (
            <Tooltip content={t('settings.step2.error-mandatory-content')}>
              <Icon color="warning-interactive" source={<ExclamationTriangleIcon height={20} width={20} />} />
            </Tooltip>
          )}
        </>
      )}
    </>
  );

  const renderContentPreview = () => (
    <Text as="p" lineClamp={layout === 'grid' ? 2 : 3}>
      {isMCPTool ? (
        <>
          {t('settings.step2.mcp-connected-prefix')} {sectionName}
        </>
      ) : (
        <>
          {content?.content?.slice(0, MAX_LENGTH)}{content?.content?.length > MAX_LENGTH ? '...' : ''}
        </>
      )}
    </Text>
  );

  const renderActions = () => {
    if (isMCPTool) return null;
    if (content?.canBeDeleted) {
      return (
        <Popover
          visible={popoverOpen}
          onVisibility={(visible) => setPopoverOpen(visible)}
          content={
            <Box display="flex" flexDirection="column" onClick={(ev) => ev.stopPropagation()}>
              <Button appearance="transparent" onClick={handleEditClick}>
                <Text><EditIcon style={{ cursor: 'pointer' }} /></Text>
                <Text>{t('settings.edit')}</Text>
              </Button>
              <Button appearance="transparent" onClick={handleDeleteClick}>
                <Text><TrashIcon style={{ cursor: 'pointer' }} /></Text>
                <Text>{t('settings.delete')}</Text>
              </Button>
            </Box>
          }
          position="bottom"
        >
          <IconButton size="1.5rem" source={<EllipsisIcon />} onClick={handlePopoverToggle} aria-label={t('settings.more_options')} aria-haspopup="menu" aria-expanded={popoverOpen} />
        </Popover>
      );
    }
    return (
      <Button
        appearance="neutral"
        size="small"
        onClick={handleEditClick}
      >
        {t('settings.edit')}
      </Button>
    );
  };

  if (layout === 'grid') {
    return (
      <Card padding="none" style={{ height: '100%' }}>
        <Box
          display="flex"
          flexDirection="column"
          gap="2"
          padding="4"
          width="100%"
          height="100%"
          cursor="pointer"
          onClick={!isMCPTool ? onClick : undefined}
        >
          <Box display="flex" gap="2" alignItems="flex-start" width="100%">
            <Box flex="1" style={{ minWidth: 0 }}>
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
                {t(`conversations.tags.${content?.title}`, { defaultValue: content?.title })}
              </Text>
            </Box>
            {renderTags()}
          </Box>

          <Box display="flex" flexDirection="column" gap="2" flex="1">
            <div style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
            }}>
              {renderContentPreview()}
            </div>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" onClick={(ev) => ev.stopPropagation()}>
            {renderActions()}
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <DataList.Row>
      <Box display="flex" flexDirection="row" gap="4" justifyContent="space-between" cursor="pointer" >
        <Box display="flex" flexDirection="column" gap="2" onClick={!isMCPTool ? onClick : undefined}>
          <Box display="flex" flexDirection="row" gap="4">
            <Text as="span" fontWeight="bold" fontSize="highlight" color="primary-textHigh" >
              {t(`conversations.tags.${content?.title}`, { defaultValue: content?.title })}
            </Text>
            {renderTags()}
          </Box>
          <Box display="flex">
            {renderContentPreview()}
          </Box>
        </Box>
        {renderActions()}
      </Box>
    </DataList.Row>
  );
};

export default InfoCard; 