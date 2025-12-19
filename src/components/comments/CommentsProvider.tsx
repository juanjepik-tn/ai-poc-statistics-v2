/**
 * Comments Provider
 * Context + integración con Supabase para el sistema de comentarios
 * Usa datos del usuario autenticado con Google
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
import { useAuth } from '@/contexts/AuthContext';
import {
  Comment,
  Reply,
  CommentFilter,
  CommentsContextValue,
  ContextMenuPosition,
  CommentPosition,
} from './comments.types';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteCommentById,
  subscribeToComments,
} from './commentsService';

// Storage key for user color preference
const USER_COLOR_KEY = 'poc_commenter_color';

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
  const { user, isAuthenticated } = useAuth();

  // Get user info from Auth
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || null;
  const userEmail = user?.email || null;
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  // State
  const [comments, setComments] = useState<Comment[]>([]);
  const [userColor, setUserColor] = useState<string>('');
  const [filter, setFilter] = useState<CommentFilter>('page');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Comment form popup state (triggered by double-click)
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [commentFormPosition, setCommentFormPosition] = useState<ContextMenuPosition | null>(null);
  const [pendingCommentPosition, setPendingCommentPosition] = useState<CommentPosition | null>(null);

  // Track hash changes (including manual updates via replaceState + dispatchEvent)
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Current page ID from URL - combines pathname, hash, and hash query params for uniqueness
  const currentPageId = useMemo(() => {
    const parts: string[] = [];
    
    // Add pathname (without leading slash)
    const path = location.pathname.replace(/^\//, '');
    if (path) {
      parts.push(path);
    }
    
    // Parse hash - may contain query params (e.g., #/statistics?tab=sales)
    // Use currentHash state instead of location.hash for reactivity
    const fullHash = currentHash;
    const hashParts = fullHash.split('?');
    const hashPath = hashParts[0].replace('#/', '').replace('#', '');
    const hashParams = hashParts[1] || '';
    
    if (hashPath) {
      parts.push(hashPath);
    }
    
    // Add hash query params for tab differentiation (e.g., tab=sales)
    if (hashParams) {
      parts.push(hashParams);
    }
    
    // Also check regular search params
    if (location.search) {
      parts.push(location.search.replace('?', ''));
    }
    
    return parts.join('/') || 'home';
  }, [location.pathname, currentHash, location.search]);

  // Load comments from Supabase on mount
  useEffect(() => {
    const loadComments = async () => {
      console.log('[Comments] Loading from Supabase...');
      setIsLoading(true);
      const data = await fetchComments();
      setComments(data);
      setIsLoading(false);
      console.log('[Comments] Loaded', data.length, 'comments');
    };

    loadComments();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    console.log('[Comments] Setting up real-time subscription...');
    
    const unsubscribe = subscribeToComments(
      // On insert
      (newComment) => {
        setComments((prev) => {
          // Avoid duplicates
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return [newComment, ...prev];
        });
      },
      // On update
      (updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
        );
      },
      // On delete
      (deletedId) => {
        setComments((prev) => prev.filter((c) => c.id !== deletedId));
      }
    );

    return () => {
      console.log('[Comments] Cleaning up subscription...');
      unsubscribe();
    };
  }, []);

  // Load user color preference from localStorage
  useEffect(() => {
    try {
      const storedColor = localStorage.getItem(USER_COLOR_KEY);
      if (storedColor) {
        setUserColor(storedColor);
      } else {
        const newColor = getRandomColor();
        setUserColor(newColor);
        localStorage.setItem(USER_COLOR_KEY, newColor);
      }
    } catch (error) {
      console.error('[Comments] Error loading user color:', error);
    }
  }, []);

  // Add a new comment
  const addComment = useCallback(
    async (text: string) => {
      if (!userName || !text.trim() || !isAuthenticated) return;

      const newComment: Comment = {
        id: generateId(),
        text: text.trim(),
        author: userName,
        authorEmail: userEmail || undefined,
        avatarUrl: userAvatarUrl || undefined,
        pageId: currentPageId,
        timestamp: new Date().toISOString(),
        resolved: false,
        replies: [],
        color: userColor,
        position: pendingCommentPosition || undefined,
      };

      // Optimistic update
      setComments((prev) => [newComment, ...prev]);
      setPendingCommentPosition(null);

      // Save to Supabase
      const saved = await createComment(newComment);
      if (!saved) {
        console.error('[Comments] Failed to save comment, reverting...');
        setComments((prev) => prev.filter((c) => c.id !== newComment.id));
      }
    },
    [userName, userEmail, userAvatarUrl, isAuthenticated, currentPageId, userColor, pendingCommentPosition]
  );

  // Add a reply to a comment
  const addReply = useCallback(
    async (commentId: string, text: string) => {
      if (!userName || !text.trim() || !isAuthenticated) return;

      const newReply: Reply = {
        id: generateId(),
        text: text.trim(),
        author: userName,
        authorEmail: userEmail || undefined,
        avatarUrl: userAvatarUrl || undefined,
        timestamp: new Date().toISOString(),
        color: userColor,
      };

      // Find the comment to update
      const commentToUpdate = comments.find((c) => c.id === commentId);
      if (!commentToUpdate) return;

      const updatedComment = {
        ...commentToUpdate,
        replies: [...commentToUpdate.replies, newReply],
      };

      // Optimistic update
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );

      // Save to Supabase
      const saved = await updateComment(updatedComment);
      if (!saved) {
        console.error('[Comments] Failed to save reply, reverting...');
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? commentToUpdate : c))
        );
      }
    },
    [userName, userEmail, userAvatarUrl, isAuthenticated, userColor, comments]
  );

  // Toggle resolved status
  const resolveComment = useCallback(
    async (commentId: string) => {
      const commentToUpdate = comments.find((c) => c.id === commentId);
      if (!commentToUpdate) return;

      const updatedComment = {
        ...commentToUpdate,
        resolved: !commentToUpdate.resolved,
      };

      // Optimistic update
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );

      // Save to Supabase
      const saved = await updateComment(updatedComment);
      if (!saved) {
        console.error('[Comments] Failed to update comment, reverting...');
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? commentToUpdate : c))
        );
      }
    },
    [comments]
  );

  // Delete a comment
  const deleteComment = useCallback(
    async (commentId: string) => {
      const commentToDelete = comments.find((c) => c.id === commentId);
      if (!commentToDelete) return;

      // Optimistic update
      setComments((prev) => prev.filter((c) => c.id !== commentId));

      // Delete from Supabase
      const deleted = await deleteCommentById(commentId);
      if (!deleted) {
        console.error('[Comments] Failed to delete comment, reverting...');
        setComments((prev) => [commentToDelete, ...prev]);
      }
    },
    [comments]
  );

  // Panel controls
  const togglePanel = useCallback(() => setIsPanelOpen((prev) => !prev), []);
  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

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
    // User info from Auth
    userName,
    userEmail,
    userAvatarUrl,
    isAuthenticated,
    // State
    currentPageId,
    filter,
    isPanelOpen,
    isLoading,
    // Comment form popup state
    isCommentFormOpen,
    commentFormPosition,
    pendingCommentPosition,
    // Actions
    addComment,
    addReply,
    resolveComment,
    deleteComment,
    setFilter,
    togglePanel,
    openPanel,
    closePanel,
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
