import React from 'react';
import { Box, Button, Icon, Link, Text, Title, Radio } from '@nimbus-ds/components';
import { ChevronLeftIcon, ChevronRightIcon, AlertCircleIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { FacebookPage } from '@/mocks/mock-channels';
import { ChannelIcon } from '@/components';

export interface Step3SelectPageProps {
  pages: FacebookPage[];
  selectedPageId: string | null;
  onSelectPage: (pageId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  hasInstagramConnected: boolean;
}

// Stepper indicator component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <Box display="flex" alignItems="center" justifyContent="center" gap="2" marginBottom="4">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <React.Fragment key={index}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: index + 1 <= currentStep 
              ? '#1877F2'
              : '#E5E7EB',
            color: index + 1 <= currentStep ? '#fff' : '#9CA3AF',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {index + 1}
        </div>
        {index < totalSteps - 1 && (
          <div
            style={{
              width: '40px',
              height: '2px',
              background: index + 1 < currentStep 
                ? '#1877F2'
                : '#E5E7EB',
            }}
          />
        )}
      </React.Fragment>
    ))}
  </Box>
);

export const Step3SelectPage: React.FC<Step3SelectPageProps> = ({
  pages,
  selectedPageId,
  onSelectPage,
  onContinue,
  onBack,
  hasInstagramConnected,
}) => {
  const { t } = useTranslation('translations');

  const enabledPages = pages.filter(p => p.isMessagingEnabled);
  const disabledPages = pages.filter(p => !p.isMessagingEnabled);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
      {/* Step indicator */}
      <StepIndicator currentStep={hasInstagramConnected ? 2 : 3} totalSteps={hasInstagramConnected ? 3 : 4} />

      {/* Title */}
      <Box display="flex" flexDirection="column" alignItems="center" gap="2">
        <Title as="h3" textAlign="center">
          Seleccioná tu página de Facebook
        </Title>
        <Text color="neutral-textLow" textAlign="center" maxWidth="400px">
          Elegí la página desde la cual querés recibir y responder mensajes de Messenger.
        </Text>
      </Box>

      {/* Pages list */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="450px">
        {enabledPages.map((page) => {
          const isSelected = selectedPageId === page.id;
          return (
            <Box
              key={page.id}
              padding="4"
              borderRadius="base"
              cursor="pointer"
              onClick={() => onSelectPage(page.id)}
              style={{
                border: isSelected 
                  ? '2px solid #1877F2' 
                  : '1px solid var(--color-neutral-surfaceHighlight)',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(24, 119, 242, 0.05) 0%, rgba(13, 101, 217, 0.08) 100%)'
                  : 'var(--color-neutral-background)',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <Box display="flex" alignItems="center" gap="3">
                {/* Page picture with ring */}
                <Box
                  width="56px"
                  height="56px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    background: isSelected 
                      ? '#1877F2'
                      : 'transparent',
                    padding: isSelected ? '3px' : '0',
                  }}
                >
                  <Box
                    width={isSelected ? '50px' : '56px'}
                    height={isSelected ? '50px' : '56px'}
                    borderRadius="full"
                    style={{
                      backgroundImage: `url(${page.picture})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: isSelected ? '2px solid white' : '1px solid var(--color-neutral-surfaceHighlight)',
                    }}
                  />
                </Box>

                {/* Page info */}
                <Box display="flex" flexDirection="column" gap="0-5" flex="1">
                  <Text fontWeight="bold" fontSize="base">{page.name}</Text>
                  <Text fontSize="caption" color="neutral-textLow">{page.category}</Text>
                  <Text fontSize="caption" color="neutral-textLow">
                    {page.followers.toLocaleString()} seguidores
                  </Text>
                </Box>

                {/* Radio button */}
                <Box
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: isSelected 
                      ? '#1877F2'
                      : 'transparent',
                    borderRadius: '50%',
                    padding: '2px',
                  }}
                >
                  <Radio
                    name="facebook-page"
                    checked={isSelected}
                    onChange={() => onSelectPage(page.id)}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* Disabled pages (messaging not enabled) */}
        {disabledPages.length > 0 && (
          <Box display="flex" flexDirection="column" gap="2" marginTop="2">
            <Text fontSize="caption" color="neutral-textLow" fontWeight="bold">
              Páginas sin mensajería habilitada:
            </Text>
            {disabledPages.map((page) => (
              <Box
                key={page.id}
                padding="3"
                borderRadius="base"
                style={{
                  border: '1px dashed var(--color-neutral-surfaceHighlight)',
                  background: 'var(--color-neutral-surface)',
                  opacity: 0.6,
                }}
              >
                <Box display="flex" alignItems="center" gap="3">
                  <Box
                    width="40px"
                    height="40px"
                    borderRadius="full"
                    style={{
                      backgroundImage: `url(${page.picture})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'grayscale(100%)',
                    }}
                  />
                  <Box display="flex" flexDirection="column" gap="0-5" flex="1">
                    <Text fontSize="caption" color="neutral-textLow">{page.name}</Text>
                    <Box display="flex" alignItems="center" gap="1">
                      <Icon source={<AlertCircleIcon size={12} />} color="warning-interactive" />
                      <Text fontSize="caption" color="warning-textHigh">
                        Habilitá la mensajería en Facebook
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Continue button */}
      <Box display="flex" flexDirection="column" gap="3" width="100%" maxWidth="450px">
        <Button
          appearance="primary"
          onClick={onContinue}
          disabled={!selectedPageId}
        >
          <Box display="flex" alignItems="center" gap="2">
            <Text color="currentColor">Conectar página</Text>
            <Icon source={<ChevronRightIcon />} color="currentColor" />
          </Box>
        </Button>
      </Box>

      {/* Back link */}
      <Link as="button" appearance="neutral" onClick={onBack}>
        <Box display="flex" alignItems="center" gap="1">
          <Icon source={<ChevronLeftIcon size={16} />} color="currentColor" />
          <Text color="currentColor">Volver</Text>
        </Box>
      </Link>
    </Box>
  );
};

export default Step3SelectPage;



