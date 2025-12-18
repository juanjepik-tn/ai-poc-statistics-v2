/**
 * POC Configurations - Adaptado para funcionar dentro del AdminLayout
 * Removido AppShell propio para evitar conflictos
 */

import { Box, Radio, Tabs, Text } from '@nimbus-ds/components';
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
import useFeatureFlag from './hooks/useFeatureFlag';

const Configurations: React.FC = () => {
  const { t } = useTranslation('translations');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const { tab } = useParams();
  const tabNumber = tab ? parseInt(tab, 10) : 0;
  const { isHumanSupportEnabled } = useFeatureFlag();

  const TABS = useMemo(() => {
    const baseTabs = [
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
    ];

    if (isHumanSupportEnabled) {
      baseTabs.push({
        class: 'human-support',
        label: t('config.humanSupport'),
        component: <ConfigurationsHumanSupport />,
      });
    }

    baseTabs.push(
      {
        class: 'test',
        label: t('config.test'),
        component: <ConfigurationsTest />,
      },
      {
        class: 'channels',
        label: t('config.channels'),
        component: <ConfigurationsInstances />,
      }
    );

    return baseTabs;
  }, [t, isHumanSupportEnabled]);

  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (windowWidth) {
      setIsMobileDevice(windowWidth < 768);
    }
  }, [windowWidth]);

  const [selectedFilter, setSelectedFilter] = useState('preferences');
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFilter(event.target.value);
  };

  const billingData: BillingDTO = useSelector(
    (state: any) => state?.billing?.billingData
  );

  const renderMobileContent = () => {
    switch (selectedFilter) {
      case 'information':
        return <ConfigurationsInformation />;
      case 'preferences':
        return <ConfigurationsPreferences />;
      case 'test':
        return <ConfigurationsTest />;
      case 'channels':
        return <ConfigurationsInstances />;
      case 'human-support':
        return isHumanSupportEnabled ? <ConfigurationsHumanSupport /> : null;
      default:
        return <ConfigurationsPreferences />;
    }
  };

  // Sin AppShell propio - se renderiza dentro del AdminLayout
  return (
    <Page maxWidth="800px">
      <Page.Header title={t('configurations')} />
      <Page.Body>
        <Layout columns="1">
          <PricingAlertStatus
            type={billingData?.status}
            daysLeft={billingData?.billingPlan?.dayLeft}
            isCostumerInvoice={billingData?.isCostumerInvoice}
          />
          <Layout.Section>
            {isMobileDevice ? (
              <>
                <Box
                  display="flex"
                  flexDirection="row"
                  flexWrap="wrap"
                  gap="2"
                  padding="none"
                  paddingBottom="2"
                  borderTopWidth="none"
                  borderLeftWidth="none"
                  borderRightWidth="none"
                  borderStyle="solid"
                  borderColor="neutral-surfaceHighlight"
                >
                  {TABS.map((tabItem: any) => (
                    <Radio
                      key={tabItem.class}
                      name={tabItem.class}
                      as="button"
                      value={tabItem.class}
                      label={tabItem.label}
                      checked={selectedFilter === tabItem.class}
                      onChange={handleFilterChange}
                    />
                  ))}
                </Box>
                {renderMobileContent()}
              </>
            ) : (
              <Tabs preSelectedTab={tabNumber}>
                {TABS.map((tabItem) => (
                  <Tabs.Item label={tabItem.label} key={tabItem.label}>
                    {tabItem.component}
                  </Tabs.Item>
                ))}
              </Tabs>
            )}
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default Configurations;
