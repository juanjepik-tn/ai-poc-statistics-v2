import {
  Alert,
  Box,
  Button,
  Card,
  Icon,
  Link,
  Modal,
  Tag,
  Text,
  useToast
} from '@nimbus-ds/components';
import { HelpLink, Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

import { nexo } from '@/app';
import ContentForm from './ContentForm';
import Step2DataProvider from './Step2DataProvider';
import { MCP_TITLES } from '@/constants/mcpRelevantContent';
import AdditionInformation from './AdditionInformation';
import { IContentItem } from './step2.types';
import ContentList from './ContentList';
import { trackingDeleteLibraryContent, trackingHelpLink } from '@/tracking';
import { useHelpLink } from '@/hooks';
import { ExternalLinkIcon } from '@nimbus-ds/icons';


type Step2Props = {
  nextStep: () => void;
  cancelOnboarding?: () => void;
  prevStep: () => void;
};

const KnowledgeLibrary: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  // const navigate = useNavigate();
  const { t } = useTranslation('translations');
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prevState) => !prevState);
  const [openAdditionInformation, setOpenAdditionInformation] = useState(false);
  const toggleOpenAdditionInformation = () => setOpenAdditionInformation((prevState) => !prevState);
  const [editContent, setEditContent] = useState<any | undefined>(undefined);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const handleConfirmAlert = () => setConfirmAlert((prevState) => !prevState);
  const [currentEntity, setCurrentEntity] = useState<any | undefined>(undefined);
  const [proxStep, setProxStep] = useState(false);
  const { link, textKey } = useHelpLink('KnowledgeLibrary');

  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);
  return (
    <Step2DataProvider>
      {({ contentList, totalContent, onCreateContent, loading, onUpdateContent, onDeleteContent, fetchMoreData, fetchingMoreData, optionalsList, mcpEnabled }: any) => {
        
        const validateMandatoryFields = (contentList: any) => {
          let hasIncompleteMandatoryContent = false;

          contentList.forEach((content: IContentItem) => {
            if (content.class === 'relevant_content_mandatory' && !content.content) {
              const isMCPTool = mcpEnabled && MCP_TITLES.includes(content.title as any);        
              if (!isMCPTool) {
                hasIncompleteMandatoryContent = true;
              }
            }
          });
          setProxStep(true);

          if (hasIncompleteMandatoryContent) {
            addToast({
              type: 'danger',
              text: t('settings.step2.error-mandatory-content'),
              duration: 4000,
              id: 'mandatory-content',
            });
            return false;
          }

          return true;
        }

        const validateBeforeNextStep = (contentList: any) => {
          if (contentList.length === 0) {
            addToast({
              type: 'danger',
              text: t('settings.step2.error-validator'),
              duration: 4000,
              id: 'create-content',
            });
            return;
          }

          if (validateMandatoryFields(contentList)) {
            nextStep();
          }
        }

        return (
        <>
          <Page.Header
            title={t('settings.step2.title')}
            subtitle={t('settings.step2.description')}
          >
            <Tag appearance="primary">
              <Text color="primary-textLow">
                {t('settings.step', { step: 2, total: 4 })}
              </Text>
            </Tag>
          </Page.Header>
          <Page.Body>
            <Layout>
              <Layout.Section>
                <Card padding="small">
                  <ContentList
                    contentList={contentList}
                    totalContent={totalContent}
                    fetchMoreData={fetchMoreData}
                    fetchingMoreData={fetchingMoreData}
                    setEditContent={setEditContent}
                    toggleOpen={toggleOpen}
                    setCurrentEntity={setCurrentEntity}
                    setConfirmAlert={setConfirmAlert}
                    proxStep={proxStep}
                    toggleOpenAdditionInformation={toggleOpenAdditionInformation}
                    showTags={true}
                    onToggleHumanAttention={(content: any) => {                      
                      content.tool = !content.tool;
                      onUpdateContent(content.id, content, content.class);
                    }}
                    source='onboarding'
                  />
                </Card>
                
                  <Box alignSelf="flex-end" display="flex" justifyContent="flex-end" gap="2">
                    <Button onClick={prevStep} appearance="neutral">
                      {t('settings.previous-step')}
                    </Button>
                    <Button onClick={() => validateBeforeNextStep(contentList)} appearance="primary">
                      {t('settings.next-step')}
                    </Button>
                  </Box>
                  {link && (
              <HelpLink>
                <Link
                  as="a"
                  onClick={() => {
                    trackingHelpLink({ source: 'KnowledgeLibrary' });                    
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
          <ContentForm source='onboarding' open={open} toggleOpen={toggleOpen} onCreateContent={onCreateContent} loading={loading} content={editContent} onUpdateContent={onUpdateContent} />
          <AdditionInformation source='onboarding' open={openAdditionInformation} toggleOpen={toggleOpenAdditionInformation} optionalsList={optionalsList} onCreateContent={onCreateContent} />
          <Modal open={confirmAlert} onDismiss={handleConfirmAlert} padding="none">
            <Alert title={t('settings.step2.remove-alert.title')}>
              {t('settings.step2.remove-alert.description')}
              <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap="2">
                <Button onClick={handleConfirmAlert}>{t('settings.step2.remove-alert.cancel')}</Button>
                <Button appearance="danger" onClick={() => {                  
                  trackingDeleteLibraryContent({
                    content_title: currentEntity.title,
                    content_id: currentEntity.id,
                    source: 'onboarding',
                  });
                  onDeleteContent(currentEntity.id);
                  handleConfirmAlert();
                }}>{t('settings.step2.remove-alert.confirm')}</Button>
              </Box>
            </Alert>
          </Modal>
        </>
        );
      }}
    </Step2DataProvider>
  );
};

export default KnowledgeLibrary;
