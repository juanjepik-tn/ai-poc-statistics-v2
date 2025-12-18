/**
 * Comments System
 * Sistema de comentarios para feedback en pantallas del POC UI Playground
 */

// Types
export type {
  Comment,
  Reply,
  CommentFilter,
  CommentsContextValue,
  ContextMenuPosition,
  CommentPosition,
} from './comments.types';

// Provider and Hook
export { CommentsProvider, useCommentsContext } from './CommentsProvider';
export { useComments } from './useComments';

// Components
export { default as CommentsToggleButton } from './CommentsToggleButton';
export { default as CommentsPanel } from './CommentsPanel';
export { default as CommentItem } from './CommentItem';
export { default as CommentForm } from './CommentForm';
export { default as NameModal } from './NameModal';
export { default as CommentFormPopup } from './CommentFormPopup';

// Main wrapper component that includes all pieces
export { default as CommentsSystem } from './CommentsSystem';

