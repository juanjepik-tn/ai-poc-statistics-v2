import React from 'react';
import WhatsappIntegration from '@/pages/External/Channels/Whatsapp/WhatsappIntegration';

const ExternalRouter: React.FC = () => {
  const pathname = window.location.pathname;

  if (pathname.includes('/external/whatsapp')) {
    return <WhatsappIntegration />;
  }

  return null;
};

export default ExternalRouter;

