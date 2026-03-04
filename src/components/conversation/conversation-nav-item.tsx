// @mui
// hooks

// types

import { useEffect, useRef, useState } from 'react';
// import { IConversation } from 'src/types/conversation';

//import { useLocales } from 'src/locales';
// import { Link } from 'react-router-dom';
// import { paths } from 'src/routes/paths';
// import useHasRoles from 'src/hooks/use-has-roles';
import { Badge, Box, Icon, Tag, Text, Tooltip, Box as BoxNimbus } from '@nimbus-ds/components';
import { UserCircleIcon, CreditCardIcon, MarketingIcon, ExclamationCircleIcon, ShoppingCartIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import Iconify from '../iconify';
import ConversationAvatar from './conversation-avatar';
import FormattedTextWrapper from './providers/FormattedTextWrapper';
import { isMarketingMessage, isPaymentMessage, getSystemMessageContent, isPaymentTag, isPaymentMessageWhatsapp } from '@/utils/messageUtils';
import { useIsMessageFailed } from './hooks/use-is-message-failed';
import { useStoreDetails } from '@/hooks';
import { getTagTranslation } from '@/hooks';
import { TagText } from './TagText';
import { ChannelIcon } from '../ChannelIcon';
import { ChannelType } from '@/types/conversation';
// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onClickConversation: VoidFunction;
  conversation: any;
  markAsResolved: any;
  storeSelectedMode: any;
  onMarkAsUnread?: (conversationId: string) => void;
  onMarkAsRead?: (conversationId: string) => void;
};

export default function ConversationNavItem({
  selected,
  conversation,
  onClickConversation,
  onMarkAsUnread,
  onMarkAsRead,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const chevronRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        chevronRef.current && !chevronRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsHovered(true);
    setShowDropdown(true);
  };

  const handleMarkAsUnread = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (onMarkAsUnread) {
      onMarkAsUnread(conversation.id);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (onMarkAsRead) {
      onMarkAsRead(conversation.id);
    }
  };
  const { storeDetails } = useStoreDetails();
  const isBrazilianStore = storeDetails?.country === 'BR';

  const filterPaymentTags = (tags: any[]) => {
    if (isBrazilianStore) {
      return tags;
    }
    return tags.filter((tag: any) => !isPaymentTag(tag?.name));
  };

  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(
    conversation.unreadMessages,
  );
  const [undoneHumanAttentionTags, setUndoneHumanAttentionTags] = useState<any>(
    conversation?.customer?.undoneHumanAttentionTags || [],
  );

  const [undoneTaggedTags, setUndoneTaggedTags] = useState<any>(
    filterPaymentTags(conversation?.customer?.undoneTaggedTags || []),
  );

  const isMessageFailed = useIsMessageFailed(conversation?.lastMessage);

  const handleClick = () => {
    setUnreadMessagesCount(0);
    onClickConversation();
  };

  useEffect(() => {
    setUndoneHumanAttentionTags(conversation?.customer?.undoneHumanAttentionTags);
    setUndoneTaggedTags(filterPaymentTags(conversation?.customer?.undoneTaggedTags || []));
  }, [conversation?.customer?.undoneHumanAttentionTags, conversation?.customer?.undoneTaggedTags, isBrazilianStore]);

  useEffect(() => {
    setUnreadMessagesCount(conversation.unreadMessages);
  }, [conversation]);

  const lastMessage = conversation.lastMessage || 
    (conversation.messagesPanel && conversation.messagesPanel.length > 0 
      ? conversation.messagesPanel[conversation.messagesPanel.length - 1] 
      : null);
  const truncateText = (text: string, maxLength: number): string =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const { t } = useTranslation('translations'); 

  const renderLastMessage = () => {
    if (isMessageFailed) {
      return (
        <Box display="flex" alignItems="center" gap="1">
          <Icon source={<ExclamationCircleIcon />} />
          <Text fontSize="caption" lineClamp={1}>{t('conversations.message-not-delivered')}</Text>
        </Box>
      )
    }
    if (isPaymentMessage(lastMessage?.class)) {
      const PaymentIcon = isPaymentMessageWhatsapp(lastMessage?.class) ? CreditCardIcon : ShoppingCartIcon;
      return (
        <Box display="flex" alignItems="center" gap="1">
          <Icon source={<PaymentIcon />} />
          <Text fontSize="caption" lineClamp={1}>{t('conversations.cart-sent-message')}</Text>
        </Box>
      );
    }
    if (lastMessage?.class.includes('view-once')) {
      return (
        <Box display="flex" alignItems="center" gap="1">
          <Iconify icon="mynaui:one-circle" />
          <Text fontSize="caption" lineClamp={1}>{t('conversations.tags.view_once')}</Text>
        </Box>
      )
    }
    const renderSystemMessage = (lastMessage: any) => {
      if (!isMarketingMessage(lastMessage?.class) && !isPaymentMessage(lastMessage?.class)) return null;

      const getIcon = (classMessage: string) => {
        switch (classMessage) {
          case 'message-payment-link':
          case 'message-one-click-payment':
            return <CreditCardIcon />;
          case 'message-template-marketing':
            return <MarketingIcon />;
          case 'message-botpayment':
            return <ShoppingCartIcon />;
          default:
            return <CreditCardIcon />;
        }
      };

      return (
        <Box display="flex" alignItems="center" gap="1">
          <Icon color="neutral-textLow" source={getIcon(lastMessage.class)} />
          <Text lineClamp={1}>
            {getSystemMessageContent(lastMessage.class, t)}
          </Text>
        </Box>
      );
    };
    
    const systemMessage = renderSystemMessage(lastMessage);
    if (systemMessage) {
      return systemMessage;
    }
    if (lastMessage?.mimetype?.startsWith('image')) {
      return (
        <Box display="flex" alignItems="center" gap="1">
          <Iconify icon="ic:baseline-photo" />
          <Text>{t('conversations.photo')}</Text>
        </Box>
      );
    }
    return (
      <FormattedTextWrapper text={truncateText(lastMessage?.content, 25)}>
        {(formattedContent: any) => (
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        )}
      </FormattedTextWrapper>
    )
  };

  const renderTags = () => (
    <Box display="flex" gap="2" cursor="pointer" flexDirection="row" alignItems="flex-end">
      {undoneHumanAttentionTags.length > 0 && (
        undoneHumanAttentionTags.slice(0, 1).map((tag: any, index: any) => (
          <Tag key={index} appearance="warning">
            <TagText tagName={tag?.name} color="warning-textLow" fontSize="caption" lineClamp={1} />
          </Tag>
        ))
      )}
    </Box>
  );

  const renderMoreTags = () => {
    const totalTagsCount = undoneHumanAttentionTags?.length || 0;
    const tooltipContent = undoneHumanAttentionTags?.slice(1).map((tag: any) => getTagTranslation(t, tag.name)).join(', ');

    if (totalTagsCount > 1) {
      return (
        <Tooltip position='top' content={tooltipContent}>
          <Tag key="more" appearance="warning">
            <Text color="warning-textLow" fontSize="caption" lineClamp={1}>
              {`+${totalTagsCount - 1}`}
            </Text>
          </Tag>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowDropdown(false); }}
    >
      <Box display="flex" flexDirection="column"
        gap="none" padding="2" borderColor='neutral-surface'
        backgroundColor={selected ? 'primary-surface' : isHovered ? 'neutral-surface' : 'neutral-background'}
        borderTopWidth='1' borderStyle='solid' cursor='pointer' onClick={handleClick}
        onContextMenu={handleContextMenu as any}
      >
        <Box display="flex" flexDirection="row"
          gap="5" padding="2"
        >
          {/* Avatar container with channel badge */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {conversation.avatar ? (
              <Box
                backgroundColor="neutral-surfaceDisabled"
                borderRadius="half"
                height="32px"
                width="32px"
                alignItems="center"
                display="flex"
                justifyContent="center"
              >
                <ConversationAvatar
                  name={conversation?.customer?.name}
                  imageUrl={conversation.avatar}
                  height={32}
                  width={32}
                />
              </Box>
            ) : (
              <Box
                backgroundColor="neutral-surfaceDisabled"
                borderRadius="half"
                height="32px"
                width="32px"
                alignItems="center"
                display="flex"
                justifyContent="center"
              >
                <Icon color="neutral-textHigh" source={<UserCircleIcon />} />
              </Box>
            )}
            {conversation?.channel?.channelType && (
              <div style={{ position: 'absolute', bottom: '0px', right: '-3px' }}>
                <ChannelIcon 
                  channel={conversation.channel.channelType as ChannelType} 
                  size="xsmall"
                />
              </div>
            )}
          </div>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap="1"
            width="100%"
          >
            <Box display="flex" alignItems="center" gap="1">
              <Text color="neutral-textHigh" fontWeight="medium">
                {conversation?.customer?.name}
              </Text>
            </Box>
            <Box display="flex" flexDirection="row" gap="0-5" alignItems="center">
              {lastMessage?.role === 'assistant' && undoneHumanAttentionTags?.length === 0 && !isMessageFailed && (
                <img src="/imgs/tick-icon.svg" alt="tick-icon" width={20} />
              )}
              <div style={{ whiteSpace: 'pre-wrap', fontStyle: (isMarketingMessage(lastMessage?.class) || isPaymentMessage(lastMessage?.class)) ? 'italic' : 'normal' }}>
                <Text lineClamp={1} color="neutral-textLow">
                  {renderLastMessage()}
                </Text>
              </div>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap="1"
            alignItems="flex-end"
            flexShrink="0"
          >
            {/* Row 1: Date – blue + medium weight when unread */}
            <Text
              as="span"
              color={!selected && unreadMessagesCount > 0 ? 'primary-textLow' : 'neutral-textDisabled'}
              fontWeight={!selected && unreadMessagesCount > 0 ? 'medium' : 'regular'}
              fontSize="caption"
            >
              {lastMessage
                ? new Date(lastMessage.created_at).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                  ? new Date(lastMessage.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                  : new Date(lastMessage.created_at).toLocaleDateString()
                : ''}
            </Text>
            {/* Row 2: Badge + Chevron */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
              {!selected && unreadMessagesCount > 0 && (
                <Badge appearance="primary" count={unreadMessagesCount} />
              )}
              {/* Chevron trigger - collapses to 0 width when hidden */}
              <div
                ref={chevronRef}
                style={{ position: 'relative' }}
              >
                <div
                  onClick={handleChevronClick}
                  style={{
                    opacity: isHovered || showDropdown ? 1 : 0,
                    width: isHovered || showDropdown ? 18 : 0,
                    overflow: 'hidden',
                    pointerEvents: isHovered || showDropdown ? 'auto' : 'none',
                    transition: 'opacity 150ms ease, width 150ms ease',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 18,
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon="mdi:chevron-down" width={16} color="#8696a0" />
                </div>

                {/* Dropdown menu – Nimbus style (same as header "..." menu) */}
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 4,
                      zIndex: 9999,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                      overflow: 'hidden',
                    }}
                  >
                    <BoxNimbus display="flex" flexDirection="column" paddingY="1" minWidth="220px">
                      {unreadMessagesCount > 0 ? (
                        <BoxNimbus
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          gap="3"
                          paddingX="4"
                          paddingY="2-5"
                          cursor="pointer"
                          onClick={handleMarkAsRead}
                        >
                          <Iconify icon="material-symbols:mark-chat-read-outline-rounded" width={18} color="#8696a0" style={{ flexShrink: 0 }} />
                          <Text fontSize="base" color="neutral-textHigh">{t('conversations.mark-as-read')}</Text>
                        </BoxNimbus>
                      ) : (
                        <BoxNimbus
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          gap="3"
                          paddingX="4"
                          paddingY="2-5"
                          cursor="pointer"
                          onClick={handleMarkAsUnread}
                        >
                          <Iconify icon="material-symbols:mark-chat-unread-outline-rounded" width={18} color="#8696a0" style={{ flexShrink: 0 }} />
                          <Text fontSize="base" color="neutral-textHigh">{t('conversations.mark-as-unread')}</Text>
                        </BoxNimbus>
                      )}
                    </BoxNimbus>
                  </div>
                )}
              </div>
            </div>
          </Box>

        </Box>
        <Box display="flex" flexDirection="row" gap="5" pl="5">
          <Box display="flex" flexDirection="column" pl="2">
          </Box>
          <Box display="flex" flexDirection="column" pl="2" flexGrow="1">
            <Box display="flex" gap="1" flexDirection="row" alignItems="center" flexWrap="wrap">
              {renderTags()}
              {conversation?.assignee && (
                <Tag appearance="neutral">
                  <Text fontSize="caption" lineClamp={1}>
                    {conversation.assignee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </Text>
                </Tag>
              )}
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="flex-end" marginRight="1">
            {renderMoreTags()}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
