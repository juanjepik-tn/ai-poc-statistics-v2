import { Responsive } from '@/components';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { InstancesChannelDTO } from '@/types/instancesDTO';
import { Box, Button, Card, Icon, Link, Spinner, Text, Title } from '@nimbus-ds/components';
import { RedoIcon, CheckCircleIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns';
import QRCodeSVG from 'qrcode.react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

type InstancesQRProps = {
  sholudRedirect?: boolean;
  loading: boolean;
  onGenerateQr: ()=>{};
  onStatusUpdate: ()=>{};
  qr: string;
  default_whatsapp: InstancesChannelDTO;
};

const InstancesQR: React.FC<InstancesQRProps> = ({ loading, onGenerateQr, qr, onStatusUpdate, default_whatsapp }) => {
  const { t } = useTranslation('translations');  
  const { launchWhatsAppSignup } = useFacebookLogin(onStatusUpdate);
  
  // Steps para QR WhatsApp - layout melhorado
  const qrSteps = [
    t('instances.whatsApp.step1'),
    t('instances.whatsApp.step2'),
    t('instances.whatsApp.step3'),
    t('instances.whatsApp.step4'),
    t('instances.whatsApp.step5'),
  ];
  
  // Steps para WhatsApp Business
  const businessSteps = [
    t('instances.whatsAppBusiness.step1'),
    t('instances.whatsAppBusiness.step2'),
  ];

  const renderWhatsappBusiness = (
    <Box display="flex" flexDirection="column" gap="4" padding="4">
      <Box display="flex" flexDirection="column" gap="2">
        <Title as="h4">{t('instances.connect-whatsapp-business-title')}</Title>
        <Box display="flex" flexDirection="column" gap="2">
          {businessSteps.map((step, index) => (
            <Box key={index} display="flex" alignItems="flex-start" gap="3">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minWidth="24px"
                height="24px"
                borderRadius="full"
                backgroundColor="primary-surface"
                flexShrink="0"
              >
                <Text fontSize="caption" fontWeight="bold" color="primary-interactive">
                  {index + 1}
                </Text>
              </Box>
              <Text fontSize="base" color="neutral-textHigh">{step}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button appearance="primary" onClick={launchWhatsAppSignup}>
          {t('instances.connect-whatsapp-business')}
        </Button>
      </Box>
    </Box>
  );
  const renderWhatsappBaileys = (
    <Card padding="base">
      <Box display="flex" flexDirection="column" gap="4">
        {/* Header */}
        <Box display="flex" flexDirection="column" gap="1">
          <Title as="h4">{t('instances.connect-whatsapp-title')}</Title>
          <Text color="neutral-textLow" fontSize="caption">
            {t('instances.whatsApp.subtitle')}
          </Text>
        </Box>
        
        {/* Conteúdo - grid em desktop */}
        <Box 
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap="4"
          alignItems="center"
        >
          {/* QR Code */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding="4"
            backgroundColor="neutral-surface"
            borderRadius="base"
            borderWidth="1"
            borderStyle="solid"
            borderColor="neutral-surfaceHighlight"
            minHeight="200px"
          >
            {qr ? (
              <QRCodeSVG
                width="176px"
                height="176px"
                renderAs="svg"               
                value={qr}                     
              />
            ) : (
              <Box
                position="relative"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="/imgs/sample-qr.svg"
                  alt="Imagen de un QR"
                  style={{ opacity: 0.15, width: '176px', height: '176px' }}
                />
                <Box
                  position="absolute"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  gap="2"
                >
                  {loading ? (
                    <Spinner size="medium" />
                  ) : (
                    <Link
                      as="button"
                      appearance="primary"
                      textDecoration="none"
                      onClick={onGenerateQr}
                    >
                      <Box display="flex" alignItems="center" gap="1">
                        <Text fontSize="base" color="currentColor">{t('instances.generate-qr')}</Text>
                        <Icon color="currentColor" source={<RedoIcon size={16} />} />
                      </Box>
                    </Link>
                  )}
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Instruções - numeradas claramente */}
          <Box display="flex" flexDirection="column" gap="3">
            {qrSteps.map((step, index) => (
              <Box key={index} display="flex" alignItems="flex-start" gap="3">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minWidth="24px"
                  height="24px"
                  borderRadius="full"
                  backgroundColor="primary-surface"
                  flexShrink="0"
                >
                  <Text fontSize="caption" fontWeight="bold" color="primary-interactive">
                    {index + 1}
                  </Text>
                </Box>
                <Text fontSize="base" color="neutral-textHigh">{step}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Card>
  )
  const renderDesktop = (
    <>
      {default_whatsapp?.name === 'WhatsappBusiness' ? renderWhatsappBusiness : renderWhatsappBaileys}
    </> 
  );
  const renderMobile = (
 
    <Box     
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <EmptyMessage
        // @ts-ignore
        illustration={
          <img src="/imgs/empty-contacts.svg" alt="Imagem de un manager" />
        }
        title={t('instances.mobile-handle-error.title')}
        text={t('instances.mobile-handle-error.text')}
      />
    </Box>
  
  );
  return (
        <Responsive
        desktopContent={renderDesktop}
        mobileContent={renderMobile}
        />
  );
};
export default InstancesQR;
