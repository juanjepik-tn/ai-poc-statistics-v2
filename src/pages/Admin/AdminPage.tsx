/**
 * POC Admin Page - Página principal que replica el new-admin
 * El layout se mantiene para todas las pantallas de Chat
 */

import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@nimbus-ds/components';
import { AdminLayout } from '@/components/AdminLayout';
import Conversations from '@/pages/Conversations/Conversations';
import Statistics from '@/pages/Statistics/Statistics';
import Configurations from '@/pages/Configurations/Configurations';
import StatisticsDataProvider from '@/pages/Statistics/providers/StatisticsDataProvider';

const AdminPage: React.FC = () => {
  const { hash } = useLocation();

  // Determinar qué contenido mostrar basado en el hash
  const activeSection = useMemo(() => {
    if (hash === '#/statistics') return 'statistics';
    if (hash === '#/configurations') return 'configurations';
    return 'conversations'; // default
  }, [hash]);

  const renderContent = () => {
    switch (activeSection) {
      case 'statistics':
        return (
          <StatisticsDataProvider>
            <Statistics />
          </StatisticsDataProvider>
        );
      case 'configurations':
        return <Configurations />;
      case 'conversations':
      default:
        return <Conversations />;
    }
  };

  return (
    <AdminLayout>
      <Box 
        height="100%" 
        display="flex" 
        flexDirection="column"
      >
        {renderContent()}
      </Box>
    </AdminLayout>
  );
};

export default AdminPage;
