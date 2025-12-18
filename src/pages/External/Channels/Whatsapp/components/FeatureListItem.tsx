import { Box, Icon, Text } from '@nimbus-ds/components';
import { CheckCircleIcon, CloseIcon } from '@nimbus-ds/icons';

type FeatureListItemProps = {
  text: string;
  enabled: boolean;
};

export const FeatureListItem = ({ text, enabled }: FeatureListItemProps) => {
  return (
    <Box display="flex" flexDirection="row" gap="2" alignItems="flex-start">
      <Box paddingTop="0-5">
        {enabled ? (
          <Icon source={<CheckCircleIcon />} color="success-interactive" />
        ) : (
          <Icon source={<CloseIcon />} color="neutral-textDisabled" />
        )}
      </Box>
      <Text
        color={enabled ? 'neutral-textHigh' : 'neutral-textDisabled'}
        fontSize="base"
        style={enabled ? undefined : { textDecoration: 'line-through' }}
      >
        {text}
      </Text>
    </Box>
  );
};

