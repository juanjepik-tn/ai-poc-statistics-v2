import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Title, Text, Button, Alert, Spinner } from '@nimbus-ds/components';
import { useAuth } from '@/contexts/AuthContext';
import { ALLOWED_DOMAINS } from '@/lib/supabase';

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const NuvemshopLogo: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path
      d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
      fill="#2196F3"
    />
    <path
      d="M32 20c-1.1 0-2.1.3-3 .8-.9-2.8-3.5-4.8-6.5-4.8-3.9 0-7 3.1-7 7 0 .2 0 .4.1.6C13.5 24 12 25.7 12 27.8c0 2.3 1.9 4.2 4.2 4.2H32c2.8 0 5-2.2 5-5s-2.2-5-5-5z"
      fill="white"
    />
  </svg>
);

const LoginPage: React.FC = () => {
  const { signInWithGoogle, isLoading, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta de origen para redirigir después del login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleLogin = async () => {
    clearError();
    await signInWithGoogle();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding="4"
      backgroundColor="neutral-background"
    >
      <Card>
        <Card.Body>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="6"
            padding="6"
            minWidth="320px"
          >
            {/* Logo */}
            <Box display="flex" flexDirection="column" alignItems="center" gap="2">
              <NuvemshopLogo />
              <Title as="h1" textAlign="center">
                POC UI Playground
              </Title>
              <Text color="neutral-textLow" textAlign="center">
                Inicia sesión para continuar
              </Text>
            </Box>

            {/* Error Alert */}
            {error && (
              <Box width="100%">
                <Alert appearance="danger" title="Error de autenticación">
                  {error}
                </Alert>
              </Box>
            )}

            {/* Loading State */}
            {isLoading ? (
              <Box display="flex" flexDirection="column" alignItems="center" gap="4" padding="4">
                <Spinner size="large" />
                <Text color="neutral-textLow">Verificando acceso...</Text>
              </Box>
            ) : (
              <>
                {/* Google Login Button */}
                <Button appearance="primary" onClick={handleGoogleLogin} disabled={isLoading}>
                  <Box display="flex" alignItems="center" gap="2">
                    <GoogleIcon />
                    <Text color="neutral-background" fontWeight="medium">
                      Iniciar sesión con Google
                    </Text>
                  </Box>
                </Button>

                {/* Domain restriction notice */}
                <Box
                  backgroundColor="neutral-surface"
                  borderRadius="2"
                  padding="4"
                  width="100%"
                >
                  <Text fontSize="caption" color="neutral-textLow" textAlign="center">
                    Solo emails{' '}
                    {ALLOWED_DOMAINS.map((domain, index) => (
                      <React.Fragment key={domain}>
                        <Text
                          as="span"
                          fontSize="caption"
                          fontWeight="bold"
                          color="primary-interactive"
                        >
                          @{domain}
                        </Text>
                        {index < ALLOWED_DOMAINS.length - 1 && ' y '}
                      </React.Fragment>
                    ))}
                  </Text>
                </Box>
              </>
            )}
          </Box>
        </Card.Body>
      </Card>
    </Box>
  );
};

export default LoginPage;

