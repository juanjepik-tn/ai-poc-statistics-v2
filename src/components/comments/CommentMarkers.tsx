/**
 * Comment Markers Component
 * Muestra pequeños indicadores en las posiciones donde se dejaron comentarios
 */

import React from 'react';
import { useComments } from './useComments';

const CommentMarkers: React.FC = () => {
  const { comments, currentPageId, openPanel, setFilter } = useComments();

  // Filter comments for current page that have positions
  const markersForCurrentPage = comments.filter(
    (c) => c.pageId === currentPageId && c.position && !c.resolved
  );

  const handleMarkerClick = (commentId: string) => {
    setFilter('page');
    openPanel();
    // Scroll to comment in panel (optional enhancement)
    setTimeout(() => {
      const element = document.querySelector(`[data-comment-id="${commentId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  if (markersForCurrentPage.length === 0) return null;

  return (
    <>
      {markersForCurrentPage.map((comment) => (
        <div
          key={comment.id}
          data-comments-ui="true"
          onClick={() => handleMarkerClick(comment.id)}
          style={{
            position: 'fixed',
            left: `${comment.position!.x}%`,
            top: `${comment.position!.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: comment.color || '#3b82f6',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
            fontWeight: 'bold',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.2)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          }}
          title={`${comment.author}: ${comment.text.substring(0, 50)}${comment.text.length > 50 ? '...' : ''}`}
        >
          {comment.author[0]?.toUpperCase() || '?'}
        </div>
      ))}
    </>
  );
};

export default CommentMarkers;

