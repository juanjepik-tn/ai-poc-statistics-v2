/**
 * Comments Service - Supabase Integration
 * Maneja la persistencia de comentarios en Supabase
 */

import { supabase } from '@/lib/supabase';
import { Comment, Reply } from './comments.types';

// Nombre de la tabla en Supabase
const TABLE_NAME = 'comments';

// Tipo para el registro de Supabase
interface CommentRecord {
  id: string;
  text: string;
  author: string;
  author_email: string | null;
  avatar_url: string | null;
  page_id: string;
  timestamp: string;
  resolved: boolean;
  color: string;
  position_x: number | null;
  position_y: number | null;
  replies: Reply[];
}

// Convertir de formato local a formato Supabase
const toSupabaseRecord = (comment: Comment): CommentRecord => ({
  id: comment.id,
  text: comment.text,
  author: comment.author,
  author_email: comment.authorEmail ?? null,
  avatar_url: comment.avatarUrl ?? null,
  page_id: comment.pageId,
  timestamp: comment.timestamp,
  resolved: comment.resolved,
  color: comment.color,
  position_x: comment.position?.x ?? null,
  position_y: comment.position?.y ?? null,
  replies: comment.replies,
});

// Convertir de formato Supabase a formato local
const fromSupabaseRecord = (record: CommentRecord): Comment => ({
  id: record.id,
  text: record.text,
  author: record.author,
  authorEmail: record.author_email ?? undefined,
  avatarUrl: record.avatar_url ?? undefined,
  pageId: record.page_id,
  timestamp: record.timestamp,
  resolved: record.resolved,
  color: record.color,
  position: record.position_x !== null && record.position_y !== null
    ? { x: record.position_x, y: record.position_y }
    : undefined,
  replies: record.replies || [],
});

/**
 * Obtener todos los comentarios
 */
export const fetchComments = async (): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('[CommentsService] Error fetching comments:', error);
      return [];
    }

    return (data || []).map(fromSupabaseRecord);
  } catch (err) {
    console.error('[CommentsService] Exception fetching comments:', err);
    return [];
  }
};

/**
 * Crear un nuevo comentario
 */
export const createComment = async (comment: Comment): Promise<Comment | null> => {
  try {
    const record = toSupabaseRecord(comment);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error('[CommentsService] Error creating comment:', error);
      return null;
    }

    return fromSupabaseRecord(data);
  } catch (err) {
    console.error('[CommentsService] Exception creating comment:', err);
    return null;
  }
};

/**
 * Actualizar un comentario (para resolver/reabrir o agregar replies)
 */
export const updateComment = async (comment: Comment): Promise<Comment | null> => {
  try {
    const record = toSupabaseRecord(comment);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(record)
      .eq('id', comment.id)
      .select()
      .single();

    if (error) {
      console.error('[CommentsService] Error updating comment:', error);
      return null;
    }

    return fromSupabaseRecord(data);
  } catch (err) {
    console.error('[CommentsService] Exception updating comment:', err);
    return null;
  }
};

/**
 * Eliminar un comentario
 */
export const deleteCommentById = async (commentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('[CommentsService] Error deleting comment:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[CommentsService] Exception deleting comment:', err);
    return false;
  }
};

/**
 * Suscribirse a cambios en tiempo real
 */
export const subscribeToComments = (
  onInsert: (comment: Comment) => void,
  onUpdate: (comment: Comment) => void,
  onDelete: (commentId: string) => void
) => {
  const channel = supabase
    .channel('comments-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLE_NAME },
      (payload) => {
        console.log('[CommentsService] New comment:', payload);
        onInsert(fromSupabaseRecord(payload.new as CommentRecord));
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: TABLE_NAME },
      (payload) => {
        console.log('[CommentsService] Updated comment:', payload);
        onUpdate(fromSupabaseRecord(payload.new as CommentRecord));
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: TABLE_NAME },
      (payload) => {
        console.log('[CommentsService] Deleted comment:', payload);
        onDelete((payload.old as { id: string }).id);
      }
    )
    .subscribe();

  // Retornar función para desuscribirse
  return () => {
    supabase.removeChannel(channel);
  };
};

