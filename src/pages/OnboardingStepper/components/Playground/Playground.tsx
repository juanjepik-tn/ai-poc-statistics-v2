import {
  Box,
  Button,
  Icon,
  Link,
  Tag,
  Text
} from '@nimbus-ds/components';
import {
  HelpLink,
  Layout,
  Page
} from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

import { nexo } from '@/app';
import { PlaygroundView } from '@/components/playground/view';
import { ExternalLinkIcon } from '@nimbus-ds/icons';
import { useHelpLink } from '@/hooks';
import { trackingHelpLink } from '@/tracking';
type PlaygroundProps = {
  prevStep: () => void;
  nextStep: () => void;
}
const Playground: React.FC<PlaygroundProps> = ({prevStep, nextStep}) => {
  // const navigate = useNavigate();
  const { t } = useTranslation('translations');  
  const { link, textKey } = useHelpLink('Playground');

  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  return (
    <>
      <Page.Header
        title={t('settings.step4.title')}
        subtitle={t('settings.step4.description')}
      >
        <Tag appearance="primary">
          <Text color="primary-textLow">
            {t('settings.step', { step: 3, total: 4 })}
          </Text>
        </Tag>
      </Page.Header>
      <Page.Body>
        <Layout columns="1">
          <Layout.Section >
            <PlaygroundView source='onboarding' />
                    
            <Box display="flex" gap="2" justifyContent="flex-end">
              <Button appearance="neutral" onClick={prevStep}>
                  {t('settings.previous-step')}
              </Button>
              <Button appearance="primary" type="submit" onClick={nextStep}>
                {t('settings.next-step')} 
              </Button>
            </Box>
            {link && (
              <HelpLink>
                <Link
                  as="a"
                  onClick={(e) => {
                    trackingHelpLink({ source: 'Playground' });                    
                  }}
                  href={link}
                  target="_blank"
                  appearance="primary"
                  textDecoration="none"
                >
                  {t(textKey)}
                  <Icon source={<ExternalLinkIcon />} color="currentColor" />
                </Link>
              </HelpLink>
            )}
          </Layout.Section>
        </Layout>
      </Page.Body>
    </>
  );
};
export default Playground;
