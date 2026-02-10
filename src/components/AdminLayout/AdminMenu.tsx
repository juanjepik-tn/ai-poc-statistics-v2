/**
 * POC Admin Menu - Usando patrones de Nimbus DS
 * Basado en la documentación oficial del patrón Menu
 */

import React from 'react';
import { Menu } from '@nimbus-ds/patterns';
import { Badge, Box, Icon, IconButton, Tag, Text, Tooltip } from '@nimbus-ds/components';
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
  SidebarIcon,
} from '@nimbus-ds/icons';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminMenuProps {
  menuExpanded?: boolean;
  onToggleMenu?: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ menuExpanded = true, onToggleMenu }) => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // Determinar qué sección de chat está activa
  const isChatSection = pathname === '/admin' || pathname.startsWith('/admin/chat');
  const isConversations = hash === '#/conversations' || hash === '' || !hash;
  const isStatistics = hash === '#/statistics';
  const isConfigurations = hash === '#/configurations';
  const isOnboarding = hash.startsWith('#/onboarding');

  return (
    <Menu expanded={menuExpanded} popoverPosition="right">
      <Menu.Header>
        <Box display="flex" gap="2" alignItems="center" width="100%">
          <Icon
            color="neutral-textHigh"
            source={<TiendanubeIcon size="medium" />}
          />
          <Box display="inline-flex" flex="1">
            <Text fontSize="base" color="neutral-textHigh" fontWeight="bold">
              next
            </Text>
          </Box>
          <Tooltip content={menuExpanded ? "Fechar menu lateral" : "Abrir menu lateral"} position={menuExpanded ? "bottom" : "right"}>
            <button
              type="button"
              onClick={onToggleMenu}
              style={{ 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon source={<SidebarIcon />} color="neutral-textHigh" />
            </button>
          </Tooltip>
        </Box>
      </Menu.Header>
      <Menu.Body>
        {/* Sección principal */}
        <Menu.Section>
          <Menu.Button startIcon={HomeIcon} label="Início" />
          <Menu.Button startIcon={StatsIcon} label="Estatísticas" />
        </Menu.Section>

        {/* Sección Gestión */}
        <Menu.Section title="Gestão">
          <Menu.Button startIcon={CashIcon} label="Vendas">
            <Badge appearance="primary" count="12" />
          </Menu.Button>
          <Menu.Button startIcon={TagIcon} label="Produtos" />
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
              children: <Tag appearance="primary">Novo</Tag>,
              "aria-controls": "chat-content",
            }}
          >
            <Menu.Button 
              label="Conversas" 
              active={isChatSection && isConversations}
              onClick={() => navigate('/admin/chat#/conversations')}
            />
            <Menu.Button 
              label="Estatísticas" 
              active={isChatSection && isStatistics}
              onClick={() => navigate('/admin/chat#/statistics')}
            />
            <Menu.Button 
              label="Configurações" 
              active={isChatSection && isConfigurations}
              onClick={() => navigate('/admin/chat#/configurations')}
            />
            <Menu.Button 
              label="Onboarding" 
              active={isChatSection && isOnboarding}
              onClick={() => navigate('/admin/chat#/onboarding/3')}
            />
          </Menu.ButtonAccordion>

          <Menu.Button startIcon={UserIcon} label="Clientes" />
          <Menu.Button startIcon={DiscountCircleIcon} label="Descontos" />
          <Menu.Button startIcon={MarketingIcon} label="Marketing" />
        </Menu.Section>

        {/* Canais de venda */}
        <Menu.Section title="Canais de venda">
          <Menu.Button startIcon={OnlineStoreIcon} label="Loja online">
            <Icon source={<ExternalLinkIcon size="small" />} color="neutral-textLow" />
          </Menu.Button>
          <Menu.Button startIcon={EcosystemIcon} label="Ponto de Venda">
            <Icon source={<ExternalLinkIcon size="small" />} color="neutral-textLow" />
          </Menu.Button>
          <Menu.Button startIcon={EcosystemIcon} label="Instagram y Facebook" />
          <Menu.Button startIcon={EcosystemIcon} label="Google Shopping" />
          <Menu.Button startIcon={EcosystemIcon} label="TikTok" />
          <Menu.Button startIcon={EcosystemIcon} label="Pinterest" />
          <Menu.Button startIcon={EcosystemIcon} label="Marketplaces" />
        </Menu.Section>

        {/* Potenciar */}
        <Menu.Section title="Potencializar">
          <Menu.Button startIcon={AppsIcon} label="Aplicativos" />
          <Menu.Button startIcon={ChatDotsIcon} label="Nuvem Chat (Dev)" />
          <Menu.Button startIcon={ChatDotsIcon} label="Nuvem Chat (QA)" />
        </Menu.Section>
      </Menu.Body>
      <Menu.Footer label="Configuração" startIcon={CogIcon} />
    </Menu>
  );
};

export default AdminMenu;
