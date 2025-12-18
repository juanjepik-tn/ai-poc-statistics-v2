/**
 * Comments Toggle Button
 * Botón flotante para abrir/cerrar el panel de comentarios
 */

import React from 'react';
import { Box, Text } from '@nimbus-ds/components';
import { useComments } from './useComments';

const CommentsToggleButton: React.FC = () => {
  const { togglePanel, getOpenCommentsCount, isPanelOpen } = useComments();
  const openCount = getOpenCommentsCount();

  return (
    <Box
      as="button"
      data-comments-ui="true"
      position="fixed"
      right="20px"
      bottom="20px"
      width="56px"
      height="56px"
      borderRadius="full"
      backgroundColor="primary-interactive"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      boxShadow="2"
      zIndex="800"
      onClick={togglePanel}
      style={{
        border: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isPanelOpen ? 'scale(0.95)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = isPanelOpen
          ? 'scale(0.95)'
          : 'scale(1)';
      }}
    >
      {/* Comment Icon */}
      <Text fontSize="highlight" color="neutral-background">
        💬
      </Text>

      {/* Badge with open count */}
      {openCount > 0 && (
        <Box
          position="absolute"
          top="-4px"
          right="-4px"
          minWidth="22px"
          height="22px"
          borderRadius="full"
          backgroundColor="danger-interactive"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="1"
        >
          <Text fontSize="caption" fontWeight="bold" color="neutral-background">
            {openCount > 99 ? '99+' : openCount}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CommentsToggleButton;

