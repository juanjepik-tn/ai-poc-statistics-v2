import React, { useState } from 'react';
import { Box, Toggle, Text } from '@nimbus-ds/components';
import { Page, Layout } from '@nimbus-ds/patterns';
import VerificationFlow from './components/VerificationFlow';
import StatusPanel from './components/StatusPanel';

type View = 'flow' | 'status';

const PLBVVerification: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('flow');

  return (
    <Page maxWidth="800px">
      <Page.Header title="Business Verification" subtitle="Partner-Led Business Verification (PLBV) — Demo" />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="3"
              paddingBottom="4"
            >
              <Text
                fontWeight={activeView === 'flow' ? 'bold' : 'regular'}
                color={activeView === 'flow' ? 'primary-textLow' : 'neutral-textLow'}
              >
                Flujo de verificación
              </Text>
              <Toggle
                name="view-toggle"
                checked={activeView === 'status'}
                onChange={() => setActiveView(activeView === 'flow' ? 'status' : 'flow')}
              />
              <Text
                fontWeight={activeView === 'status' ? 'bold' : 'regular'}
                color={activeView === 'status' ? 'primary-textLow' : 'neutral-textLow'}
              >
                Panel de estado
              </Text>
            </Box>
          </Layout.Section>
        </Layout>

        {activeView === 'flow' ? (
          <VerificationFlow onSwitchToStatus={() => setActiveView('status')} />
        ) : (
          <StatusPanel />
        )}
      </Page.Body>
    </Page>
  );
};

export default PLBVVerification;
