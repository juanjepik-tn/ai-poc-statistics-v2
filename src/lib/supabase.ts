import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[POC Mode] Supabase credentials not found. Running without Supabase authentication. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable it.'
  );
}

// Detectar la URL base de la aplicación automáticamente
const getAppUrl = () => {
  // En producción, usar la URL de Vercel o variable de entorno
  if (import.meta.env.VITE_APP_URL) {
    return import.meta.env.VITE_APP_URL;
  }
  
  // Si estamos en Vercel, usar la URL de Vercel
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app')) {
      return window.location.origin;
    }
  }
  
  // Fallback a localhost para desarrollo
  return 'http://localhost:5173';
};

// Create a mock Supabase client for POC mode when credentials are not available
const createMockSupabaseClient = (): SupabaseClient => {
  // Create a chainable mock for query builder
  const createChainableMock = () => {
    const mock: any = {
      select: () => mock,
      insert: () => mock,
      update: () => mock,
      delete: () => mock,
      eq: () => mock,
      neq: () => mock,
      gt: () => mock,
      gte: () => mock,
      lt: () => mock,
      lte: () => mock,
      like: () => mock,
      ilike: () => mock,
      is: () => mock,
      in: () => mock,
      contains: () => mock,
      order: () => mock,
      limit: () => mock,
      range: () => mock,
      single: () => mock,
      maybeSingle: () => mock,
      then: (resolve: (value: any) => void) => resolve({ data: [], error: null }),
    };
    return mock;
  };

  // Create a mock channel for realtime subscriptions
  const createMockChannel = () => ({
    on: () => createMockChannel(),
    subscribe: () => ({ unsubscribe: () => {} }),
    unsubscribe: () => {},
  });

  // Return a minimal mock that won't throw errors
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => createChainableMock(),
    channel: () => createMockChannel(),
    removeChannel: () => {},
  } as unknown as SupabaseClient;
};

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          redirectTo: getAppUrl(),
        },
      }
    )
  : createMockSupabaseClient();

// Dominios permitidos para login
export const ALLOWED_DOMAINS = ['tiendanube.com', 'nuvemshop.com'];

/**
 * Valida si el email pertenece a un dominio permitido
 */
export const isAllowedDomain = (email: string | undefined): boolean => {
  if (!email) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? ALLOWED_DOMAINS.includes(domain) : false;
};

