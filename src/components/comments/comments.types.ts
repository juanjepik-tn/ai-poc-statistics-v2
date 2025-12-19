/**
 * Comments System Types
 * POC UI Playground - Sistema de comentarios para feedback en pantallas
 */

export interface Reply {
  id: string;
  text: string;
  author: string;
  authorEmail?: string;
  avatarUrl?: string;
  timestamp: string;
  color: string;
}

export interface CommentPosition {
  x: number; // Porcentaje horizontal (0-100)
  y: number; // Porcentaje vertical (0-100)
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorEmail?: string;
  avatarUrl?: string;
  pageId: string; // Identifica la pantalla (conversations, statistics, etc.)
  timestamp: string;
  resolved: boolean;
  replies: Reply[];
  color: string;
  position?: CommentPosition; // Posición donde se hizo doble click
}

export type CommentFilter = 'page' | 'open' | 'closed' | 'all';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface CommentsContextValue {
  comments: Comment[];
  // User info from Auth
  userName: string | null;
  userEmail: string | null;
  userAvatarUrl: string | null;
  isAuthenticated: boolean;
  // State
  currentPageId: string;
  filter: CommentFilter;
  isPanelOpen: boolean;
  isLoading: boolean;
  // Comment form popup state
  isCommentFormOpen: boolean;
  commentFormPosition: ContextMenuPosition | null;
  pendingCommentPosition: CommentPosition | null; // Posición donde se guardará el comentario
  // Actions
  addComment: (text: string) => void;
  addReply: (commentId: string, text: string) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  setFilter: (filter: CommentFilter) => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  getFilteredComments: () => Comment[];
  getOpenCommentsCount: () => number;
  // Comment form actions (triggered by double-click)
  openCommentFormAtPosition: (screenPos: ContextMenuPosition, commentPos: CommentPosition) => void;
  closeCommentForm: () => void;
}

