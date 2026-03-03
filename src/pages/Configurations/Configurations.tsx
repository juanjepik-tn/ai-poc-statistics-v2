/**
 * POC Configurations - Adaptado para funcionar dentro del AdminLayout
 * Removido AppShell propio para evitar conflictos
 */

import { Tabs } from '@nimbus-ds/components';
import { Layout, Page } from '@nimbus-ds/patterns';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useWindowWidth } from '@/hooks';
import ConfigurationsInformation from './ConfigurationsInformation';
import ConfigurationsInstances from './ConfigurationsInstances';
import ConfigurationsPreferences from './ConfigurationsPreferences';
import ConfigurationsTest from './ConfigurationsTest';
import ConfigurationsHumanSupport from './ConfigurationsHumanSupport';
import { useParams } from 'react-router-dom';
import PricingAlertStatus from '@/components/PricingAlertStatus/PricingAlertStatus';
import { BillingDTO } from '@/types/billingDTO';
import { useSelector } from 'react-redux';

interface ConfigurationsProps {
  initialTab?: number;
}

const Configurations: React.FC<ConfigurationsProps> = ({ initialTab }) => {
  const { t } = useTranslation('translations');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const { tab } = useParams();
  const tabNumber = initialTab !== undefined ? initialTab : (tab ? parseInt(tab, 10) : 0);
  const TABS = useMemo(() => [
    {
      class: 'preferences',
      label: t('config.preferences'),
      component: <ConfigurationsPreferences />,
    },
    {
      class: 'information',
      label: t('config.information'),
      component: <ConfigurationsInformation />,
    },
    {
      class: 'human-support',
      label: t('config.humanSupport'),
      component: <ConfigurationsHumanSupport />,
    },
    {
      class: 'test',
      label: t('config.test'),
      component: <ConfigurationsTest />,
    },
    {
      class: 'channels',
      label: t('config.channels'),
      component: <ConfigurationsInstances />,
    },
  ], [t]);

  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (windowWidth) {
      setIsMobileDevice(windowWidth < 768);
    }
  }, [windowWidth]);

  const billingData: BillingDTO = useSelector(
    (state: any) => state?.billing?.billingData
  );

  return (
    <Page maxWidth="1040px">
      <Page.Header title={t('configurations')} />
      <Page.Body>
        <Layout columns="1">
          <PricingAlertStatus
            type={billingData?.status}
            daysLeft={billingData?.billingPlan?.dayLeft}
            isCostumerInvoice={billingData?.isCostumerInvoice}
          />
          <Layout.Section>
            {isMobileDevice && (
              <style>{`
                .mobile-config-tabs,
                .mobile-config-tabs > * {
                  max-width: 100vw !important;
                  overflow: hidden !important;
                  box-sizing: border-box !important;
                }
                .mobile-config-tabs [role="tablist"] {
                  overflow-x: auto !important;
                  overflow-y: hidden !important;
                  -webkit-overflow-scrolling: touch;
                  scrollbar-width: none;
                  flex-wrap: nowrap !important;
                  max-width: 100% !important;
                }
                .mobile-config-tabs [role="tablist"]::-webkit-scrollbar {
                  display: none;
                }
                .mobile-config-tabs [role="tablist"] button {
                  white-space: nowrap;
                  flex-shrink: 0;
                }
                .mobile-config-tabs [role="tabpanel"] {
                  max-width: 100% !important;
                  overflow-x: hidden !important;
                  box-sizing: border-box !important;
                }
              `}</style>
            )}
            <div
              className={isMobileDevice ? 'mobile-config-tabs' : undefined}
              style={isMobileDevice ? { width: '100%', maxWidth: '100vw', overflow: 'hidden', boxSizing: 'border-box' } : undefined}
            >
              <Tabs preSelectedTab={tabNumber} key={tabNumber}>
                {TABS.map((tabItem) => (
                  <Tabs.Item label={tabItem.label} key={tabItem.label}>
                    {tabItem.component}
                  </Tabs.Item>
                ))}
              </Tabs>
            </div>
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default Configurations;
