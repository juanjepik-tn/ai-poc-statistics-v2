import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isAllowedDomain, ALLOWED_DOMAINS, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured); // Skip loading if Supabase not configured
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Validar dominio del usuario y hacer sign out si no es permitido
  const validateUserDomain = useCallback(async (currentUser: User | null) => {
    if (!currentUser?.email) return false;

    if (!isAllowedDomain(currentUser.email)) {
      await supabase.auth.signOut();
      setError(
        `Solo se permiten emails @${ALLOWED_DOMAINS.join(' y @')}. Tu email (${currentUser.email}) no tiene acceso.`
      );
      setUser(null);
      setSession(null);
      return false;
    }

    return true;
  }, []);

  // Escuchar cambios de autenticación
  useEffect(() => {
    // If Supabase is not configured, skip auth initialization
    if (!isSupabaseConfigured) {
      console.info('[POC Mode] Skipping Supabase auth initialization - running in offline mode');
      return;
    }

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession?.user) {
          const isValid = await validateUserDomain(initialSession.user);
          if (isValid) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Suscribirse a cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_IN' && currentSession?.user) {
        const isValid = await validateUserDomain(currentSession.user);
        if (isValid) {
          setSession(currentSession);
          setUser(currentSession.user);
          setError(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && currentSession) {
        setSession(currentSession);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [validateUserDomain]);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      console.warn('[POC Mode] Supabase not configured - sign in disabled');
      setError('Autenticación no disponible en modo POC');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      console.warn('[POC Mode] Supabase not configured - sign out disabled');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      setUser(null);
      setSession(null);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: !!user && !!session,
      error,
      signInWithGoogle,
      signOut,
      clearError,
    }),
    [user, session, isLoading, error, signInWithGoogle, signOut, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;

