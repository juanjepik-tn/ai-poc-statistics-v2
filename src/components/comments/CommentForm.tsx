/**
 * Comment Form Component
 * Formulario para crear nuevos comentarios o respuestas
 */

import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Text, Textarea } from '@nimbus-ds/components';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  compact?: boolean;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = 'Escribe tu comentario...',
  submitLabel = 'Publicar',
  compact = false,
  autoFocus = false,
}) => {
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setHasError(true);
      return;
    }
    onSubmit(trimmedText);
    setText('');
    setHasError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit with Cmd/Ctrl + Enter
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    // Cancel with Escape
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="2">
      <Textarea
        id="comment-input"
        name="comment"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={hasError ? '⚠️ Escribe algo...' : placeholder}
        rows={compact ? 2 : 3}
        appearance={hasError ? 'danger' : undefined}
      />
      <Box display="flex" gap="2" justifyContent="flex-end">
        {onCancel && (
          <Button appearance="transparent" onClick={onCancel}>
            <Text fontSize="caption">Cancelar</Text>
          </Button>
        )}
        <Button
          appearance="primary"
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          <Text fontSize="caption" color="neutral-background">
            {submitLabel}
          </Text>
        </Button>
      </Box>
      {!compact && (
        <Text fontSize="caption" color="neutral-textLow" textAlign="right">
          Tip: Cmd/Ctrl + Enter para enviar
        </Text>
      )}
    </Box>
  );
};

export default CommentForm;

