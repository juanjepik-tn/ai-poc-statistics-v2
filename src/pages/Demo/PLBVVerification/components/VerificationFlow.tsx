import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Icon,
  Input,
  Text,
  Title,
  Tag,
  Alert,
} from '@nimbus-ds/components';
import { Layout } from '@nimbus-ds/patterns';
import { CheckCircleIcon, ExternalLinkIcon } from '@nimbus-ds/icons';

interface VerificationFlowProps {
  onSwitchToStatus: () => void;
}

const DOCUMENT_TYPES = [
  'Registro o licencia comercial',
  'Constancia de inscripción tributaria',
  'Extracto bancario del negocio',
];

const VerificationFlow: React.FC<VerificationFlowProps> = ({ onSwitchToStatus }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [noWebsite, setNoWebsite] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(DOCUMENT_TYPES[0]);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const stepIndicator = (
    <Box display="flex" gap="2" alignItems="center" paddingBottom="4">
      {[0, 1, 2].map((step) => (
        <Box key={step} display="flex" alignItems="center" gap="2">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="28px"
            height="28px"
            borderRadius="full"
            backgroundColor={
              step < currentStep
                ? 'success-surfaceHighlight'
                : step === currentStep
                ? 'primary-surfaceHighlight'
                : 'neutral-surface'
            }
          >
            {step < currentStep ? (
              <Icon source={<CheckCircleIcon />} color="success-textLow" />
            ) : (
              <Text
                fontSize="caption"
                color={step === currentStep ? 'primary-textLow' : 'neutral-textDisabled'}
                fontWeight="bold"
              >
                {step + 1}
              </Text>
            )}
          </Box>
          {step < 2 && (
            <Box
              width="40px"
              height="2px"
              backgroundColor={step < currentStep ? 'success-surfaceHighlight' : 'neutral-surface'}
            />
          )}
        </Box>
      ))}
    </Box>
  );

  if (currentStep === 0) {
    return (
      <Layout columns="1">
        <Layout.Section>
          <Card>
            <Card.Body>
              <Box display="flex" flexDirection="column" gap="4">
                {stepIndicator}
                <Title as="h3">Información del negocio</Title>
                <Text color="neutral-textLow">
                  Confirmá los datos de tu negocio para iniciar la verificación.
                </Text>

                <Box display="flex" flexDirection="column" gap="3">
                  <Box display="flex" flexDirection="column" gap="1">
                    <Text fontSize="caption" fontWeight="bold">Nombre del negocio</Text>
                    <Input value="Pequi Perfumes Ltda." readOnly />
                  </Box>

                  <Box display="flex" flexDirection="column" gap="1">
                    <Text fontSize="caption" fontWeight="bold">País</Text>
                    <Input value="Brasil" readOnly />
                  </Box>

                  <Box display="flex" flexDirection="column" gap="1">
                    <Text fontSize="caption" fontWeight="bold">CNPJ</Text>
                    <Input value="12.345.678/0001-90" readOnly />
                  </Box>

                  <Box display="flex" flexDirection="column" gap="1">
                    <Text fontSize="caption" fontWeight="bold">Dirección comercial</Text>
                    <Input placeholder="Av. Paulista 1000, São Paulo, SP" />
                  </Box>

                  <Box paddingTop="1">
                    <Checkbox
                      name="no-website"
                      label="Mi negocio no tiene sitio web"
                      checked={noWebsite}
                      onChange={(e) => setNoWebsite(e.target.checked)}
                    />
                  </Box>
                </Box>

                <Box display="flex" justifyContent="flex-end" paddingTop="2">
                  <Button appearance="primary" onClick={() => setCurrentStep(1)}>
                    Continuar
                  </Button>
                </Box>
              </Box>
            </Card.Body>
          </Card>
        </Layout.Section>
      </Layout>
    );
  }

  if (currentStep === 1) {
    return (
      <Layout columns="1">
        <Layout.Section>
          <Card>
            <Card.Body>
              <Box display="flex" flexDirection="column" gap="4">
                {stepIndicator}
                <Title as="h3">Carga de documentación</Title>
                <Text color="neutral-textLow">
                  Seleccioná el tipo de documento y subí una copia legible.
                </Text>

                <Box display="flex" flexDirection="column" gap="1">
                  <Text fontSize="caption" fontWeight="bold">Tipo de documento</Text>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #d4d4d8',
                      fontSize: '14px',
                      width: '100%',
                      backgroundColor: 'white',
                    }}
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  padding="6"
                  borderRadius="2"
                  borderColor={isDragging ? 'primary-interactive' : 'neutral-surfaceHighlight'}
                  borderStyle="dashed"
                  borderWidth="1"
                  backgroundColor={isDragging ? 'primary-surface' : 'neutral-background'}
                  onDragOver={(e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  cursor="pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {uploadedFile ? (
                    <Box display="flex" flexDirection="column" alignItems="center" gap="1">
                      <Icon source={<CheckCircleIcon />} color="success-textLow" />
                      <Text fontWeight="bold">{uploadedFile.name}</Text>
                      <Text fontSize="caption" color="neutral-textLow">{uploadedFile.size}</Text>
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" gap="1">
                      <Text fontWeight="bold">
                        Arrastrá el archivo acá o hacé click para seleccionar
                      </Text>
                      <Text fontSize="caption" color="neutral-textLow">
                        PDF, JPG o PNG. Máximo 10 MB.
                      </Text>
                    </Box>
                  )}
                </Box>

                <Alert appearance="neutral">
                  Tiendanube envía esta documentación a Meta para verificar tu negocio. El proceso suele resolverse en minutos.
                </Alert>

                <Box display="flex" justifyContent="space-between" paddingTop="2">
                  <Button onClick={() => setCurrentStep(0)}>Volver</Button>
                  <Button appearance="primary" onClick={() => setCurrentStep(2)}>
                    Enviar verificación
                  </Button>
                </Box>
              </Box>
            </Card.Body>
          </Card>
        </Layout.Section>
      </Layout>
    );
  }

  return (
    <Layout columns="1">
      <Layout.Section>
        <Card>
          <Card.Body>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="4"
              padding="6"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="64px"
                height="64px"
                borderRadius="full"
                backgroundColor="success-surface"
              >
                <Icon source={<CheckCircleIcon />} color="success-textLow" />
              </Box>

              <Title as="h3">Documentación enviada</Title>
              <Text textAlign="center" color="neutral-textLow">
                Te notificamos cuando Meta confirme la verificación de tu negocio.
              </Text>

              <Tag appearance="neutral">
                Generalmente se resuelve en menos de 1 hora
              </Tag>

              <Button onClick={onSwitchToStatus}>
                Ver estado de verificación
                <Icon source={<ExternalLinkIcon />} color="currentColor" />
              </Button>
            </Box>
          </Card.Body>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default VerificationFlow;
