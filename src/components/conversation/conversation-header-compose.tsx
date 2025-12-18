// @mui
// types
// components
import { Box, Icon, IconButton, Text } from '@nimbus-ds/components';
import { ChevronLeftIcon, UserCircleIcon } from '@nimbus-ds/icons';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationAvatar from './conversation-avatar';

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
  // const [width] = useState<number>(window.innerWidth);

  // const isMobile = width <= 768;

  return (
    <>
      {currentConversation ? (
        <>
          <Box
            display='flex'
            flexDirection='row'
            gap='2'
            p="4"
          //  justifyContent="space-between"
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
              <Text as="span" color='neutral-textDisabled'>
                {currentConversation?.customer?.username}
              </Text>
            </Box>          

          </Box>
        </>
      ) : (
        <ChatNavItemSkeleton />
      )}
    </>
  );
}
