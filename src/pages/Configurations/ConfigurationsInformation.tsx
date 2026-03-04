import { Alert, Box, Button, Icon, Input, Modal, Text } from '@nimbus-ds/components';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContentForm from '../OnboardingStepper/components/KnowledgeLibrary/ContentForm';
import Step2DataProvider from '../OnboardingStepper/components/KnowledgeLibrary/Step2DataProvider';
import ContentList, { ViewMode } from '../OnboardingStepper/components/KnowledgeLibrary/ContentList';
import AdditionInformation from '../OnboardingStepper/components/KnowledgeLibrary/AdditionInformation';
import HumanHelpReviewBanner from '../OnboardingStepper/components/KnowledgeLibrary/HumanHelpReviewBanner';
import { PlusCircleIcon, SearchIcon } from '@nimbus-ds/icons';
import { trackingContentAdditionalInformationOpen, trackingDeleteLibraryContent } from '@/tracking';

const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  list: 'Lista',
  '2col': '2 colunas',
  '3col': '3 colunas',
};

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
  const [viewMode, setViewMode] = useState<ViewMode>('3col');

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
        {({ contentList, totalContent, onCreateContent, loading, onUpdateContent, onDeleteContent, fetchMoreData, fetchingMoreData, optionalsList, onSearchContent, itemsToReviewCount, onMarkAllReviewed }: any) => (
    <Box gap="6" display="flex" flexDirection="column">
          <>
          <Text>{t('settings.step2.description')}</Text>
          <HumanHelpReviewBanner itemsToReviewCount={itemsToReviewCount} onMarkAllReviewed={onMarkAllReviewed} />
            <Box display="flex" gap="2" alignItems="start">
              <Box flex="1">
                <Input
                  append={<Icon source={<SearchIcon />} />}
                  appendPosition="start"
                  placeholder={t('settings.search-placeholder')}
                  onChange={(event) => handleSearchContent(event, onSearchContent)}
                />
              </Box>
              <Button appearance="primary" onClick={() => {
                toggleOpenAdditionInformation();
                trackingContentAdditionalInformationOpen({
                  source: 'settings',
                  open: true,
                });
              }} style={{ flexShrink: 0 }}>
                <Icon source={<PlusCircleIcon />} color="currentColor" />
                {t('settings.addButton')}
              </Button>
            </Box>

            {/* View mode toggle */}
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              display: 'flex',
              gap: '8px',
              background: '#fff',
              padding: '8px',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}>
              {(['list', '2col', '3col'] as const).map((mode) => (
                <Button
                  key={mode}
                  appearance={viewMode === mode ? 'primary' : 'neutral'}
                  onClick={() => setViewMode(mode)}
                  size="small"
                >
                  {VIEW_MODE_LABELS[mode]}
                </Button>
              ))}
            </div>

            {contentList && contentList.length > 0 && (
              <ContentList
                source='settings'
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
                showTags={false}
                viewMode={viewMode}
                showAddLink={false}
              />
            )}
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
