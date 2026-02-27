/**
 * POC UI Playground - Home Page
 * Navigation hub to all available sections
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Page } from '@nimbus-ds/patterns';
import {
  Card,
  Text,
  Box,
  Button,
  Title,
  Tag,
} from '@nimbus-ds/components';

interface NavCardProps {
  title: string;
  description: string;
  emoji: string;
  path: string;
  tag?: string;
  tagAppearance?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  highlighted?: boolean;
}

const NavCard: React.FC<NavCardProps> = ({ 
  title, 
  description, 
  emoji,
  path, 
  tag,
  tagAppearance = 'primary',
  highlighted = false
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <Card.Body>
        <Box display="flex" gap="4" alignItems="flex-start">
          <Box
            backgroundColor={highlighted ? 'success-surface' : 'primary-surface'}
            borderRadius="2"
            padding="3"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minWidth="48px"
            minHeight="48px"
          >
            <Text fontSize="h2">{emoji}</Text>
          </Box>
          <Box display="flex" flexDirection="column" gap="1" flex="1">
            <Box display="flex" alignItems="center" gap="2">
              <Title as="h4">{title}</Title>
              {tag && <Tag appearance={tagAppearance}>{tag}</Tag>}
            </Box>
            <Text color="neutral-textLow" fontSize="caption">
              {description}
            </Text>
          </Box>
        </Box>
      </Card.Body>
      <Card.Footer>
        <Button appearance={highlighted ? 'primary' : 'neutral'} onClick={() => navigate(path)}>
          Ir para {title}
        </Button>
      </Card.Footer>
    </Card>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const sections: NavCardProps[] = [
    {
      title: 'Estatísticas',
      description: 'Dashboard com métricas de conversas, mensagens e desempenho da IA',
      emoji: '📊',
      path: '/statistics',
      tag: 'Gráficos',
      tagAppearance: 'success',
    },
    {
      title: 'Conversas',
      description: 'Lista de chats de WhatsApp com clientes e gestão de mensagens',
      emoji: '💬',
      path: '/conversations',
      tag: '10 chats',
      tagAppearance: 'primary',
    },
    {
      title: 'Configurações',
      description: 'Ajustes de personalidade da IA, regras de transferência e preferências',
      emoji: '⚙️',
      path: '/configurations',
    },
    {
      title: 'Produtos',
      description: 'Gestão do catálogo de produtos da loja',
      emoji: '📦',
      path: '/products',
      tag: '20 produtos',
      tagAppearance: 'neutral',
    },
    {
      title: 'Custos',
      description: 'Informações de billing, planos ativos e histórico de pagamentos',
      emoji: '💰',
      path: '/costs',
    },
    {
      title: 'Templates de Mensagens',
      description: 'Modelos de mensagens para WhatsApp Business',
      emoji: '📝',
      path: '/template-messages',
    },
    {
      title: 'Onboarding',
      description: 'Fluxo de configuração inicial passo a passo',
      emoji: '🚀',
      path: '/onboarding',
    },
    {
      title: 'Instâncias WhatsApp',
      description: 'Gestão de canais e conexões de WhatsApp',
      emoji: '📱',
      path: '/instances',
    },
    {
      title: 'Settings',
      description: 'Configuração geral da aplicação',
      emoji: '🔧',
      path: '/settings',
    },
  ];

  return (
    <Page maxWidth="1000px">
      <Page.Header
        title="🧪 POC UI Playground"
        subtitle="Navegue pelas diferentes seções para explorar a UI"
      />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <Box
              backgroundColor="primary-surface"
              padding="4"
              borderRadius="2"
              marginBottom="4"
            >
              <Box display="flex" flexDirection="column" gap="2">
                <Title as="h3">Bem-vindo ao ambiente de testes</Title>
                <Text>
                  Este é um ambiente isolado com dados mock. Você pode navegar por todas 
                  as seções e experimentar com a UI sem afetar nenhum dado real.
                </Text>
                <Text fontSize="caption" color="neutral-textLow">
                  💡 Tip: Los datos se pueden modificar en src/mocks/mock-data.ts
                </Text>
              </Box>
            </Box>

            {/* Layout Admin - POC Principal */}
            <Box marginBottom="4">
              <Card>
                <Card.Body>
                  <Box display="flex" gap="4" alignItems="flex-start">
                    <Box
                      backgroundColor="success-surface"
                      borderRadius="2"
                      padding="3"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minWidth="48px"
                      minHeight="48px"
                    >
                      <Text fontSize="h2">🌩️</Text>
                    </Box>
                    <Box display="flex" flexDirection="column" gap="1" flex="1">
                      <Box display="flex" alignItems="center" gap="2">
                        <Title as="h4">Layout New Admin + Chat</Title>
                        <Tag appearance="success">Recomendado</Tag>
                      </Box>
                      <Text color="neutral-textLow" fontSize="caption">
                        POC com o layout completo do novo admin da Nuvemshop. 
                        Inclui sidebar de navegação e a seção de Chat integrada 
                        (Conversas, Estatísticas, Configurações).
                      </Text>
                    </Box>
                  </Box>
                </Card.Body>
                <Card.Footer>
                  <Button appearance="primary" onClick={() => navigate('/admin/chat#/conversations')}>
                    Ir al Admin
                  </Button>
                </Card.Footer>
              </Card>
            </Box>

            {/* Demo Standalone Pages */}
            <Box marginBottom="2" marginTop="4">
              <Text color="neutral-textLow" fontSize="caption" fontWeight="bold">
                Demos standalone (para compartir):
              </Text>
            </Box>

            <Box display="flex" flexDirection="column" gap="4" marginBottom="6">
              <NavCard
                title="PLBV Verification"
                description="Business Verification de Meta via Partner (PLBV). Flujo de carga de docs y panel de estados."
                emoji="✅"
                path="/demo/plbv"
                tag="Nuevo"
                tagAppearance="success"
                highlighted
              />
              <NavCard
                title="BSUID & Usernames Chat"
                description="Experiencia de chat con contactos identificados por username y BSUID en vez de teléfono."
                emoji="💬"
                path="/demo/bsuid-chat"
                tag="Nuevo"
                tagAppearance="success"
                highlighted
              />
              <NavCard
                title="WhatsApp Login Directo"
                description="Onboarding de WhatsApp con login directo por número de teléfono (sin Embedded Signup)."
                emoji="📱"
                path="/demo/whatsapp-login"
                tag="Nuevo"
                tagAppearance="success"
                highlighted
              />
            </Box>

            <Box marginBottom="2">
              <Text color="neutral-textLow" fontSize="caption">
                Seções standalone (sem layout de admin):
              </Text>
            </Box>

            <Box display="flex" flexDirection="column" gap="4">
              {sections.map((section) => (
                <NavCard key={section.path} {...section} />
              ))}
            </Box>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default Home;
