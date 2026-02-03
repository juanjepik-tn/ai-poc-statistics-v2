/**
 * POC Admin Layout - Usando AppShell de Nimbus DS
 * Layout que se mantiene para todas las pantallas de Chat
 */

import React, { ReactNode, useState, useCallback } from 'react';
import { Box, Button, Icon, IconButton, Text } from '@nimbus-ds/components';
import {
  ChevronLeftIcon,
  NotificationIcon,
  QuestionCircleIcon,
  GenerativeStarsIcon,
} from '@nimbus-ds/icons';
import { AppShell } from '@nimbus-ds/patterns';
import AdminMenu from './AdminMenu';

interface AdminLayoutProps {
  children: ReactNode;
}

// Avatar component con inicial
const UserAvatar: React.FC<{ name: string; size?: string }> = ({ name, size = '32px' }) => {
  const initial = name[0]?.toUpperCase() || 'U';

  return (
    <Box
      width={size}
      height={size}
      borderRadius="full"
      backgroundColor="primary-surface"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="base" fontWeight="bold" color="primary-interactive">
        {initial}
      </Text>
    </Box>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const userName = 'ar-nuvemchat';

  // Toggle function para colapsar/expandir o menu
  const handleToggleMenu = useCallback(() => {
    setMenuExpanded((prev) => !prev);
  }, []);

  // Slot izquierdo del header - Botón volver
  const leftSlot = (
    <Button appearance="transparent" onClick={() => window.history.back()}>
      <Icon source={<ChevronLeftIcon />} color="neutral-textLow" />
      <Text color="neutral-textLow">Volver</Text>
    </Button>
  );

  // Slot derecho del header - Botones de acción (igual al diseño de referencia)
  const rightSlot = (
    <Box display="flex" alignItems="center" gap="4">
      {/* Lumi Button - Con borde azul y glow violeta */}
      <Box
        borderWidth="1"
        borderStyle="solid"
        borderRadius="2"
        padding="1-5"
        paddingLeft="2"
        paddingRight="2"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="1"
        backgroundColor="neutral-background"
        style={{ 
          cursor: 'pointer',
          borderColor: '#0050c3',
          boxShadow: '0px 0px 0px 3px #E8DEF8'
        }}
      >
        <Icon source={<GenerativeStarsIcon size={16} />} color="primary-interactive" />
        <Text fontSize="caption" fontWeight="medium" color="neutral-textHigh">Lumi</Text>
      </Box>

      {/* Notificaciones - Solo ícono */}
      <IconButton 
        source={<NotificationIcon />} 
        size="2rem"
      />

      {/* Ayuda - Ícono con círculo */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="32px"
        height="32px"
        borderRadius="full"
        borderWidth="1"
        borderStyle="solid"
        borderColor="neutral-surfaceHighlight"
      >
        <Icon source={<QuestionCircleIcon size="medium" />} color="neutral-textLow" />
      </Box>

      {/* Usuario - Avatar + nombre */}
      <Box display="flex" alignItems="center" gap="2">
        <UserAvatar name={userName} />
        <Text fontSize="caption" color="neutral-textHigh">{userName}</Text>
      </Box>
    </Box>
  );

  return (
    <AppShell
      menu={<AdminMenu menuExpanded={menuExpanded} onToggleMenu={handleToggleMenu} />}
      menuExpanded={menuExpanded}
      menuExpandedWidth="270px"
      menuCollapsedWidth="48px"
    >
      <AppShell.Header
        leftSlot={leftSlot}
        rightSlot={rightSlot}
      />
      <AppShell.Body>
        <Box 
          height="100%" 
          width="100%"
          backgroundColor="neutral-surface"
          overflow="hidden"
        >
          {children}
        </Box>
      </AppShell.Body>
    </AppShell>
  );
};

export default AdminLayout;
