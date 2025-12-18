import { Responsive } from '@/components';
import { Alert, Box, Button, Modal } from '@nimbus-ds/components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListDesktop, ListMobile } from './components';
import ContentForm from './ContentForm';
import { IContentItem } from './step2.types';

interface Props {
  contentList: IContentItem[];
  totalContent: number;
  onCreateContent: (formData: any) => boolean;
  onUpdateContent?: (contentId: string, formData: any) => boolean;
  categories: any[];
  loading: boolean;
  onDeleteContent: (id: number) => void;
  fetchMoreData: () => void;
  fetchingMoreData: boolean;
}

const ContentTable: React.FC<Props> = ({ contentList, totalContent, onCreateContent, loading, onUpdateContent, onDeleteContent, fetchMoreData, fetchingMoreData }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prevState) => !prevState);
  // @ts-ignore
  const [popoverOpen, setPopoverOpen] = useState<number | null>(null);
  const [currentEntity, setCurrentEntity] = useState<IContentItem>();
  const { t } = useTranslation('translations');
  const [confirmAlert, setConfirmAlert] = useState(false);
  const handleConfirmAlert = () => setConfirmAlert((prevState) => !prevState);

  const handleEdit = (row: IContentItem) => {
    toggleOpen(); 
    setCurrentEntity(row);
    setPopoverOpen(null);
  };

  const handleDelete = (content: IContentItem) => {    
    setCurrentEntity(content);
    setConfirmAlert(true);
    setPopoverOpen(null);
  };
  return (
    <>
      <Responsive
        mobileContent={
          <ListMobile
            contentList={contentList}
            onEditContent={handleEdit}
            fetchMoreData={fetchMoreData}
            totalContent={totalContent}
            onDeleteContent={handleDelete}
            fetchingMoreData={fetchingMoreData}
          />
        }
        desktopContent={
          <ListDesktop
            fetchMoreData={fetchMoreData}
            contentList={contentList}
            totalContent={totalContent}
            onEditContent={handleEdit}
            onDeleteContent={handleDelete}
          />
        }
      ></Responsive>
      <ContentForm
        source='onboarding'
        onCreateContent={onCreateContent}
        open={open}
        loading={loading}
        toggleOpen={toggleOpen}
        content={currentEntity || undefined}
        onUpdateContent={onUpdateContent}
      />
        <Modal open={confirmAlert} onDismiss={handleConfirmAlert} padding="none">
        <Alert title={t('settings.step2.remove-alert.title')}>
        {t('settings.step2.remove-alert.description')}
          <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap="2">
            <Button onClick={handleConfirmAlert}>{t('settings.step2.remove-alert.cancel')}</Button>
            <Button appearance="danger" onClick={()=>{
              currentEntity && onDeleteContent(currentEntity.id);
              handleConfirmAlert();
            }}>{t('settings.step2.remove-alert.confirm')}</Button>
          </Box>
        </Alert>
      </Modal>
    </>
  );
};

export default ContentTable;
