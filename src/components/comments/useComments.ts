/**
 * useComments Hook
 * Hook para consumir el CommentsContext
 * 
 * Este hook abstrae la lógica de persistencia, facilitando el cambio
 * de localStorage a Supabase en el futuro.
 */

import { useCommentsContext } from './CommentsProvider';
import type { CommentsContextValue } from './comments.types';

/**
 * Hook para acceder al sistema de comentarios
 * @returns CommentsContextValue con todas las funciones y estado del sistema
 * 
 * @example
 * ```tsx
 * const { comments, addComment, togglePanel } = useComments();
 * ```
 */
export const useComments = (): CommentsContextValue => {
  return useCommentsContext();
};

export default useComments;

