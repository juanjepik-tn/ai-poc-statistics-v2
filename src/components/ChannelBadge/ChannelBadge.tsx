import React from 'react';
import { Box, Text } from '@nimbus-ds/components';
import { ChannelType } from '@/types/conversation';
import { ChannelIcon } from '../ChannelIcon';

export interface ChannelBadgeProps {
  channel: ChannelType;
  variant?: 'default' | 'compact';
  className?: string;
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  channel,
  variant = 'default',
  className,
}) => {
  // Compact variant: just the icon
  if (variant === 'compact') {
    return <ChannelIcon channel={channel} size="small" className={className} />;
  }

  // Default variant: icon + label in a styled container
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="1"
      padding="1"
      paddingLeft="2"
      paddingRight="2"
      borderRadius="base"
      borderWidth="1"
      borderStyle="solid"
      borderColor="neutral-surfaceHighlight"
      backgroundColor="neutral-surface"
      className={className}
    >
      <ChannelIcon channel={channel} size="small" />
      <Text fontSize="caption" color="neutral-textLow">
        {channel === 'whatsapp' ? 'WhatsApp' : channel === 'instagram' ? 'Instagram' : 'Messenger'}
      </Text>
    </Box>
  );
};

export default ChannelBadge;


