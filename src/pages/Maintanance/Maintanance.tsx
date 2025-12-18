
import React from 'react';
import { Box, Text, Card, Title } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';

const Maintanance: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const { t } = useTranslation();
  if (isMaintenanceMode) {
    return (
        <Card>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            flexDirection="row"
          >
            <Box display="flex" justifyContent="center" flex="1">
              <img
                src="/imgs/maintenance-image.png"
                alt="Mantenimiento en progreso"
                width="80%"
              />
            </Box>

            <Box textAlign="center" flex="1">
                <Title as="h4">{t('maintenance-title')}</Title>
                <Text>{t('maintenance-description')}</Text>
            </Box>
          </Box>


        </Card>
         
    
    );
  }

  return <>{children}</>;
};

export default Maintanance;