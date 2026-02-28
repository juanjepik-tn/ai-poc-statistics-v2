// @mui
// types
// components
import { Box, Icon, IconButton, Tag, Text, Tooltip } from '@nimbus-ds/components';
import { CheckCircleIcon, CheckIcon, ChevronLeftIcon, CloseIcon, PencilIcon, UserCircleIcon } from '@nimbus-ds/icons';
import { useWhatsAppLoginMode } from './providers/WhatsAppLoginModeProvider';
import { useBsuidMode } from './providers/BsuidModeProvider';
import { useDirectSendMode } from './providers/DirectSendModeProvider';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationAvatar from './conversation-avatar';
import { ChannelIcon, ChannelType } from '@/components';
import { IAssignee } from '@/types/conversation';
import { useTranslation } from 'react-i18next';
import { useModeCustomer } from './providers/ModeCustomerDataProvider';
import AssigneeSelector from './AssigneeSelector';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  currentConversation: any;
  loadingState: boolean;
  onChangeQualification: VoidFunction;
  onChangePausedUser: VoidFunction;
  onViewOrder?: VoidFunction;
  onParentEvent?: VoidFunction;
  pausedUser: any;
  onAssign?: (conversationId: string, assignee: IAssignee | null) => void;
  onUpdateCustomerName?: (customerId: number, name: string) => void;
};

export default function ConversationHeaderCompose({
  currentConversation,
  onParentEvent,
  onAssign,
  onUpdateCustomerName,
}: Props) {
  const { t } = useTranslation('translations');
  const modeContext = useModeCustomer();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const { isUsernameMode } = useWhatsAppLoginMode();
  const { isBsuidMode, getIdentifierDisplay } = useBsuidMode();
  const { isDirectSendMode } = useDirectSendMode();

  const isWhatsApp = currentConversation?.channel?.channelType === 'whatsapp';

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
      const username = currentConversation?.customer?.username;
      return username ? (username.startsWith('@') ? username : `@${username}`) : '';
    } else {
      return currentConversation?.customer?.username || currentConversation?.customer?.phone || '';
    }
  };

  const handleStartEdit = () => {
    setEditedName(currentConversation?.customer?.name || '');
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim() && onUpdateCustomerName && currentConversation?.customer?.id) {
      onUpdateCustomerName(currentConversation.customer.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleAssign = (assignee: IAssignee | null) => {
    if (onAssign && currentConversation?.id) {
      onAssign(currentConversation.id, assignee);
    }
    // When assigning to a person, switch to Manual mode
    if (assignee && isCustomerActive()) {
      const manualOption = modeOptions.find((o: any) => o.number === 3);
      if (manualOption) {
        handleCustomerRadioChange(manualOption.customerName, manualOption.number);
      }
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
            <Box display="flex" flexDirection="row" gap="2" alignItems="center" flexGrow="1">
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
                {/* Editable name (Feature 7) */}
                {isEditingName ? (
                  <Box display="flex" flexDirection="row" gap="1" alignItems="center">
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                      style={{
                        border: '1px solid #0059d5',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 14,
                        fontFamily: "'Geist', sans-serif",
                        fontWeight: 500,
                        outline: 'none',
                        width: 160,
                      }}
                    />
                    <IconButton
                      onClick={handleSaveName}
                      source={<CheckIcon size="small" />}
                      size="1.5rem"
                      borderColor="transparent"
                      backgroundColor="transparent"
                    />
                    <IconButton
                      onClick={handleCancelEdit}
                      source={<CloseIcon size="small" />}
                      size="1.5rem"
                      borderColor="transparent"
                      backgroundColor="transparent"
                    />
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="row" gap="1" alignItems="center">
                    <Text as="span" fontWeight="medium">
                      {currentConversation?.customer?.name}
                    </Text>
                    {onUpdateCustomerName && (
                      <Box cursor="pointer" onClick={handleStartEdit}>
                        <Icon source={<PencilIcon size="small" />} color="neutral-textDisabled" />
                      </Box>
                    )}
                  </Box>
                )}
                {isBsuidMode && currentConversation?.customer?.identifierType ? (
                  (() => {
                    const display = getIdentifierDisplay(currentConversation.customer);
                    const idType = currentConversation.customer.identifierType;
                    return (
                      <Box display="flex" flexDirection="column" gap="0-5">
                        <Box display="flex" flexDirection="row" gap="1" alignItems="center">
                          <Text as="span" color="neutral-textDisabled" fontSize="caption">
                            {display.sublabel}
                          </Text>
                          {idType === 'username' && (
                            <Tag appearance="primary">
                              <Text fontSize="caption" color="currentColor">Username</Text>
                            </Tag>
                          )}
                          {idType === 'bsuid_only' && (
                            <Tag appearance="neutral">
                              <Text fontSize="caption" color="currentColor">BSUID</Text>
                            </Tag>
                          )}
                          {idType === 'phone' && display.isDualKey && (
                            <Tooltip content={`BSUID: ${currentConversation.customer.bsuid}`}>
                              <Tag appearance="success">
                                <Text fontSize="caption" color="currentColor">Dual-key</Text>
                              </Tag>
                            </Tooltip>
                          )}
                        </Box>
                        {display.isDualKey && idType !== 'phone' && (
                          <Text as="span" color="neutral-textDisabled" fontSize="caption" style={{ opacity: 0.6 }}>
                            BSUID: {display.bsuidLabel}
                          </Text>
                        )}
                        {idType === 'phone' && display.isDualKey && (
                          <Text as="span" color="neutral-textDisabled" fontSize="caption" style={{ opacity: 0.6 }}>
                            BSUID: {display.bsuidLabel}
                          </Text>
                        )}
                      </Box>
                    );
                  })()
                ) : (
                  <Text as="span" color='neutral-textDisabled' fontSize="caption">
                    {getChannelIdentifier()}
                  </Text>
                )}
              </Box>
            </Box>

            <Box display="flex" flexDirection="row" gap="2" alignItems="center">
              {isWhatsApp && isDirectSendMode && (
                <Tooltip content="Direct Send ativo: mensagens utility sem template">
                  <Tag appearance="primary">
                    <Text fontSize="caption" color="currentColor" fontWeight="bold">Direct Send</Text>
                  </Tag>
                </Tooltip>
              )}
              <AssigneeSelector
                currentAssignee={currentConversation?.assignee}
                onAssign={handleAssign}
                isAIActive={isCustomerActive()}
                onSelectAI={() => {
                  const autoOption = modeOptions.find((o: any) => o.number === 1);
                  if (autoOption) {
                    handleCustomerRadioChange(autoOption.customerName, autoOption.number);
                  }
                }}
                aiLabel={t('settings.step3.config-3.autopilot.title') || 'Agente IA'}
              />
            </Box>
          </Box>
        </>
      ) : (
        <ChatNavItemSkeleton />
      )}
    </>
  );
}
