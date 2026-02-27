import React from 'react';
import {
  Box,
  Button,
  Card,
  Icon,
  Link,
  Tag,
  Text,
  Title,
  Alert,
  Spinner,
} from '@nimbus-ds/components';
import { Layout } from '@nimbus-ds/patterns';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ExternalLinkIcon,
} from '@nimbus-ds/icons';

interface StatusCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  children: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, iconBgColor, title, children }) => (
  <Card>
    <Card.Body>
      <Box display="flex" gap="4" alignItems="flex-start">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="40px"
          height="40px"
          minWidth="40px"
          borderRadius="full"
          backgroundColor={iconBgColor as any}
        >
          {icon}
        </Box>
        <Box display="flex" flexDirection="column" gap="2" flex="1">
          <Title as="h4">{title}</Title>
          {children}
        </Box>
      </Box>
    </Card.Body>
  </Card>
);

const StatusPanel: React.FC = () => {
  return (
    <Layout columns="1">
      <Layout.Section>
        <Box display="flex" flexDirection="column" gap="4">
          <Alert appearance="neutral">
            Catálogo de estados posibles de verificación. Cada card representa un escenario diferente.
          </Alert>

          <StatusCard
            icon={<Icon source={<ClockIcon />} color="warning-textLow" />}
            iconBgColor="warning-surface"
            title="Pendiente de documentación"
          >
            <Text color="neutral-textLow">
              Tu negocio necesita completar la verificación para operar WhatsApp sin restricciones.
            </Text>
            <Box paddingTop="2">
              <Button appearance="primary">Verificar ahora</Button>
            </Box>
          </StatusCard>

          <StatusCard
            icon={<Spinner size="small" />}
            iconBgColor="primary-surface"
            title="En revisión"
          >
            <Text color="neutral-textLow">
              Tu documentación está siendo revisada por Meta.
            </Text>
            <Text fontSize="caption" color="neutral-textDisabled">
              Enviado hace 15 minutos. Generalmente se resuelve en menos de 1 hora.
            </Text>
          </StatusCard>

          <StatusCard
            icon={<Icon source={<CheckCircleIcon />} color="success-textLow" />}
            iconBgColor="success-surface"
            title="Verificado"
          >
            <Box display="flex" alignItems="center" gap="2">
              <Tag appearance="success">Verificado</Tag>
            </Box>
            <Text color="neutral-textLow">
              Tu negocio está verificado.
            </Text>
            <Text fontSize="caption" color="neutral-textDisabled">
              Verificado el 27 de febrero de 2026. Tu cuenta tiene acceso completo.
            </Text>
          </StatusCard>

          <StatusCard
            icon={<Icon source={<ExclamationTriangleIcon />} color="danger-textLow" />}
            iconBgColor="danger-surface"
            title="Rechazado"
          >
            <Alert appearance="danger">
              Motivo: el documento no coincide con el nombre del negocio registrado.
            </Alert>
            <Text fontSize="caption" color="neutral-textLow">
              Intentos restantes: 2 de 3
            </Text>
            <Box paddingTop="2">
              <Button appearance="primary">
                Enviar nuevamente con documentación corregida
              </Button>
            </Box>
          </StatusCard>

          <StatusCard
            icon={<Icon source={<ExclamationCircleIcon />} color="danger-textLow" />}
            iconBgColor="danger-surface"
            title="Rechazado (sin reintentos)"
          >
            <Text color="neutral-textLow">
              La verificación fue rechazada y se agotaron los intentos.
            </Text>
            <Text fontSize="caption" color="neutral-textDisabled">
              Podés completar la verificación directamente desde Meta Business Suite.
            </Text>
            <Box display="flex" gap="3" paddingTop="2" flexWrap="wrap">
              <Link
                as="a"
                href="https://business.facebook.com/"
                target="_blank"
                appearance="primary"
                textDecoration="none"
              >
                Ir a Meta Business Suite
                <Icon source={<ExternalLinkIcon />} color="currentColor" />
              </Link>
              <Link as="a" href="#" appearance="neutral" textDecoration="none">
                Contactar soporte
              </Link>
            </Box>
          </StatusCard>
        </Box>
      </Layout.Section>
    </Layout>
  );
};

export default StatusPanel;
