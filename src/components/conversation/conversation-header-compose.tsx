// @mui
// types
// components
import { Box, Icon, IconButton, Popover, Text } from '@nimbus-ds/components';
import { ChevronDownIcon, ChevronLeftIcon, UserCircleIcon } from '@nimbus-ds/icons';
import { InteractiveList } from '@nimbus-ds/patterns';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationAvatar from './conversation-avatar';
import { ChannelIcon } from '@/components';
import { ChannelType } from '@/types/conversation';
import { useTranslation } from 'react-i18next';
import { useModeCustomer } from './providers/ModeCustomerDataProvider';

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
  const { t } = useTranslation('translations');
  const modeContext = useModeCustomer();
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-header-compose.tsx:30',message:'Header render',data:{hasConversation:!!currentConversation,hasModeContext:!!modeContext,conversationId:currentConversation?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H4'})}).catch(()=>{});
  // #endregion
  
  // Safe defaults if provider is not available
  const selectedModeCustomer = modeContext?.selectedModeCustomer;
  const modeOptions = modeContext?.modeOptions || [];
  const handleCustomerRadioChange = modeContext?.handleCustomerRadioChange || (() => {});
  const isCustomerActive = modeContext?.isCustomerActive || (() => true);

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
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="row" gap="2" alignItems="center">
              {onParentEvent && (
                <IconButton onClick={onParentEvent} source={<ChevronLeftIcon size="small" />} borderColor='transparent' backgroundColor='transparent' />         
              )}
              {/* Avatar with channel badge */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {currentConversation.avatar ? (
                  <Box
                    backgroundColor="primary-surface"
                    borderRadius="half"
                    height="40px"
                    width="40px"
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                  >
                    <ConversationAvatar
                      name={currentConversation?.customer?.name}
                      imageUrl={currentConversation?.avatar}
                      height={40}
                      width={40}
                    />
                  </Box>
                ) : (
                  <Box            
                    backgroundColor="neutral-surfaceDisabled"
                    borderRadius="half"
                    height="40px"
                    width="40px"
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                  >
                    <Icon color="primary-textLow" source={<UserCircleIcon width="20px" height="20px" />} />
                  </Box>
                )}
                {/* Channel Badge */}
                {channelType && (
                  <div style={{ position: 'absolute', bottom: '-3px', right: '-5px' }}>
                    <ChannelIcon channel={channelType} size="small" />
                  </div>
                )}
              </div>
              <Box display='flex' flexDirection='column' gap="0-5" justifyContent='flex-start'>
                <Text as="span" fontWeight="medium">
                  {currentConversation?.customer?.name}
                </Text>
                <Text as="span" color='neutral-textDisabled' fontSize="caption">
                  {getChannelIdentifier()}
                </Text>
              </Box>
            </Box>
            
            {/* Mode selector - right side */}
            {modeOptions.length > 0 ? (
              <Popover
                padding="none"
                position="bottom-end"
                content={
                  <Box>
                    <Box padding="2">
                      <Text fontWeight="bold">
                        {t('conversations.client-response-mode')}
                      </Text>
                    </Box>
                    <InteractiveList>
                      {modeOptions.map((option: any) => (
                        <InteractiveList.RadioItem
                          key={option.number}
                          title={option.title}
                          description={option.description}
                          radio={{
                            name: 'radio-element-header',
                            checked: selectedModeCustomer?.customerName === option.customerName,
                            onChange: () => handleCustomerRadioChange(option.customerName, option.number),
                          }}
                        />
                      ))}
                    </InteractiveList>
                  </Box>
                }
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="1"
                  cursor="pointer"
                  alignItems="center"
                  padding="2"
                  borderRadius="2"
                  backgroundColor="transparent"
                >
                  {isCustomerActive() ? (
                    <img src="/imgs/ia-icon.svg" alt="AI Icon" width={16} />
                  ) : (
                    <img src="/imgs/ia-icon-paused.svg" alt="AI Icon Paused" width={16} />
                  )}
                  <Text color="primary-interactive" fontSize="base">
                    {selectedModeCustomer?.title || t('conversations.mode.automatic')}
                  </Text>
                  <Icon source={<ChevronDownIcon size="small" />} color="primary-interactive" />
                </Box>
              </Popover>
            ) : (
              <Box
                display="flex"
                flexDirection="row"
                gap="1"
                alignItems="center"
                padding="2"
              >
                <img src="/imgs/ia-icon.svg" alt="AI Icon" width={16} />
                <Text color="primary-interactive" fontSize="base">
                  {t('conversations.mode.automatic') || 'Automático'}
                </Text>
                <Icon source={<ChevronDownIcon size="small" />} color="primary-interactive" />
              </Box>
            )}
          </Box>
        </>
      ) : (
        <ChatNavItemSkeleton />
      )}
    </>
  );
}
