/**
 * POC Conversations - Adaptado para el entorno de POC
 * Removido las llamadas a Nexo
 */

import { InteractiveList, Page } from '@nimbus-ds/patterns';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Responsive } from '@/components';
import Announcement from '@/components/Announcement/Announcement';
import ModeDataProvider, {
  ModeContext,
  ModeOption,
} from '@/components/conversation/providers/ModeDataProvider';
import { ConversationView } from '@/components/conversation/view';
import { Box, IconButton, Popover, Text } from '@nimbus-ds/components';
import { CogIcon, StatsIcon } from '@nimbus-ds/icons';

const Conversations: React.FC = () => {
  // POC: Removido navigateHeaderRemove(nexo) - no es necesario en POC
  useEffect(() => {
    console.log('[POC] Conversations component mounted');
  }, []);

  const { pathname } = useLocation();
  const conversationId = pathname.split('/').pop();
  const isValidConversationId = /^\d+$/.test(conversationId || '');

  useEffect(() => {
    if (isValidConversationId) {
      console.log(`[POC] Conversation ID from URL: ${conversationId}`);
    }
  }, [conversationId, isValidConversationId]);

  const desktopContent = (
    <div style={{ zoom: 0.9 }}>
      <Page minWidth="100%">
        <Page.Body>
          <ConversationView
            conversationId={(isValidConversationId ? conversationId : '') || ''}
          />
        </Page.Body>
      </Page>
    </div>
  );

  const mobileContent = (
    <Page>
      <ConversationView
        conversationId={(isValidConversationId ? conversationId : '') || ''}
      />
    </Page>
  );

  return (
    <ModeDataProvider>
      <Responsive
        mobileContent={mobileContent}
        desktopContent={desktopContent}
      />
    </ModeDataProvider>
  );
};

export const ButtonStack: React.FC = () => {
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const { selectedMode, handleRadioChange, modeOptions } =
    useContext(ModeContext);

  return (
    <Box display="flex" flexDirection="row" gap="2" alignItems="center">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        p="2"
      >
        <Box display="flex" justifyContent="flex-end" gap="2">
          <Popover
            padding="none"
            content={
              <>
                <Box>
                  <Box padding="2">
                    <Text fontWeight="bold">
                      {t('conversations.default-response-mode')}
                    </Text>
                  </Box>

                  <InteractiveList>
                    {modeOptions.map((option: ModeOption) => (
                      <InteractiveList.RadioItem
                        key={option.number}
                        title={option.title}
                        description={option.description}
                        radio={{
                          name: 'radio-element',
                          checked: selectedMode.title === option.title,
                          onChange: () => handleRadioChange(option),
                        }}
                      />
                    ))}
                  </InteractiveList>
                </Box>
              </>
            }
          >
            <IconButton
              source={
                selectedMode.number !== 1 ? (
                  <img src="/imgs/ia-icon-paused.svg" alt="WandIcon" />
                ) : (
                  <img src="/imgs/ia-icon.svg" alt="WandIcon" />
                )
              }
              size="2rem"
            />
          </Popover>

          <IconButton
            source={<StatsIcon />}
            size="2rem"
            onClick={() => navigate('/statistics')}
          />
          <Announcement position="bottom">
            <IconButton
              source={<CogIcon />}
              size="2rem"
              onClick={() => navigate('/configurations')}
            />
          </Announcement>
        </Box>
      </Box>
    </Box>
  );
};

export default Conversations;
