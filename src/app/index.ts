/**
 * POC UI Playground - App exports
 * Nexo is not exported since we use mocks
 */

export { default } from './App';
export { default as axios } from './Axios';
export { DarkModeContext } from './DarkModeProvider';

// Mock nexo object for compatibility (does nothing)
export const nexo = {
  suscribe: () => () => {},
  unsubscribe: () => {},
};
