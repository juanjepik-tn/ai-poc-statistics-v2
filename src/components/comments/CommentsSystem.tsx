/**
 * Comments System
 * Componente principal que inclui todos os elementos do sistema de comentários
 * Requer que o usuário esteja autenticado com Google
 */

import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import CommentsToggleButton from './CommentsToggleButton';
import CommentsPanel from './CommentsPanel';
import CommentFormPopup from './CommentFormPopup';
import CommentMarkers from './CommentMarkers';
import { useComments } from './useComments';

/**
 * Renderiza o botão flutuante, o painel lateral e popup de comentário
 * Deve ser usado dentro de CommentsProvider
 * Requer autenticação com Google para comentar
 * 
 * - Duplo clique: Abre formulário de comentário nessa posição
 * - Clique direito: Comportamento normal do navegador
 */
const CommentsSystem: React.FC = () => {
  const { openCommentFormAtPosition, closeCommentForm, isAuthenticated } = useComments();

  // Check if target is an interactive element (only direct targets, not ancestors)
  const isInteractiveElement = useCallback((target: HTMLElement): boolean => {
    const tagName = target.tagName.toLowerCase();
    // Only block on actual form elements and links
    if (['input', 'textarea', 'select', 'a', 'button'].includes(tagName)) {
      return true;
    }
    // Block on elements with specific roles or data attributes
    if (target.getAttribute('role') === 'button' || target.hasAttribute('data-no-comment')) {
      return true;
    }
    // Block if inside the comments panel
    if (target.closest('.comments-panel') || target.closest('[data-comments-ui]')) {
      return true;
    }
    return false;
  }, []);

  // Handle double-click to open comment form directly
  useEffect(() => {
    const handleDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (isInteractiveElement(target)) {
        return; // Don't interfere with interactive elements
      }

      // Prevent text selection on double click
      event.preventDefault();
      window.getSelection()?.removeAllRanges();

      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.info('Faça login com Google para deixar comentários');
        return;
      }

      // Calculate position as absolute pixels (including scroll)
      // This ensures the marker stays with the content when scrolling
      const commentPosition = {
        x: event.pageX,
        y: event.pageY,
      };

      // Screen position for the popup
      const screenPosition = {
        x: event.clientX,
        y: event.clientY,
      };

      openCommentFormAtPosition(screenPosition, commentPosition);
    };

    document.addEventListener('dblclick', handleDoubleClick);

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [openCommentFormAtPosition, isAuthenticated, isInteractiveElement]);

  // Close comment form on scroll
  useEffect(() => {
    const handleScroll = () => {
      closeCommentForm();
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [closeCommentForm]);

  return (
    <>
      <CommentMarkers />
      <CommentsToggleButton />
      <CommentsPanel />
      <CommentFormPopup />
    </>
  );
};

export default CommentsSystem;

