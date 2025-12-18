/**
 * POC UI Playground - Router
 * Todas las rutas de chat usan el AdminLayout
 * Todas las rutas están protegidas por autenticación excepto /login
 */

import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  Products,
  Settings,
  OnboardingStepper,
  Instances,
} from '@/pages';
import { AdminPage } from '@/pages/Admin';
import { useFetch } from '@/hooks';
import { useToast } from '@nimbus-ds/components';
import { useDispatch, useSelector } from 'react-redux';
import { API_ENDPOINTS } from '../Axios/Axios';
import TemplateMessagesList from '@/pages/TemplateMessages/TemplateMessagesList';
import { setStoreInfo } from '@/redux/slices/store';
import BillingDataProvider from '@/pages/Costs/providers/BillingDataProvider';
import WhatsappIntegration from '@/pages/External/Channels/Whatsapp/WhatsappIntegration';
import Home from '@/pages/Home/Home';
import Costs from '@/pages/Costs/Costs';
import { LoginPage, ProtectedRoute } from '@/components/Auth';

const Router: React.FC = () => {
  const [, setStoreDetails] = useState(null);
  const { request } = useFetch();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get store info from Redux (already set by App.tsx in POC mode)
  useSelector((state: any) => state?.store);

  const isExternalRoute = location.pathname.startsWith('/external/');
  const isLoginRoute = location.pathname === '/login';

  const onGetStoreDetails = () => {
    return request<any>({
      url: API_ENDPOINTS.store.info,
      method: 'GET',
    })
      .then(({ content }: any) => {
        setStoreDetails(content);
        dispatch(setStoreInfo(content));
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error?.message?.description ?? error?.message ?? 'Error loading store',
          duration: 4000,
          id: 'error-products',
        });
      });
  };

  useEffect(() => {
    // Solo cargar detalles de la tienda si no es ruta externa ni login
    if (!isExternalRoute && !isLoginRoute) {
      onGetStoreDetails();
    }
  }, [isExternalRoute, isLoginRoute]);

  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES - No requieren autenticación
          ============================================ */}
      <Route path="/login" element={<LoginPage />} />

      {/* ============================================
          PROTECTED ROUTES - Requieren autenticación
          ============================================ */}
      
      {/* Redirect root to admin chat */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/conversations" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      
      {/* ADMIN LAYOUT ROUTES - Chat dentro del admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/conversations" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/chat"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/chat/*"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect old standalone routes to admin layout */}
      <Route
        path="/conversations"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/conversations" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conversations/:conversationId"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/conversations" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/statistics" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurations"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/configurations" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurations/:tab"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/configurations" replace />
          </ProtectedRoute>
        }
      />
      
      {/* STANDALONE ROUTES - Sin layout de admin */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instances"
        element={
          <ProtectedRoute>
            <Instances />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingStepper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/:step"
        element={
          <ProtectedRoute>
            <OnboardingStepper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/template-messages"
        element={
          <ProtectedRoute>
            <TemplateMessagesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/external/whatsapp"
        element={
          <ProtectedRoute>
            <WhatsappIntegration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/costs"
        element={
          <ProtectedRoute>
            <BillingDataProvider>
              <Costs />
            </BillingDataProvider>
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all redirect */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/chat#/conversations" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
