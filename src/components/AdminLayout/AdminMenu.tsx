/**
 * POC Admin Menu - Usando patrones de Nimbus DS
 * Basado en la documentación oficial del patrón Menu
 */

import React, { useEffect, useState } from 'react';
import { Menu } from '@nimbus-ds/patterns';
import { Badge, Icon, Tag } from '@nimbus-ds/components';
import {
  ExternalLinkIcon,
  HomeIcon,
  StatsIcon,
  CashIcon,
  TagIcon,
  UserIcon,
  DiscountCircleIcon,
  AppsIcon,
  EcosystemIcon,
  CogIcon,
  ChatDotsIcon,
  OnlineStoreIcon,
  CreditCardIcon,
  MarketingIcon,
} from '@nimbus-ds/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';

interface AdminMenuProps {
  menuExpanded?: boolean;
  onToggleMenu?: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ menuExpanded = true, onToggleMenu }) => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { request } = useFetch();
  const [unreadConversationsCount, setUnreadConversationsCount] = useState<number>(0);

  // Fetch unread conversations count
  useEffect(() => {
    const fetchUnreadCount = () => {
      request<{ count: number }>({
        url: API_ENDPOINTS.conversation.unread,
        method: 'GET',
      })
        .then(({ content }) => {
          setUnreadConversationsCount((content as { count: number }).count ?? 0);
        })
        .catch(() => {
          setUnreadConversationsCount(0);
        });
    };

    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [request]);

  // Determinar qué sección de chat está activa
  const isChatSection = pathname === '/admin' || pathname.startsWith('/admin/chat');
  const isConversations = hash === '#/conversations' || hash === '' || !hash;
  const isStatistics = hash === '#/statistics';
  const isConfigurations = hash === '#/configurations';
  const isOnboarding = hash.startsWith('#/onboarding');

  return (
    <Menu expanded={menuExpanded} popoverPosition="right">
      {/* Header removed - cloud logo */}
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
            >
              {unreadConversationsCount > 0 && (
                <Badge appearance="primary" count={String(unreadConversationsCount)} />
              )}
            </Menu.Button>
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
