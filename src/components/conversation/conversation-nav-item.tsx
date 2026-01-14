// @mui
// hooks

// types

import { useEffect, useState } from 'react';
// import { IConversation } from 'src/types/conversation';

//import { useLocales } from 'src/locales';
// import { Link } from 'react-router-dom';
// import { paths } from 'src/routes/paths';
// import useHasRoles from 'src/hooks/use-has-roles';
import { Badge, Box, Icon, Tag, Text, Tooltip } from '@nimbus-ds/components';
import { ExclamationTriangleIcon, UserCircleIcon, CreditCardIcon, MarketingIcon, ExclamationCircleIcon, ShoppingCartIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import Iconify from '../iconify';
import ConversationAvatar from './conversation-avatar';
import FormattedTextWrapper from './providers/FormattedTextWrapper';
import { isMarketingMessage, isPaymentMessage, getSystemMessageContent, isPaymentTag, isPaymentMessageWhatsapp } from '@/utils/messageUtils';
import { useIsMessageFailed } from './hooks/use-is-message-failed';
import { useStoreDetails } from '@/hooks';
import { getTagTranslation } from '@/hooks';
import { TagText } from './TagText';
import { ChannelBadge } from '../ChannelBadge';
import { ChannelType } from '@/types/conversation';
// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onClickConversation: VoidFunction;
  conversation: any;
  markAsResolved: any;
  storeSelectedMode: any;
};

export default function ConversationNavItem({
  selected,
  conversation,
  onClickConversation
}: Props) {
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

  // useEffect(() => {
  //   console.log('markAsResolved', markAsResolved);

  //   if (markAsResolved && undoneTags.length > 0) {
  //     setUndoneTags([]);
  //   }

  // }, [markAsResolved]);

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
    // Función para renderizar mensajes del sistema
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
      {undoneHumanAttentionTags.length > 0 ? (
        undoneHumanAttentionTags.slice(0, 1).map((tag: any, index: any) => (
          <Tag key={index} appearance="warning">
            <TagText tagName={tag?.name} color="warning-textLow" fontSize="caption" lineClamp={1} />
          </Tag>
        ))
      ) : (
        undoneTaggedTags.length > 0 && undoneTaggedTags
        .sort((a: any, b: any) => a.id - b.id)
        .slice(0, 1)
        .map((tag: any, index: any) => (
          <Tag key={index} appearance="neutral">
            {tag.name === 'cart-sent' && <ShoppingCartIcon color="neutral-textLow" />}
            <TagText tagName={tag?.name} color="neutral-textLow" fontSize="caption" lineClamp={1} />
          </Tag>
        ))
      )}
    </Box>
  );

const renderMoreTags = () => {
  const totalTagsCount = (undoneHumanAttentionTags?.length || 0) + (undoneTaggedTags?.length || 0);
  const allTags = [...(undoneHumanAttentionTags || []), ...(undoneTaggedTags || [])];
  const tooltipContent = allTags.slice(1).map(tag => getTagTranslation(t, tag.name)).join(', ');

  if (totalTagsCount > 1) {
    const appearance = undoneHumanAttentionTags.length > 1 ? 'warning' : 'neutral';
    const textColor = undoneHumanAttentionTags.length > 1 ? 'warning-textLow' : 'neutral-textLow';
    return (
      <Tooltip position='top' content={tooltipContent}>
        <Tag key="more" appearance={appearance}>
          <Text color={textColor} fontSize="caption" lineClamp={1}>
            {`+${totalTagsCount - 1}`}
          </Text>
        </Tag>
      </Tooltip>
    );
  }
  return null;
}

  return (
    <>
      <Box display="flex" flexDirection="column"
        gap="none" padding="2" borderColor='neutral-surface' backgroundColor={selected ? 'primary-surface' : 'neutral-background'} borderTopWidth='1' borderStyle='solid' cursor='pointer' onClick={handleClick}
      >
        <Box display="flex" flexDirection="row"
          gap="5" padding="2"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            {conversation.avatar ? (
              <Box
                gap="10"
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
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap="1"
            width="100%"
          >
            <Box display="flex" alignItems="center" gap="1">
              {/* Channel Badge - compact variant */}
              {conversation?.channel?.channelType && (
                <ChannelBadge 
                  channel={conversation.channel.channelType as ChannelType} 
                  variant="compact" 
                />
              )}
              <Text color="neutral-textHigh">
                {conversation.customer?.frecuent && (
                  <Iconify
                    width={12}
                    icon="solar:star-bold"
                    color="warning.main"
                    sx={{ mr: 0.5 }}
                  />
                )}
                {conversation?.customer?.name}
              </Text>
            </Box>
            <Box display="flex" flexDirection="row" gap="0-5" alignItems="center">
              {lastMessage?.role === 'assistant' && undoneHumanAttentionTags?.length === 0 && !isMessageFailed && (
                <img src="/imgs/tick-icon.svg" alt="tick-icon" width={20} />
              )}
              <div style={{ whiteSpace: 'pre-wrap', fontStyle: (isMarketingMessage(lastMessage?.class) || isPaymentMessage(lastMessage?.class)) ? 'italic' : 'normal' }}>
                <Text lineClamp={1} color={undoneHumanAttentionTags?.length > 0 ? 'warning-textLow' : 'neutral-textLow'}>
                  {undoneHumanAttentionTags?.length > 0 ? t('conversations.tags.attention-message') : renderLastMessage()}
                </Text>
              </div>
            </Box>

          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap="1"
          >

            <Text as="span" color="neutral-textDisabled" fontSize="caption">
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
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              marginRight="1"
            >
              {/* Volver a esto cuando pongamos el modo Copilot /*}
              {/* {(!selected && (conversation.customer.state.name == 'Paused' || (conversation.customer.state.name == 'Copilot' || storeSelectedMode.number === 2)) && unreadMessagesCount > 0) && (
                <Badge appearance="primary" count={unreadMessagesCount} />
              )} */}

              {(undoneHumanAttentionTags?.length > 0) ? (
                <Tooltip content={t('conversations.tags.attention-message')}>
                  <Icon color="warning-interactive" source={<ExclamationTriangleIcon height={20} width={20} />} />
                </Tooltip>
              ) : (
                !selected && unreadMessagesCount > 0 && (
                  <Badge appearance="primary" count={unreadMessagesCount} />
                )
              )}
            </Box>
          </Box>

        </Box>
        <Box display="flex" flexDirection="row" gap="5" pl="5">
          <Box display="flex" flexDirection="column" pl="2">
          </Box>
          <Box display="flex" flexDirection="column" pl="2" flexGrow="1">
            {renderTags()}
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="flex-end" marginRight="1">
            {renderMoreTags()}
          </Box>
        </Box>
      </Box>

    </>
  );
}
