import {
  Button,
  Icon
} from '@nimbus-ds/components';
import {
  CogIcon
} from '@nimbus-ds/icons';
import { EmptyMessage, Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { nexo } from '@/app';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('translations');


  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);
  const startOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <Page maxWidth="800px">
      <Page.Header title={t('app.title')} />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <EmptyMessage
              illustration={
                <img src="/imgs/empty-manager.svg" alt="Imagem de un manager" />
              }
              title={t('settings.title')}
              text={t('settings.text')}
              actions={
                <Button appearance="primary" onClick={startOnboarding}>
                  <Icon color="currentColor" source={<CogIcon />} />
                  {t('settings.action')}
                </Button>
              }
            />

            {/* 
            <HelpLink>
              <Link appearance="primary" textDecoration="none">
                {t('settings.help-link')}
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
export default Settings;
