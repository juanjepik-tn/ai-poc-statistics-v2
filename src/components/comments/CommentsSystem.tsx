/**
 * Comments System
 * Componente principal que incluye todos los elementos del sistema de comentarios
 */

import React, { useEffect, useCallback } from 'react';
import CommentsToggleButton from './CommentsToggleButton';
import CommentsPanel from './CommentsPanel';
import NameModal from './NameModal';
import CommentFormPopup from './CommentFormPopup';
import { useComments } from './useComments';

/**
 * Renderiza el botón flotante, el panel lateral, modal de nombre y popup de comentario
 * Debe usarse dentro de CommentsProvider
 * 
 * - Doble click: Abre formulario de comentario en esa posición
 * - Click derecho: Comportamiento normal del navegador
 */
const CommentsSystem: React.FC = () => {
  const { openCommentFormAtPosition, closeCommentForm, userName, openNameModal } = useComments();

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
      console.log('[Comments] Double click detected', { x: event.clientX, y: event.clientY });
      
      const target = event.target as HTMLElement;
      
      if (isInteractiveElement(target)) {
        console.log('[Comments] Ignoring - interactive element');
        return; // Don't interfere with interactive elements
      }

      // Prevent text selection on double click
      event.preventDefault();
      window.getSelection()?.removeAllRanges();

      // Check if user has a name set
      if (!userName) {
        console.log('[Comments] No username, opening modal');
        openNameModal();
        return;
      }

      // Calculate position as percentage of viewport
      const commentPosition = {
        x: Math.round((event.clientX / window.innerWidth) * 100),
        y: Math.round((event.clientY / window.innerHeight) * 100),
      };

      // Screen position for the popup
      const screenPosition = {
        x: event.clientX,
        y: event.clientY,
      };

      console.log('[Comments] Opening comment form at', screenPosition, commentPosition);
      openCommentFormAtPosition(screenPosition, commentPosition);
    };

    document.addEventListener('dblclick', handleDoubleClick);

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [openCommentFormAtPosition, userName, openNameModal, isInteractiveElement]);

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
      <CommentsToggleButton />
      <CommentsPanel />
      <NameModal />
      <CommentFormPopup />
    </>
  );
};

export default CommentsSystem;

