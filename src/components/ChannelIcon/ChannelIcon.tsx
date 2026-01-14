import React from 'react';
import { Box, Text } from '@nimbus-ds/components';
import { ChannelType } from '@/types/conversation';

export interface ChannelIconProps {
  channel: ChannelType;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

const CHANNEL_CONFIG = {
  whatsapp: {
    icon: '/imgs/whatsapp-icon.svg',
    label: 'WhatsApp',
    alt: 'WhatsApp',
  },
  instagram: {
    icon: '/imgs/instagram-icon.svg',
    label: 'Instagram',
    alt: 'Instagram',
  },
  facebook: {
    icon: '/imgs/facebook-icon.svg',
    label: 'Facebook Messenger',
    alt: 'Facebook Messenger',
  },
};

const SIZE_MAP = {
  small: '18px',
  medium: '24px',
  large: '32px',
};

export const ChannelIcon: React.FC<ChannelIconProps> = ({
  channel,
  size = 'medium',
  showLabel = false,
  className,
}) => {
  const config = CHANNEL_CONFIG[channel];

  if (!config) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" gap="1" className={className}>
      <img
        src={config.icon}
        alt={config.alt}
        style={{
          width: SIZE_MAP[size],
          height: SIZE_MAP[size],
          flexShrink: 0,
        }}
      />
      {showLabel && (
        <Text fontSize="caption" color="neutral-textHigh">
          {config.label}
        </Text>
      )}
    </Box>
  );
};

export default ChannelIcon;


