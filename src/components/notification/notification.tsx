/**
 * POC UI Playground - Notification Component
 * WebSocket disabled in POC mode
 */

import { useEffect } from 'react';

// POC Mode: Disable WebSocket notifications
const POC_MODE = true;

const Notification = () => {
  useEffect(() => {
    if (POC_MODE) {
      console.log('[POC] WebSocket notifications disabled in POC mode');
      return;
    }
  }, []);

  // In POC mode, render nothing
  return null;
};

export default Notification;
