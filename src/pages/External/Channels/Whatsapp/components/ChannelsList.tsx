import { Box, Card, Icon, Link, Tag, Text, Title, Toggle, Tooltip, Button } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import { TelephoneIcon, QuestionCircleIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';

export interface Channel {
  id: number;
  chatEnabled: boolean;
  marketingAutomationEnabled: boolean;
  status: {
    id: number;
    name: string;
  };
  username: string;
  created_at: string;
  outgoing_messaging: boolean;
}

type ChannelsListProps = {
  channels: Channel[];
  onToggleAutomatedMessages?: (channel: Channel, value: boolean) => void;
  onToggleChat?: (channel: Channel, value: boolean) => void;
  onAddChannel?: () => void;
};

export const ChannelsList: React.FC<ChannelsListProps> = ({ 
  channels,
  onToggleAutomatedMessages,
  onToggleChat,
  onAddChannel,
}) => {
  const { t } = useTranslation('translations');

  const handleToggleAutomatedMessages = (channel: Channel) => {
    const newValue = !channel.marketingAutomationEnabled;
    onToggleAutomatedMessages?.(channel, newValue);
  };

  const handleToggleChat = (channel: Channel) => {
    const newValue = !channel.chatEnabled;
    onToggleChat?.(channel, newValue);
  };

  return (
    <Page maxWidth="1100px">
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <Box display="flex" flexDirection="column" gap="6">
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap="2">
                  <Title as="h1">{t('whatsappIntegration.channelsList.title')}</Title>
                  {channels.some(channel => channel.status.name === 'Connected') && (
                    <Tag appearance="success">{t('whatsappIntegration.channelsList.active')}</Tag>
                  )}
                </Box>
                <Button appearance="primary" onClick={onAddChannel}>
                  <Icon source={<TelephoneIcon />} color="currentColor" />
                  {t('whatsappIntegration.channelsList.addChannel')}
                </Button>
              </Box>
              <Card>
                <Card.Header>
                  <Title as="h4">{t('whatsappIntegration.channelsList.connectedNumbers')}</Title>
                </Card.Header>
                <Card.Body>
                  <Text color="neutral-textLow" fontSize="base">
                    {t('whatsappIntegration.channelsList.assignFunctions')}
                  </Text>
                  
                  <Box marginTop="4">
                    <Box 
                      display="flex" 
                      paddingY="3" 
                      paddingX="4"
                      borderColor="neutral-surfaceHighlight"
                      borderStyle="solid"
                      borderWidth="none"
                      borderBottomWidth="1"
                    >
                      <Box width="25%">
                        <Text fontWeight="medium" color="neutral-textLow">
                          {t('whatsappIntegration.channelsList.columns.number')}
                        </Text>
                      </Box>
                      <Box width="25%" display="flex" alignItems="center" gap="1">
                        <Text fontWeight="medium" color="neutral-textLow">
                          {t('whatsappIntegration.channelsList.columns.quality')}
                        </Text>
                        <Tooltip content={t('whatsappIntegration.channelsList.tooltips.quality')}>
                          <Icon source={<QuestionCircleIcon size={14} />} color="neutral-textLow" />
                        </Tooltip>
                      </Box>
                      <Box width="25%" display="flex" alignItems="center" gap="1">
                        <Text fontWeight="medium" color="neutral-textLow">
                          {t('whatsappIntegration.channelsList.columns.automatedMessages')}
                        </Text>
                        <Tooltip content={t('whatsappIntegration.channelsList.tooltips.automatedMessages')}>
                          <Icon source={<QuestionCircleIcon size={14} />} color="neutral-textLow" />
                        </Tooltip>
                      </Box>
                      <Box width="25%" display="flex" alignItems="center" gap="1">
                        <Text fontWeight="medium" color="neutral-textLow">
                          {t('whatsappIntegration.channelsList.columns.showButton')}
                        </Text>
                        <Tooltip content={t('whatsappIntegration.channelsList.tooltips.showButton')}>
                          <Icon source={<QuestionCircleIcon size={14} />} color="neutral-textLow" />
                        </Tooltip>
                      </Box>
                    </Box>

                    {channels.map((channel, index) => (
                      <Box 
                        key={`${channel.username}-${index}`}
                        display="flex" 
                        paddingY="4" 
                        paddingX="4"
                        alignItems="center"
                        borderColor="neutral-surfaceHighlight"
                        borderStyle="solid"
                        borderWidth="none"
                        borderBottomWidth="1"
                      >
                        <Box width="25%">
                          <Text fontWeight="medium">{channel.username}</Text>
                        </Box>
                        <Box width="25%">
                          <Tag appearance="success">
                            {t('whatsappIntegration.channelsList.quality.good')}
                          </Tag>
                        </Box>
                        <Box width="25%">
                          <Toggle 
                            name={`automated-${channel.username}`}
                            active={channel.marketingAutomationEnabled}
                            onChange={() => handleToggleAutomatedMessages(channel)}
                          />
                        </Box>
                        <Box width="25%">
                          <Toggle 
                            name={`chat-${channel.username}`}
                            active={channel.chatEnabled}
                            onChange={() => handleToggleChat(channel)}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Card.Body>
              </Card>

              <Box display="flex" gap="4">
                <Card style={{ flex: 1 }}>
                  <Card.Body>
                    <Box display="flex" flexDirection="column" gap="3">
                      <Title as="h4">{t('whatsappIntegration.channelsList.chat.title')}</Title>
                      <Text color="neutral-textLow">
                        {t('whatsappIntegration.channelsList.chat.description')}
                      </Text>
                      <Link as="a" href="#" appearance="primary">
                        {t('whatsappIntegration.channelsList.chat.link')}
                      </Link>
                    </Box>
                  </Card.Body>
                </Card>

                <Card style={{ flex: 1 }}>
                  <Card.Body>
                    <Box display="flex" flexDirection="column" gap="3">
                      <Title as="h4">{t('whatsappIntegration.channelsList.automatedMessages.title')}</Title>
                      <Text color="neutral-textLow">
                        {t('whatsappIntegration.channelsList.automatedMessages.description')}
                      </Text>
                      <Link as="a" href="/configurations" appearance="primary">
                        {t('whatsappIntegration.channelsList.automatedMessages.link')}
                      </Link>
                    </Box>
                  </Card.Body>
                </Card>
              </Box>
            </Box>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};
