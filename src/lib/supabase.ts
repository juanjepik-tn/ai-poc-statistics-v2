import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
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

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: getAppUrl(),
    },
  }
);

// Dominios permitidos para login
export const ALLOWED_DOMAINS = ['tiendanube.com', 'nuvemshop.com'];

/**
 * Valida si el email pertenece a un dominio permitido
 */
export const isAllowedDomain = (email: string | undefined): boolean => {
  if (!email) return false;
  const domain = email.split('@')[1];
  return domain ? ALLOWED_DOMAINS.includes(domain) : false;
};

