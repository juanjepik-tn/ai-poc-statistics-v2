/**
 * POC UI Playground - Simplified App Component
 * No Nexo authentication required - runs with mock data
 */

import Router from '@/app/Router';
import Notification from '@/components/notification/notification';
import { CommentsProvider, CommentsSystem } from '@/components/comments';
import ReduxProvider from '@/redux/redux-provider';
import { set } from '@/redux/slices/session';
import { Box, Text, ToastProvider } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from './DarkModeProvider';
import './I18n';
import { useDispatch } from 'react-redux';
import { Toaster } from 'sonner';
import { changeLanguage } from './I18n/I18n';
import { setBillingData } from '@/redux/slices/billing';
import { mockBillingData, mockSessionData, mockStoreInfo } from '@/mocks/mock-data';
import { setStoreInfo } from '@/redux/slices/store';

// POC Banner Component
const POCBanner: React.FC = () => (
  <Box
    backgroundColor="warning-surface"
    padding="2"
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap="2"
  >
    <Text fontSize="caption" color="warning-textLow">
      🧪 POC Mode - Using mock data
    </Text>
  </Box>
);

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize the app with mock data (no Nexo connection needed)
    const initializePOC = async () => {
      console.log('[POC] Initializing with mock data...');

      // Set default language
      const browserLang = navigator.language || 'es-AR';
      const lang = browserLang.startsWith('pt') ? 'pt-BR' : 'es-AR';
      changeLanguage(lang);

      // Set mock session data
      dispatch(set(mockSessionData));

      // Set mock store info
      dispatch(setStoreInfo(mockStoreInfo));

      // Set mock billing data
      dispatch(setBillingData(mockBillingData));

      // Store mock token for any axios calls
      localStorage.setItem('mock_token', mockSessionData.token);

      console.log('[POC] Mock data initialized successfully');
      setIsReady(true);
    };

    initializePOC();
  }, [dispatch]);

  if (!isReady) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="4"
      >
        <Text fontSize="highlight">🚀 Iniciando POC UI Playground...</Text>
        <Text color="neutral-textLow">Cargando datos de prueba</Text>
      </Box>
    );
  }

  return (
    <DarkModeProvider>
      <ToastProvider>
        <BrowserRouter>
          <CommentsProvider>
            <ReduxProvider>
              <Toaster richColors />
              <Notification />
              <Router />
              {/* Comments System - Floating button, panel and modal */}
              <CommentsSystem />
            </ReduxProvider>
          </CommentsProvider>
        </BrowserRouter>
      </ToastProvider>
    </DarkModeProvider>
  );
};

export default App;
