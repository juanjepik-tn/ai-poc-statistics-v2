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
          Ir a {title}
        </Button>
      </Card.Footer>
    </Card>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const sections: NavCardProps[] = [
    {
      title: 'Estadísticas',
      description: 'Dashboard con métricas de conversaciones, mensajes y rendimiento de la IA',
      emoji: '📊',
      path: '/statistics',
      tag: 'Gráficos',
      tagAppearance: 'success',
    },
    {
      title: 'Conversaciones',
      description: 'Lista de chats de WhatsApp con clientes y gestión de mensajes',
      emoji: '💬',
      path: '/conversations',
      tag: '10 chats',
      tagAppearance: 'primary',
    },
    {
      title: 'Configuraciones',
      description: 'Ajustes de personalidad de IA, reglas de transferencia y preferencias',
      emoji: '⚙️',
      path: '/configurations',
    },
    {
      title: 'Productos',
      description: 'Gestión del catálogo de productos de la tienda',
      emoji: '📦',
      path: '/products',
      tag: '20 productos',
      tagAppearance: 'neutral',
    },
    {
      title: 'Costos',
      description: 'Información de billing, planes activos y historial de pagos',
      emoji: '💰',
      path: '/costs',
    },
    {
      title: 'Templates de Mensajes',
      description: 'Plantillas de mensajes para WhatsApp Business',
      emoji: '📝',
      path: '/template-messages',
    },
    {
      title: 'Onboarding',
      description: 'Flujo de configuración inicial paso a paso',
      emoji: '🚀',
      path: '/onboarding',
    },
    {
      title: 'Instancias WhatsApp',
      description: 'Gestión de canales y conexiones de WhatsApp',
      emoji: '📱',
      path: '/instances',
    },
    {
      title: 'Settings',
      description: 'Configuración general de la aplicación',
      emoji: '🔧',
      path: '/settings',
    },
  ];

  return (
    <Page maxWidth="1000px">
      <Page.Header
        title="🧪 POC UI Playground"
        subtitle="Navegá por las diferentes secciones para explorar la UI"
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
                <Title as="h3">Bienvenido al entorno de pruebas</Title>
                <Text>
                  Este es un entorno aislado con datos mock. Podés navegar por todas 
                  las secciones y experimentar con la UI sin afectar ningún dato real.
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
                        POC con el layout completo del nuevo admin de Tiendanube. 
                        Incluye sidebar de navegación y la sección de Chat integrada 
                        (Conversaciones, Estadísticas, Configuraciones).
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

            <Box marginBottom="2">
              <Text color="neutral-textLow" fontSize="caption">
                Secciones standalone (sin layout de admin):
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
