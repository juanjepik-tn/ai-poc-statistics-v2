import React, { useState } from 'react';
import { Box, Icon, Link, Text } from '@nimbus-ds/components';
import { ChevronDownIcon, ChevronUpIcon } from '@nimbus-ds/icons';

export interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Box display="flex" flexDirection="column" gap="3" width="100%">
      <Box display="flex" justifyContent="center">
        <Link
          as="button"
          appearance="primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Box display="flex" alignItems="center" gap="1">
            <Text fontSize="caption">{title}</Text>
            <Icon 
              source={isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />} 
              color="currentColor" 
            />
          </Box>
        </Link>
      </Box>
      
      {isExpanded && (
        <Box
          display="flex"
          flexDirection="column"
          gap="3"
          padding="3"
          backgroundColor="neutral-surface"
          borderRadius="base"
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default ExpandableSection;
