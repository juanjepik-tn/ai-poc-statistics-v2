/**
 * POC Admin Menu - Usando patrones de Nimbus DS
 * Basado en la documentación oficial del patrón Menu
 */

import React from 'react';
import { Menu } from '@nimbus-ds/patterns';
import { Badge, Box, Icon, IconButton, Tag, Text } from '@nimbus-ds/components';
import {
  TiendanubeIcon,
  ExternalLinkIcon,
  HomeIcon,
  StatsIcon,
  CashIcon,
  TagIcon,
  UserIcon,
  DiscountCircleIcon,
  ToolsIcon,
  AppsIcon,
  EcosystemIcon,
  CogIcon,
  ChatDotsIcon,
  OnlineStoreIcon,
  CreditCardIcon,
  MarketingIcon,
} from '@nimbus-ds/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminMenu: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // Determinar qué sección de chat está activa
  const isChatSection = pathname === '/admin' || pathname.startsWith('/admin/chat');
  const isConversations = hash === '#/conversations' || hash === '' || !hash;
  const isStatistics = hash === '#/statistics';
  const isConfigurations = hash === '#/configurations';

  return (
    <Menu>
      <Menu.Header>
        <Box display="flex" gap="2" alignItems="center" width="100%">
          <Icon
            color="neutral-textHigh"
            source={<TiendanubeIcon size="medium" />}
          />
          <Box display="inline-flex" flex="1">
            <Text fontSize="base" color="neutral-textHigh" fontWeight="bold">
              evolución
            </Text>
          </Box>
          <IconButton source={<ExternalLinkIcon />} size="2rem" />
        </Box>
      </Menu.Header>
      <Menu.Body>
        {/* Sección principal */}
        <Menu.Section>
          <Menu.Button startIcon={HomeIcon} label="Inicio" />
          <Menu.Button startIcon={StatsIcon} label="Estadísticas" />
        </Menu.Section>

        {/* Sección Gestión */}
        <Menu.Section title="Gestión">
          <Menu.Button startIcon={CashIcon} label="Ventas">
            <Badge appearance="primary" count="12" />
          </Menu.Button>
          <Menu.Button startIcon={TagIcon} label="Productos" />
          <Menu.Button startIcon={CreditCardIcon} label="Pago Nube" />
          
          {/* Chat - Con acordeón expandido */}
          <Menu.ButtonAccordion
            controlled
            open={isChatSection}
            contentId="chat-content"
            menuButton={{
              id: "chat-control",
              startIcon: ChatDotsIcon,
              label: "Chat",
              children: <Tag appearance="primary">Nuevo</Tag>,
              "aria-controls": "chat-content",
            }}
          >
            <Menu.Button 
              label="Conversaciones" 
              active={isChatSection && isConversations}
              onClick={() => navigate('/admin/chat#/conversations')}
            />
            <Menu.Button 
              label="Estadísticas" 
              active={isChatSection && isStatistics}
              onClick={() => navigate('/admin/chat#/statistics')}
            />
            <Menu.Button 
              label="Configuraciones" 
              active={isChatSection && isConfigurations}
              onClick={() => navigate('/admin/chat#/configurations')}
            />
          </Menu.ButtonAccordion>

          <Menu.Button startIcon={UserIcon} label="Clientes" />
          <Menu.Button startIcon={DiscountCircleIcon} label="Descuentos" />
          <Menu.Button startIcon={MarketingIcon} label="Marketing" />
        </Menu.Section>

        {/* Canales de venta */}
        <Menu.Section title="Canales de venta">
          <Menu.Button 
            startIcon={OnlineStoreIcon} 
            label="Tienda online"
          >
            <Icon source={<ExternalLinkIcon size="small" />} color="neutral-textLow" />
          </Menu.Button>
          <Menu.Button startIcon={EcosystemIcon} label="Punto de Venta">
            <Icon source={<ExternalLinkIcon size="small" />} color="neutral-textLow" />
          </Menu.Button>
          <Menu.Button startIcon={EcosystemIcon} label="Instagram y Facebook" />
          <Menu.Button startIcon={EcosystemIcon} label="Google Shopping" />
          <Menu.Button startIcon={EcosystemIcon} label="TikTok" />
          <Menu.Button startIcon={EcosystemIcon} label="Pinterest" />
          <Menu.Button startIcon={EcosystemIcon} label="Marketplaces" />
        </Menu.Section>

        {/* Potenciar */}
        <Menu.Section title="Potenciar">
          <Menu.Button startIcon={AppsIcon} label="Aplicaciones" />
          <Menu.Button startIcon={ChatDotsIcon} label="Nuvem Chat (Dev)" />
          <Menu.Button startIcon={ChatDotsIcon} label="Nuvem Chat (QA)" />
        </Menu.Section>
      </Menu.Body>
      <Menu.Footer label="Configuración" startIcon={CogIcon} />
    </Menu>
  );
};

export default AdminMenu;
