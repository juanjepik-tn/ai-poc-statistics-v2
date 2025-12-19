/**
 * Comments System
 * Componente principal que incluye todos los elementos del sistema de comentarios
 * Requiere que el usuario esté autenticado con Google
 */

import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import CommentsToggleButton from './CommentsToggleButton';
import CommentsPanel from './CommentsPanel';
import CommentFormPopup from './CommentFormPopup';
import CommentMarkers from './CommentMarkers';
import { useComments } from './useComments';

/**
 * Renderiza el botón flotante, el panel lateral y popup de comentario
 * Debe usarse dentro de CommentsProvider
 * Requiere autenticación con Google para comentar
 * 
 * - Doble click: Abre formulario de comentario en esa posición
 * - Click derecho: Comportamiento normal del navegador
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
        toast.info('Inicia sesión con Google para dejar comentarios');
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

