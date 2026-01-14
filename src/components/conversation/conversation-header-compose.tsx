// @mui
// types
// components
import { Box, Icon, IconButton, Text } from '@nimbus-ds/components';
import { ChevronLeftIcon, UserCircleIcon } from '@nimbus-ds/icons';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationAvatar from './conversation-avatar';
import { ChannelIcon } from '@/components';
import { ChannelType } from '@/types/conversation';

// ----------------------------------------------------------------------

type Props = {
  currentConversation: any;
  loadingState: boolean;
  onChangeQualification: VoidFunction;
  onChangePausedUser: VoidFunction;
  onViewOrder?: VoidFunction;
  onParentEvent?: VoidFunction;
  pausedUser: any;
};

export default function ConversationHeaderCompose({
  currentConversation,
  onParentEvent,
}: Props) {
  // Determinar el tipo de canal
  const channelType = currentConversation?.channel?.channelType as ChannelType | undefined;
  const isInstagram = channelType === 'instagram';
  
  // Formatear el identificador según el canal
  const getChannelIdentifier = () => {
    if (isInstagram) {
      // Para Instagram: mostrar @username
      const username = currentConversation?.customer?.username;
      return username ? (username.startsWith('@') ? username : `@${username}`) : '';
    } else {
      // Para WhatsApp: mostrar número de teléfono
      return currentConversation?.customer?.username || currentConversation?.customer?.phone || '';
    }
  };

  return (
    <>
      {currentConversation ? (
        <>
          <Box
            display='flex'
            flexDirection='row'
            gap='2'
            p="4"
            alignItems="center"
          >
            {onParentEvent && (
              <IconButton onClick={onParentEvent} source={<ChevronLeftIcon size="small" />} borderColor='transparent' backgroundColor='transparent' />         
            )}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {currentConversation.avatar ? (
                <Box
                  gap="10"
                  backgroundColor="primary-surface"
                  borderRadius="half"
                  height="32px"
                  width="32px"
                  alignItems="center"
                  display="flex"
                  justifyContent="center"
                >
                  <ConversationAvatar
                    name={currentConversation?.customer?.name}
                    imageUrl={currentConversation?.avatar}
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
                  <Icon color="primary-textLow" source={<UserCircleIcon width="16px" height="16px" />} />
                </Box>
              )}
            </Box>
            <Box display='flex' flexDirection='column' gap="0-5" justifyContent='flex-start'>
              <Text as="span">
                {currentConversation?.customer?.name}
              </Text>
              {/* Ícono de canal + identificador (según PRD) */}
              <Box display="flex" alignItems="center" gap="1">
                {channelType && (
                  <ChannelIcon channel={channelType} size="small" />
                )}
                <Text as="span" color='neutral-textDisabled' fontSize="caption">
                  {getChannelIdentifier()}
                </Text>
              </Box>
            </Box>          
          </Box>
        </>
      ) : (
        <ChatNavItemSkeleton />
      )}
    </>
  );
}
