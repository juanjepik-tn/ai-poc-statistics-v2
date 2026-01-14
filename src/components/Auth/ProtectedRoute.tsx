import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Text } from '@nimbus-ds/components';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Autenticación habilitada - requiere email @tiendanube.com o @nuvemshop.com
const BYPASS_AUTH = false;

/**
 * Componente que protege rutas requiriendo autenticación.
 * Si el usuario no está autenticado, redirige a /login.
 * Mientras se verifica la autenticación, muestra un spinner.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // TEMPORAL: Bypass de autenticación para debugging
  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap="4"
        backgroundColor="neutral-background"
      >
        <Spinner size="large" />
        <Text color="neutral-textLow">Verificando acceso...</Text>
      </Box>
    );
  }

  // Si no está autenticado, redirigir a login guardando la ubicación actual
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;

