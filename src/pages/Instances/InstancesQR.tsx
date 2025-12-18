import { Responsive } from '@/components';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { InstancesChannelDTO } from '@/types/instancesDTO';
import { Box, Button, Card, Icon, Link, Spinner, Text, Title } from '@nimbus-ds/components';
import { RedoIcon } from '@nimbus-ds/icons';
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
  const generateSteps = (
    <Box>      
      <Text as="p" color="neutral-textHigh">
        1. {t('instances.whatsApp.step1')}
      </Text>
      <Text as="p" color="neutral-textHigh">
        2. <Trans i18nKey="instances.whatsApp.step2" components={{ bold: <strong /> }} />
      </Text>
      <Text as="p" color="neutral-textHigh">
        3. <Trans i18nKey="instances.whatsApp.step3" components={{ bold: <strong /> }} />
      </Text>
      <Text as="p" color="neutral-textHigh">
        4. <Trans i18nKey="instances.whatsApp.step4" components={{ bold: <strong /> }} />
      </Text>
      <Text as="p" color="neutral-textHigh">
        5. <Trans i18nKey="instances.whatsApp.step5" components={{ bold: <strong /> }} />
      </Text>
    </Box>
  );
  const generateStepsWhatsappBusiness = (
    <Box gap="2">
      <Text as="p" color="neutral-textHigh">
        1. {t('instances.whatsAppBusiness.step1')}
      </Text>
      <Text as="p" color="neutral-textHigh">
        2. {t('instances.whatsAppBusiness.step2')}
      </Text>     
    </Box>
  );
  const renderWhatsappBusiness = (
    <>
    <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" gap="2">      
      <Title as="h4">{t('instances.connect-whatsapp-business-title')}</Title>
      {generateStepsWhatsappBusiness}
      <Box width="100%" display="flex" textAlign="center" justifyContent="center" alignItems="center" >
      <Button appearance="primary" onClick={launchWhatsAppSignup}>{t('instances.connect-whatsapp-business')}</Button>
      </Box>
    </Box>    
   </>
 
  );
  const renderWhatsappBaileys = (
    
    <Card
      padding="base"      
    >
      <Box minHeight="250px" display="flex" flexDirection="column" justifyContent="space-around" >
      <Card.Header title={t('instances.connect-whatsapp-title')} >
      <Text color="neutral-textLow" fontSize="caption">
        {t('instances.whatsApp.subtitle')}
      </Text>
        </Card.Header>
      <Card.Body>
      <EmptyMessage
        // @ts-ignore
        text={generateSteps}
        illustration={
          <Box
         //   marginRight="20"
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor="neutral-surface"
            borderColor="neutral-interactive"
            borderWidth="1"
            padding="4"
            borderStyle="solid"
            borderRadius="base"
            width="100%"
          >
            {qr ? (
               <QRCodeSVG
               width='160px'
               height='160px'
               renderAs='svg'               
               value={qr}                     
             />
            ) : (
              <>
                <img
                  src="/imgs/sample-qr.svg"
                  alt="Imagen de un QR"
                  style={{ opacity: 0.2 }}
                />
                <Box
                  position="absolute"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="160px"
                  height="160px"
                  borderRadius="full"
                  backgroundColor="primary-surface"
                  padding="none"
                >
                  {loading && <Spinner size="medium" />}
                  <Link
                    appearance="primary"
                    textDecoration="none"
                    fontSize="caption"
                    onClick={onGenerateQr}
                  >
                    {t('instances.generate-qr')}
                    <Icon color="currentColor" source={<RedoIcon />} />
                  </Link>
                </Box>
              </>
            )}
          </Box>
        }
      />
      </Card.Body>
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
