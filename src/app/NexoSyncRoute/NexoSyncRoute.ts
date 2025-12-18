/**
 * POC UI Playground - Nexo Sync Route
 * Simplified pass-through component (no Nexo sync needed in POC mode)
 */

const NexoSyncRoute = ({ children }: { children: JSX.Element }) => {
  // In POC mode, we don't need to sync with Nexo
  // Just pass through the children
  return children;
};

export default NexoSyncRoute;
