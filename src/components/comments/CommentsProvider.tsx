/**
 * Comments Provider
 * Context + lógica de localStorage para el sistema de comentarios
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  Comment,
  Reply,
  CommentFilter,
  CommentsContextValue,
  ContextMenuPosition,
  CommentPosition,
} from './comments.types';

// Storage keys
const STORAGE_KEYS = {
  COMMENTS: 'poc_comments',
  USER_NAME: 'poc_commenter_name',
  USER_COLOR: 'poc_commenter_color',
};

// Available colors for user avatars
const AVATAR_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#59A9FF', // Light Blue
  '#00965E', // Green
  '#FF7A27', // Orange
];

// Generate a random color for user avatar
const getRandomColor = (): string => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create context with undefined default value
const CommentsContext = createContext<CommentsContextValue | undefined>(
  undefined
);

interface CommentsProviderProps {
  children: ReactNode;
}

export const CommentsProvider: React.FC<CommentsProviderProps> = ({
  children,
}) => {
  const location = useLocation();

  // State
  const [comments, setComments] = useState<Comment[]>([]);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [userColor, setUserColor] = useState<string>('');
  const [filter, setFilter] = useState<CommentFilter>('page');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  
  // Comment form popup state (triggered by double-click)
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [commentFormPosition, setCommentFormPosition] = useState<ContextMenuPosition | null>(null);
  const [pendingCommentPosition, setPendingCommentPosition] = useState<CommentPosition | null>(null);

  // Current page ID from URL hash or pathname
  const currentPageId = useMemo(() => {
    const hash = location.hash.replace('#/', '') || 'home';
    const path = location.pathname.replace(/^\//, '') || 'home';
    return hash !== '' ? hash : path;
  }, [location.hash, location.pathname]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load comments
      const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }

      // Load user name
      const storedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      if (storedName) {
        setUserNameState(storedName);
      } else {
        // Show modal to ask for name if not set
        setIsNameModalOpen(true);
      }

      // Load or generate user color
      const storedColor = localStorage.getItem(STORAGE_KEYS.USER_COLOR);
      if (storedColor) {
        setUserColor(storedColor);
      } else {
        const newColor = getRandomColor();
        setUserColor(newColor);
        localStorage.setItem(STORAGE_KEYS.USER_COLOR, newColor);
      }
    } catch (error) {
      console.error('[Comments] Error loading from localStorage:', error);
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    } catch (error) {
      console.error('[Comments] Error saving to localStorage:', error);
    }
  }, [comments]);

  // Set user name
  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    setIsNameModalOpen(false);
  }, []);

  // Add a new comment
  const addComment = useCallback(
    (text: string) => {
      if (!userName || !text.trim()) return;

      const newComment: Comment = {
        id: generateId(),
        text: text.trim(),
        author: userName,
        pageId: currentPageId,
        timestamp: new Date().toISOString(),
        resolved: false,
        replies: [],
        color: userColor,
        position: pendingCommentPosition || undefined,
      };

      setComments((prev) => [newComment, ...prev]);
      setPendingCommentPosition(null);
    },
    [userName, currentPageId, userColor, pendingCommentPosition]
  );

  // Add a reply to a comment
  const addReply = useCallback(
    (commentId: string, text: string) => {
      if (!userName || !text.trim()) return;

      const newReply: Reply = {
        id: generateId(),
        text: text.trim(),
        author: userName,
        timestamp: new Date().toISOString(),
        color: userColor,
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
    },
    [userName, userColor]
  );

  // Toggle resolved status
  const resolveComment = useCallback((commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, resolved: !comment.resolved }
          : comment
      )
    );
  }, []);

  // Delete a comment
  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  }, []);

  // Panel controls
  const togglePanel = useCallback(() => setIsPanelOpen((prev) => !prev), []);
  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  // Name modal controls
  const openNameModal = useCallback(() => setIsNameModalOpen(true), []);
  const closeNameModal = useCallback(() => setIsNameModalOpen(false), []);

  // Comment form controls (triggered by double-click)
  const openCommentFormAtPosition = useCallback(
    (screenPos: ContextMenuPosition, commentPos: CommentPosition) => {
      setCommentFormPosition(screenPos);
      setPendingCommentPosition(commentPos);
      setIsCommentFormOpen(true);
    },
    []
  );

  const closeCommentForm = useCallback(() => {
    setIsCommentFormOpen(false);
    setCommentFormPosition(null);
    setPendingCommentPosition(null);
  }, []);

  // Get filtered comments based on current filter
  const getFilteredComments = useCallback(() => {
    let filtered = [...comments];

    switch (filter) {
      case 'page':
        filtered = filtered.filter((c) => c.pageId === currentPageId);
        break;
      case 'open':
        filtered = filtered.filter((c) => !c.resolved);
        break;
      case 'closed':
        filtered = filtered.filter((c) => c.resolved);
        break;
      case 'all':
      default:
        // No filter
        break;
    }

    // Sort: open first, then by timestamp (newest first)
    return filtered.sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [comments, filter, currentPageId]);

  // Get count of open comments
  const getOpenCommentsCount = useCallback(() => {
    return comments.filter((c) => !c.resolved).length;
  }, [comments]);

  // Context value
  const contextValue: CommentsContextValue = {
    comments,
    userName,
    currentPageId,
    filter,
    isPanelOpen,
    isNameModalOpen,
    // Comment form popup state
    isCommentFormOpen,
    commentFormPosition,
    pendingCommentPosition,
    // Actions
    setUserName,
    addComment,
    addReply,
    resolveComment,
    deleteComment,
    setFilter,
    togglePanel,
    openPanel,
    closePanel,
    openNameModal,
    closeNameModal,
    getFilteredComments,
    getOpenCommentsCount,
    // Comment form actions
    openCommentFormAtPosition,
    closeCommentForm,
  };

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  );
};

// Hook to use comments context
export const useCommentsContext = (): CommentsContextValue => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error(
      'useCommentsContext must be used within a CommentsProvider'
    );
  }
  return context;
};

export default CommentsProvider;

