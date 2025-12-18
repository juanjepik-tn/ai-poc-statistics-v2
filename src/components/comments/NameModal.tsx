/**
 * Name Modal Component
 * Modal para pedir el nombre del usuario
 */

import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Button, Input } from '@nimbus-ds/components';
import { useComments } from './useComments';

const NameModal: React.FC = () => {
  const { isNameModalOpen, closeNameModal, setUserName, userName } = useComments();
  const [name, setName] = useState(userName || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNameModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNameModalOpen]);

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
  }, [userName]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      setUserName(trimmedName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      closeNameModal();
    }
  };

  if (!isNameModalOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      backgroundColor="neutral-textHigh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1100"
      onClick={closeNameModal}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <Box
        data-comments-ui="true"
        backgroundColor="neutral-background"
        borderRadius="2"
        padding="6"
        maxWidth="400px"
        width="90%"
        boxShadow="2"
        onClick={(e) => e.stopPropagation()}
      >
        <Box textAlign="center" marginBottom="4">
          <Text fontSize="highlight" marginBottom="2">
            👋
          </Text>
          <Text fontSize="base" fontWeight="bold" color="neutral-textHigh" marginBottom="2">
            ¡Hola!
          </Text>
          <Text fontSize="base" color="neutral-textLow">
            ¿Cómo te llamas? Así sabremos quién deja cada comentario.
          </Text>
        </Box>

        <Box marginBottom="4">
          <Input
            id="commenter-name"
            name="name"
            placeholder="Tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Box>

        <Box display="flex" gap="2" justifyContent="center">
          <Button appearance="transparent" onClick={closeNameModal}>
            <Text color="neutral-textLow">Cancelar</Text>
          </Button>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            <Text color="neutral-background">Continuar</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NameModal;

