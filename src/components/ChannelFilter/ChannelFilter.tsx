import React from 'react';
import { Box, Select, Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { ChannelType } from '@/types/conversation';

export type ChannelFilterValue = 'all' | ChannelType;

export interface ChannelFilterProps {
  value: ChannelFilterValue;
  onChange: (value: ChannelFilterValue) => void;
  disabled?: boolean;
  availableChannels: ChannelType[];
  showLabel?: boolean;
}

interface FilterOption {
  value: ChannelFilterValue;
  labelKey: string;
  icon: ChannelType | null;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', labelKey: 'channelFilter.all', icon: null },
  { value: 'whatsapp', labelKey: 'channelFilter.whatsapp', icon: 'whatsapp' },
  { value: 'instagram', labelKey: 'channelFilter.instagram', icon: 'instagram' },
  { value: 'facebook', labelKey: 'channelFilter.facebook', icon: 'facebook' },
];

export const ChannelFilter: React.FC<ChannelFilterProps> = ({
  value,
  onChange,
  disabled = false,
  availableChannels,
  showLabel = false,
}) => {
  const { t } = useTranslation('translations');

  // Don't show filter if only 1 channel is available
  if (availableChannels.length <= 1) {
    return null;
  }

  // Filter options to only show 'all' + available channels
  const options = FILTER_OPTIONS.filter(
    (opt) => opt.value === 'all' || availableChannels.includes(opt.value as ChannelType)
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as ChannelFilterValue);
  };

  return (
    <Box display="flex" alignItems="center" gap="2">
      {showLabel && (
        <Text fontSize="caption" color="neutral-textLow">
          {t('channelFilter.label', 'Canal')}:
        </Text>
      )}
      <Box position="relative" display="flex" alignItems="center">
        <Select
          id="channel-filter"
          name="channel-filter"
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          {options.map((opt) => {
            const getDefaultLabel = (val: string) => {
              if (val === 'all') return 'Todos los canales';
              if (val === 'whatsapp') return 'WhatsApp';
              if (val === 'instagram') return 'Instagram';
              if (val === 'facebook') return 'Facebook Messenger';
              return val;
            };
            return (
              <Select.Option 
                key={opt.value} 
                value={opt.value}
                label={t(opt.labelKey, getDefaultLabel(opt.value))}
              />
            );
          })}
        </Select>
      </Box>
    </Box>
  );
};

export default ChannelFilter;

