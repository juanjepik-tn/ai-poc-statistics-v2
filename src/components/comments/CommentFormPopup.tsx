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

  if (!isCommentFormOpen || !commentFormPosition) {
    return null;
  }

  // Calculate position to keep popup in viewport
  const popupWidth = 320;
  const popupHeight = 280;
  const x = Math.max(20, Math.min(commentFormPosition.x, window.innerWidth - popupWidth - 20));
  const y = Math.max(20, Math.min(commentFormPosition.y, window.innerHeight - popupHeight - 20));

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 99998,
        }}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div
        ref={popupRef as React.RefObject<HTMLDivElement>}
        data-comments-ui="true"
        style={{
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          width: '320px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '20px',
          zIndex: 99999,
          border: '2px solid #3b82f6',
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
      </div>
    </>
  );
};

export default CommentFormPopup;

