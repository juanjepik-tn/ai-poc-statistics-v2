import { Box, Button, Icon, IconButton, Popover, Tag, Text, Toggle, Tooltip } from '@nimbus-ds/components';
import { CheckCircleIcon, EditIcon, EllipsisIcon, ExclamationTriangleIcon, TrashIcon } from '@nimbus-ds/icons';
import { DataList } from '@nimbus-ds/patterns';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContentItem } from './step2.types';
import { trackingLibraryContentOptionsMenu, trackingLibraryContentOptionsMenuSelect } from '@/tracking';
import { MCP_TITLES, MCP_SECTION_LINKS } from '@/constants/mcpRelevantContent';
import { goTo } from '@tiendanube/nexo';
import { nexo } from '@/app';

type InfoCardProps = {
  onClick: () => void;
  onDelete: () => void;
  content: IContentItem;
  color?: "primary" | "danger" | "neutral" | "warning" | "success" | undefined;
  showTags?: boolean;
  onToggleHumanAttention: () => void;
  source: 'onboarding' | 'settings';
};

const InfoCard: React.FC<InfoCardProps> = ({ onClick, onDelete, content, color, showTags, onToggleHumanAttention, source }) => {
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

  const handleToggleHumanAttention = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.stopPropagation();
    onToggleHumanAttention();
  }, [onToggleHumanAttention]);

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

  return (
    <DataList.Row>
      <Box display="flex" flexDirection="row" gap="4" justifyContent="space-between" cursor="pointer" >
        <Box display="flex" flexDirection="column" gap="2" onClick={!isMCPTool ? onClick : undefined}>
          <Box display="flex" flexDirection="row" gap="4">
            <Text as="span" fontWeight="bold" fontSize="highlight" color="primary-textHigh" >
              {t(`conversations.tags.${content?.title}`, { defaultValue: content?.title })}
            </Text>
            
            {isMCPTool ? (
              <Tag appearance="success">
                <CheckCircleIcon size="small" /> {t('settings.step2.tags.connected')}
              </Tag>
            ) : (
              <>
                {content?.class === 'relevant_content_mandatory' ? 
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
            {!isMCPTool && content?.tool_name && (
              <Box display="flex" alignItems="center" gap="2" onClick={(ev) => ev.stopPropagation()}>
                {/*@ts-ignore*/}
                <Tooltip content={
                  <>
                    <Box maxWidth="200px" style={{ textAlign: 'justify' }}>
                      <Box>
                        {t('settings.step3.config-4.help-text')}
                      </Box>
                    </Box>
                  </>
                } position="top">
                  <Text as="span" fontSize="caption">
                    {t('settings.step2.tags.human-help')}
                  </Text>
                </Tooltip>

                <Toggle
                  checked={content?.tool_name && content?.tool ? true : false}
                  onChange={handleToggleHumanAttention}
                  name={`toggle-human-attention-${content?.id}`}
                />
              </Box>
            )}
          </Box>

          <Box display="flex">
            <Text as="p" lineClamp={3}>
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
          </Box>
        </Box>
        {!isMCPTool && (
          <>
            {content?.canBeDeleted ? (
              <Popover
                visible={popoverOpen}
                onVisibility={(visible) => setPopoverOpen(visible)}
                content={
                  <Box display="flex" flexDirection="column" onClick={(ev) => ev.stopPropagation()}>
                    <Button
                      appearance="transparent"
                      onClick={handleEditClick}
                    >
                      <Text>
                        <EditIcon style={{ cursor: 'pointer' }} />
                      </Text>
                      <Text>{t('settings.edit')}</Text>
                    </Button>
                    <Button
                      appearance="transparent"
                      onClick={handleDeleteClick}
                    >
                      <Text>
                        <TrashIcon style={{ cursor: 'pointer' }} />
                      </Text>
                      <Text>{t('settings.delete')}</Text>
                    </Button>
                  </Box>
                }
                position="bottom"
              >
                <IconButton size="1.5rem" source={<EllipsisIcon />} onClick={handlePopoverToggle} aria-label={t('settings.more_options')} aria-haspopup="menu" aria-expanded={popoverOpen} />                
              </Popover>
            ) : (
              <Tooltip content={t('settings.edit')} position="bottom">
                <IconButton 
                  size="1.5rem" 
                  source={<EditIcon />} 
                  onClick={handleEditClick}
                  aria-label={t('settings.edit')}
                />
              </Tooltip>
            )}
          </>
        )}
      </Box>
    </DataList.Row>
  );
};

export default InfoCard; 