/**
 * Comment Form Popup Component
 * Popup flotante para agregar comentarios desde doble click
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Button, Textarea } from '@nimbus-ds/components';
import { useComments } from './useComments';

const CommentFormPopup: React.FC = () => {
  const {
    isCommentFormOpen,
    commentFormPosition,
    pendingCommentPosition,
    closeCommentForm,
    addComment,
    currentPageId,
  } = useComments();
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when opened
  useEffect(() => {
    if (isCommentFormOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isCommentFormOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isCommentFormOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCommentFormOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isCommentFormOpen) {
      // Delay to avoid immediate close
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCommentFormOpen]);

  const handleClose = () => {
    setText('');
    setHasError(false);
    closeCommentForm();
  };

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setHasError(true);
      return;
    }
    addComment(trimmedText);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  console.log('[CommentFormPopup] Render state:', { isCommentFormOpen, commentFormPosition });
  
  if (!isCommentFormOpen || !commentFormPosition) {
    console.log('[CommentFormPopup] Not showing - conditions not met');
    return null;
  }

  console.log('[CommentFormPopup] Showing popup!');
  
  // Calculate position to keep popup in viewport
  const popupWidth = 320;
  const popupHeight = 200;
  const x = Math.min(commentFormPosition.x, window.innerWidth - popupWidth - 20);
  const y = Math.min(commentFormPosition.y, window.innerHeight - popupHeight - 20);

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="1100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
      />
      
      {/* Popup */}
      <Box
        ref={popupRef}
        data-comments-ui="true"
        position="fixed"
        backgroundColor="neutral-background"
        borderRadius="2"
        boxShadow="2"
        padding="4"
        zIndex="1200"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: '300px',
          border: '1px solid var(--nimbus-colors-neutral-surface-highlight)',
        }}
      >
        {/* Header */}
        <Box marginBottom="3">
          <Text fontSize="caption" color="neutral-textLow">
            📍 Comentario en: <Text as="span" fontWeight="medium" color="neutral-textHigh">{currentPageId}</Text>
          </Text>
          {pendingCommentPosition && (
            <Text fontSize="caption" color="neutral-textDisabled">
              Posición: x:{pendingCommentPosition.x}% y:{pendingCommentPosition.y}%
            </Text>
          )}
        </Box>

        {/* Textarea */}
        <Box marginBottom="3">
          <Textarea
            id="popup-comment-input"
            name="comment"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={hasError ? '⚠️ Escribe algo...' : 'Escribe tu comentario...'}
            rows={3}
            appearance={hasError ? 'danger' : undefined}
          />
        </Box>

        {/* Actions */}
        <Box display="flex" gap="2" justifyContent="flex-end">
          <Button appearance="transparent" onClick={handleClose}>
            <Text fontSize="caption">Cancelar</Text>
          </Button>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            <Text fontSize="caption" color="neutral-background">
              Publicar
            </Text>
          </Button>
        </Box>

        {/* Tip */}
        <Box marginTop="2">
          <Text fontSize="caption" color="neutral-textDisabled" textAlign="right">
            Cmd/Ctrl + Enter para enviar
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default CommentFormPopup;

