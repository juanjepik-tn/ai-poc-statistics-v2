/**
 * POC UI Playground - Mock Nexo Client
 * Provides stub implementations of all Nexo functions
 */

import { mockStoreInfo } from '@/mocks/mock-data';

// Mock dispatch function
const mockDispatch = (action: any) => {
  console.log('[POC Nexo] dispatch called with:', action?.type || action);
  return Promise.resolve();
};

// Mock Nexo instance with dispatch
const nexo = {
  dispatch: mockDispatch,
  suscribe: (_action: string, _callback: any) => {
    return () => {};
  },
  subscribe: (_action: string, _callback: any) => {
    return () => {};
  },
  unsubscribe: () => {},
};

export default nexo;

// Re-export mock functions that match @tiendanube/nexo interface
export const connect = async (_nexo: any) => {
  console.log('[POC Nexo] connect called');
  return Promise.resolve();
};

export const iAmReady = (_nexo: any) => {
  console.log('[POC Nexo] iAmReady called');
};

export const getSessionToken = async (_nexo: any) => {
  return 'mock-session-token';
};

export const getStoreInfo = async (_nexo: any) => {
  return {
    id: mockStoreInfo.id,
    language: mockStoreInfo.language,
    country: mockStoreInfo.country,
  };
};

export const navigateHeader = (_nexo: any, _options?: any) => {
  console.log('[POC Nexo] navigateHeader called');
};

export const navigateHeaderRemove = (_nexo: any) => {
  console.log('[POC Nexo] navigateHeaderRemove called');
};

export const navigateBack = (_nexo: any) => {
  console.log('[POC Nexo] navigateBack called');
  window.history.back();
};

export const goTo = (_nexo: any, _path: string) => {
  console.log('[POC Nexo] goTo called with path:', _path);
};

export const syncPathname = (_nexo: any, _pathname: string) => {
  // No-op in POC mode
};

export const ACTION_NAVIGATE_SYNC = 'ACTION_NAVIGATE_SYNC';

export interface NavigateSyncResponse {
  path: string;
  replace: boolean;
}

// ErrorBoundary component mock
export const ErrorBoundary = ({ children }: { children: React.ReactNode; nexo?: any }) => {
  return children;
};
