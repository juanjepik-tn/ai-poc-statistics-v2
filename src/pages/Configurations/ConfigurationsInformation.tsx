import { Alert, Box, Button, Icon, Input, Modal, Text } from '@nimbus-ds/components';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContentForm from '../OnboardingStepper/components/KnowledgeLibrary/ContentForm';
import Step2DataProvider from '../OnboardingStepper/components/KnowledgeLibrary/Step2DataProvider';
import ContentList from '../OnboardingStepper/components/KnowledgeLibrary/ContentList';
import AdditionInformation from '../OnboardingStepper/components/KnowledgeLibrary/AdditionInformation';
import { SearchIcon } from '@nimbus-ds/icons';
import { trackingDeleteLibraryContent } from '@/tracking';

const ConfigurationsInstances: React.FC = () => {
  const { t } = useTranslation('translations');  
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prevState) => !prevState);
  const [editContent, setEditContent] = useState<any | undefined>(undefined);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const handleConfirmAlert = () => setConfirmAlert((prevState) => !prevState);
  const [currentEntity, setCurrentEntity] = useState<any | undefined>(undefined);
  const [proxStep] = useState(false);
  const [openAdditionInformation, setOpenAdditionInformation] = useState(false);
  const toggleOpenAdditionInformation = () => setOpenAdditionInformation((prevState) => !prevState);
  const timeoutIdRef = useRef<any>(undefined);

  const handleSearchContent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, handleSearch: (searchQuery: string) => void) => {
      const { value } = event.target;
      const searchQuery = value;
      clearTimeout(timeoutIdRef.current);
      if (value.length >= 3) {
        timeoutIdRef.current = setTimeout(() => {
          handleSearch(searchQuery);
        }, 500);
      }
      if (value.length === 0) {
        handleSearch('');
      }
    },
    []
  );
  
  return (
      <Step2DataProvider>
        {({ contentList, totalContent, onCreateContent, loading, onUpdateContent, onDeleteContent, fetchMoreData, fetchingMoreData, optionalsList, onSearchContent }: any) => (
    <Box gap="6" display="flex" flexDirection="column">
          <>
          <Text>{t('settings.step2.description')}</Text>          
            <Box display="flex" justifyContent="flex-end" ml="auto" width="400px">
              <Input
              append={<Icon source={<SearchIcon />} />}
              appendPosition="start"
              placeholder={t('settings.search-placeholder')}
              onChange={(event) => handleSearchContent(event, onSearchContent)}
              width="100%"
              />
            </Box>
            {contentList && contentList.length > 0 && <ContentList source='settings' contentList={contentList} totalContent={totalContent} fetchMoreData={fetchMoreData} fetchingMoreData={fetchingMoreData} setEditContent={setEditContent} toggleOpen={toggleOpen} setCurrentEntity={setCurrentEntity} setConfirmAlert={setConfirmAlert} proxStep={proxStep} toggleOpenAdditionInformation={toggleOpenAdditionInformation} showTags={false} onToggleHumanAttention={(content: any) => {                      
                      content.tool = !content.tool;
                      onUpdateContent(content.id, content, content.class);
                    }} />}
            <ContentForm source='settings' open={open} toggleOpen={toggleOpen} onCreateContent={onCreateContent} loading={loading} content={editContent} onUpdateContent={onUpdateContent} />
            <AdditionInformation source='settings' open={openAdditionInformation} toggleOpen={toggleOpenAdditionInformation} optionalsList={optionalsList} onCreateContent={onCreateContent} />
            <Modal open={confirmAlert} onDismiss={handleConfirmAlert} padding="none">
            <Alert title={t('settings.step2.remove-alert.title')}>
              {t('settings.step2.remove-alert.description')}
              <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap="2">
                <Button onClick={handleConfirmAlert}>{t('settings.step2.remove-alert.cancel')}</Button>
                <Button appearance="danger" onClick={() => {
                  trackingDeleteLibraryContent({
                    content_title: currentEntity.title,
                    content_id: currentEntity.id,
                    source: 'settings',
                  });
                  onDeleteContent(currentEntity.id);
                  handleConfirmAlert();
                }}>{t('settings.step2.remove-alert.confirm')}</Button>
              </Box>
            </Alert>
          </Modal>
          </>
          
    </Box>
    )}
      </Step2DataProvider>
  );
};
export default ConfigurationsInstances;
