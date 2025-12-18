import { Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { getTagTranslation } from '@/hooks';

/**
 * Reusable component to display translated tag names with automatic fallback
 * 
 * This component uses the getTagTranslation function to translate tag names.
 * When a tag doesn't have a translation, it automatically shows the last segment
 * of the tag name instead of the full translation key.
 * 
 * @param tagName - The name of the tag to translate and display
 * @param textProps - Additional props to pass to the underlying Text component (excluding children)
 * 
 * @example
 * <TagText tagName="Necesita atención" color="warning-textLow" fontSize="caption" />
 * <TagText tagName="Cambios y devoluciones" color="neutral-textLow" fontSize="caption" lineClamp={1} />
 */
export const TagText = ({ 
  tagName, 
  ...textProps 
}: { 
  tagName: string 
} & Omit<React.ComponentProps<typeof Text>, 'children'>) => {
  const { t } = useTranslation('translations');
  return <Text {...textProps}>{getTagTranslation(t, tagName)}</Text>;
};

