/**
 * POC Admin Layout - Usando AppShell de Nimbus DS
 * Layout que se mantiene para todas las pantallas de Chat
 */

import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import { Box, Button, Icon, IconButton, Text } from '@nimbus-ds/components';
import {
  ChevronLeftIcon,
  NotificationIcon,
  QuestionCircleIcon,
  GenerativeStarsIcon,
  GlobeIcon,
} from '@nimbus-ds/icons';
import { AppShell } from '@nimbus-ds/patterns';
import { useTranslation } from 'react-i18next';
import AdminMenu from './AdminMenu';
import { LanguageSelectorModal } from '../LanguageSelectorModal';

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

// Language code to display name mapping
const languageNames: Record<string, string> = {
  'pt-BR': 'Português (Brasil)',
  'es-AR': 'Español (Argentina)',
  'es-MX': 'Español (México)',
  'es-CO': 'Español (Colombia)',
  'es-CL': 'Español (Chile)',
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es-AR');
  const { i18n } = useTranslation();
  const userName = 'ar-nuvemchat';

  // Initialize language from localStorage or i18n
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app_language') || i18n.language || 'es-AR';
    setCurrentLanguage(savedLanguage);
  }, [i18n.language]);

  // Toggle function para colapsar/expandir o menu
  const handleToggleMenu = useCallback(() => {
    setMenuExpanded((prev) => !prev);
  }, []);

  // Language modal handlers
  const handleOpenLanguageModal = useCallback(() => {
    setLanguageModalOpen(true);
  }, []);

  const handleCloseLanguageModal = useCallback(() => {
    setLanguageModalOpen(false);
  }, []);

  const handleLanguageChange = useCallback((language: string) => {
    setCurrentLanguage(language);
  }, []);

  // Slot izquierdo del header - Botón volver
  const leftSlot = (
    <Button appearance="transparent" onClick={() => window.history.back()}>
      <Icon source={<ChevronLeftIcon />} color="neutral-textLow" />
      <Text color="neutral-textLow">Voltar</Text>
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

      {/* Language Selector - Icono de globo con idioma actual */}
      <Box
        as="button"
        display="flex"
        alignItems="center"
        gap="1"
        padding="1-5"
        paddingLeft="2"
        paddingRight="2"
        borderRadius="2"
        borderWidth="1"
        borderStyle="solid"
        borderColor="neutral-surfaceHighlight"
        backgroundColor="neutral-background"
        cursor="pointer"
        onClick={handleOpenLanguageModal}
        style={{
          transition: 'background-color 0.2s ease',
        }}
      >
        <Icon source={<GlobeIcon size="medium" />} color="neutral-textLow" />
        <Text fontSize="caption" color="neutral-textHigh">
          {languageNames[currentLanguage]?.split(' ')[0] || 'Idioma'}
        </Text>
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
    <>
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
            overflow="auto"
          >
            {children}
          </Box>
        </AppShell.Body>
      </AppShell>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        open={languageModalOpen}
        onDismiss={handleCloseLanguageModal}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </>
  );
};

export default AdminLayout;
