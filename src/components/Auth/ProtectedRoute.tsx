import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Text, Input, Button, Card } from '@nimbus-ds/components';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// POC Mode - use access code instead of full authentication
const POC_MODE = true;
const ACCESS_CODE = 'chatnube2026';
const STORAGE_KEY = 'poc_access_granted';

/**
 * Componente que protege rutas requiriendo autenticación.
 * En modo POC, usa un código de acceso simple.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // POC Mode state
  const [codeInput, setCodeInput] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Check if access was previously granted
  useEffect(() => {
    if (POC_MODE) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setHasAccess(true);
      }
      setCheckingAccess(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setHasAccess(true);
      setError('');
    } else {
      setError('Código incorrecto');
    }
  };

  // POC Mode: Use access code
  if (POC_MODE) {
    if (checkingAccess) {
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
        </Box>
      );
    }

    if (!hasAccess) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          backgroundColor="neutral-background"
          padding="4"
        >
          <Card>
            <Card.Body>
              <Box
                display="flex"
                flexDirection="column"
                gap="4"
                alignItems="center"
                padding="4"
                minWidth="300px"
              >
                <Text fontSize="highlight" fontWeight="bold">
                  NuvemChat POC
                </Text>
                <Text color="neutral-textLow" textAlign="center">
                  Ingresá el código de acceso para continuar
                </Text>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <Box display="flex" flexDirection="column" gap="4" width="100%">
                    <Input
                      type="password"
                      placeholder="Código de acceso"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value);
                        setError('');
                      }}
                    />
                    {error && (
                      <Text color="danger-textLow" fontSize="caption">
                        {error}
                      </Text>
                    )}
                    <Button type="submit" appearance="primary">
                      Ingresar
                    </Button>
                  </Box>
                </form>
              </Box>
            </Card.Body>
          </Card>
        </Box>
      );
    }

    return <>{children}</>;
  }

  // Standard authentication flow
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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

