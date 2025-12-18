import { Button, Icon } from '@nimbus-ds/components';
import { CogIcon } from '@nimbus-ds/icons';
import { Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { nexo } from '@/app';
import InstancesDataProvider from './InstancesDataProvider';
import InstancesQR from './InstancesQR';

const Instances: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('translations');
  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  return (
    <Page maxWidth="800px">
      <Page.Header
        title={t('app.title')}
        subtitle={t('instances.description')}
        buttonStack={
          <>
            <Button
              appearance="neutral"
              onClick={() => navigate('/configurations')}
            >
              {' '}
              <Icon color="currentColor" source={<CogIcon />} />
              {t('configurations')}
            </Button>
          </>
        }
      />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section gap="18">
            <InstancesDataProvider>
              {({ loading, onGenerateInstance, qr, statusUpdate, default_whatsapp }: any) => {
                useEffect(() => {
                  console.log('statusUpdate', statusUpdate);
                  if (statusUpdate === 'connected') {
                    navigate('/conversations');
                  }
                }, [statusUpdate]);

                return (
                  <InstancesQR
                    sholudRedirect={true}
                    loading={loading}
                    onGenerateQr={onGenerateInstance}
                    qr={qr}
                    onStatusUpdate={statusUpdate}
                    default_whatsapp={default_whatsapp}
                  />
                );
              }}
            </InstancesDataProvider>
           {/* 
            <HelpLink>
              <Link appearance="primary" textDecoration="none">
                {t('instances.help')}
                <Icon color="currentColor" source={<ExternalLinkIcon />} />
              </Link>
            </HelpLink>
           */}
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};
export default Instances;
