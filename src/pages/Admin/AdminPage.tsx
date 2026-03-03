/**
 * POC Admin Page - Página principal que replica el new-admin
 * El layout se mantiene para todas las pantallas de Chat
 */

import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@nimbus-ds/components';
import { AdminLayout } from '@/components/AdminLayout';
import Conversations from '@/pages/Conversations/Conversations';
import Statistics from '@/pages/Statistics/Statistics';
import Configurations from '@/pages/Configurations/Configurations';
import StatisticsDataProvider from '@/pages/Statistics/providers/StatisticsDataProvider';
import OnboardingStepper from '@/pages/OnboardingStepper/OnboardingStepper';

const AdminPage: React.FC = () => {
  const { hash } = useLocation();

  // Determinar qué contenido mostrar basado en el hash
  const activeSection = useMemo(() => {
    if (hash === '#/statistics') return 'statistics';
    if (hash === '#/configurations' || hash.startsWith('#/configurations/')) return 'configurations';
    if (hash.startsWith('#/onboarding')) return 'onboarding';
    return 'conversations'; // default
  }, [hash]);

  // Extract onboarding step from hash (e.g., #/onboarding/3 -> 3)
  const onboardingStep = useMemo(() => {
    if (hash.startsWith('#/onboarding/')) {
      const step = hash.replace('#/onboarding/', '');
      return parseInt(step, 10) || 0;
    }
    return 0;
  }, [hash]);

  // Extract configurations tab from hash (e.g., #/configurations/1 -> 1)
  const configurationsTab = useMemo(() => {
    if (hash.startsWith('#/configurations/')) {
      const tab = hash.replace('#/configurations/', '');
      return parseInt(tab, 10) || 0;
    }
    return 0;
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
        return <Configurations initialTab={configurationsTab} />;
      case 'onboarding':
        return <OnboardingStepper initialStep={onboardingStep} />;
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
        overflow="hidden"
      >
        {renderContent()}
      </Box>
    </AdminLayout>
  );
};

export default AdminPage;
