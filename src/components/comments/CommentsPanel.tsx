/**
 * Comments Panel Component
 * Panel lateral con lista de comentarios y filtros
 */

import React from 'react';
import { Box, Text, Button, IconButton } from '@nimbus-ds/components';
import { CloseIcon } from '@nimbus-ds/icons';
import { CommentFilter } from './comments.types';
import { useComments } from './useComments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

// Filter tab configuration
const FILTER_TABS: { id: CommentFilter; label: string }[] = [
  { id: 'page', label: 'Esta página' },
  { id: 'open', label: 'Abiertos' },
  { id: 'closed', label: 'Cerrados' },
  { id: 'all', label: 'Todos' },
];

// Empty state messages
const EMPTY_MESSAGES: Record<CommentFilter, string> = {
  page: 'No hay comentarios en esta página',
  open: '¡No hay comentarios abiertos! 🎉',
  closed: 'No hay comentarios cerrados',
  all: 'No hay comentarios aún',
};

const CommentsPanel: React.FC = () => {
  const {
    isPanelOpen,
    closePanel,
    filter,
    setFilter,
    currentPageId,
    getFilteredComments,
    addComment,
    userName,
    userAvatarUrl,
    isAuthenticated,
  } = useComments();

  const filteredComments = getFilteredComments();

  // Handle new comment
  const handleAddComment = (text: string) => {
    if (!isAuthenticated) return;
    addComment(text);
  };

  return (
    <>
      {/* Backdrop - overlay sutil */}
      {isPanelOpen && (
        <div
          onClick={closePanel}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            zIndex: 900,
            cursor: 'pointer',
          }}
        />
      )}

      {/* Panel */}
      <Box
        data-comments-ui="true"
        className="comments-panel"
        position="fixed"
        top="0"
        right={isPanelOpen ? '0' : '-400px'}
        width="380px"
        height="100vh"
        backgroundColor="neutral-background"
        zIndex="1000"
        display="flex"
        flexDirection="column"
        style={{
          transition: 'right 0.3s ease',
          maxWidth: '100vw',
          boxShadow: isPanelOpen ? '-4px 0 20px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        {/* Header */}
        <Box
          padding="4"
          backgroundColor="primary-surface"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center" gap="2">
            <Text fontSize="highlight" color="primary-textHigh">
              💬
            </Text>
            <Text fontSize="base" fontWeight="bold" color="primary-textHigh">
              Comentarios
            </Text>
          </Box>
          <IconButton
            source={<CloseIcon />}
            size="2rem"
            onClick={closePanel}
          />
        </Box>

        {/* Current Page Indicator */}
        <Box
          padding="3"
          backgroundColor="neutral-surfaceHighlight"
          borderBottomWidth="1"
          borderStyle="solid"
          borderColor="neutral-surfaceHighlight"
        >
          <Text fontSize="caption" color="neutral-textLow">
            📍 Página actual:{' '}
            <Text as="span" fontWeight="medium" color="neutral-textHigh">
              {currentPageId}
            </Text>
          </Text>
        </Box>

        {/* Filter Tabs */}
        <Box
          display="flex"
          gap="2"
          padding="3"
          borderBottomWidth="1"
          borderStyle="solid"
          borderColor="neutral-surfaceHighlight"
          flexWrap="wrap"
        >
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.id}
              appearance={filter === tab.id ? 'primary' : 'transparent'}
              onClick={() => setFilter(tab.id)}
            >
              <Text
                fontSize="caption"
                color={filter === tab.id ? 'neutral-background' : 'neutral-textLow'}
              >
                {tab.label}
              </Text>
            </Button>
          ))}
        </Box>

        {/* Comments List */}
        <Box
          flex="1"
          overflow="auto"
          padding="4"
          backgroundColor="neutral-surface"
        >
          {filteredComments.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="8"
              gap="2"
            >
              <Text fontSize="highlight">💭</Text>
              <Text
                fontSize="base"
                color="neutral-textLow"
                textAlign="center"
              >
                {EMPTY_MESSAGES[filter]}
              </Text>
              <Text fontSize="caption" color="neutral-textDisabled" textAlign="center">
                Agrega un comentario usando el formulario de abajo
              </Text>
            </Box>
          ) : (
            filteredComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </Box>

        {/* Footer - New Comment Form */}
        <Box
          padding="4"
          borderTopWidth="1"
          borderStyle="solid"
          borderColor="neutral-surfaceHighlight"
          backgroundColor="neutral-background"
        >
          {isAuthenticated && userName ? (
            <>
              <Box marginBottom="2" display="flex" alignItems="center" gap="2">
                {userAvatarUrl ? (
                  <Box
                    width="24px"
                    height="24px"
                    borderRadius="full"
                    style={{ overflow: 'hidden', flexShrink: 0 }}
                  >
                    <img 
                      src={userAvatarUrl} 
                      alt={userName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  </Box>
                ) : null}
                <Text fontSize="caption" color="neutral-textLow">
                  Comentando como{' '}
                  <Text as="span" fontWeight="medium" color="primary-interactive">
                    {userName}
                  </Text>
                </Text>
              </Box>
              <CommentForm onSubmit={handleAddComment} autoFocus={false} />
            </>
          ) : (
            <Box
              padding="3"
              backgroundColor="neutral-surfaceHighlight"
              borderRadius="2"
              textAlign="center"
            >
              <Text fontSize="caption" color="neutral-textLow">
                🔒 Inicia sesión con Google para dejar comentarios
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CommentsPanel;

