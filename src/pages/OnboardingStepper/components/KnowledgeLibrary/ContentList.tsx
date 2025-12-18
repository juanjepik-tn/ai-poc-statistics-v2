import { Link, Icon } from '@nimbus-ds/components';
import { PlusCircleIcon } from '@nimbus-ds/icons';
import InfiniteScroll from '@/components/InfiniteScroll';
import InfoCard from './InfoCard';
import { useTranslation } from 'react-i18next';
import { DataList } from '@nimbus-ds/patterns';
import { trackingContentAdditionalInformationOpen, trackingShowLibraryContent } from '@/tracking';
import { useMemo } from 'react';
import { useKnowledgeLibraryData } from './Step2DataProvider';

interface ContentListProps {
  contentList: any[];
  totalContent: number;
  fetchMoreData: () => void;
  fetchingMoreData: boolean;
  setEditContent: (content: any) => void;
  toggleOpen: () => void;
  setCurrentEntity: (entity: any) => void;
  setConfirmAlert: (show: boolean) => void;
  proxStep: boolean;
  toggleOpenAdditionInformation: () => void;
  showTags: boolean;
  onToggleHumanAttention?: (content: any) => void;
  source: 'onboarding' | 'settings';
}
const ContentList = ({
  contentList,
  totalContent,
  fetchMoreData,
  fetchingMoreData,
  setEditContent,
  toggleOpen,
  setCurrentEntity,
  setConfirmAlert,
  proxStep,
  toggleOpenAdditionInformation,
  showTags,
  onToggleHumanAttention,
  source,
}: ContentListProps) => {
  const { t } = useTranslation('translations');
  
  const sortedContentList = useMemo(() => {
    return [...contentList].sort((a: any, b: any) => {
      if (a.class === 'relevant_content_dummy' && b.class !== 'relevant_content_dummy') return -1;
      if (b.class === 'relevant_content_dummy' && a.class !== 'relevant_content_dummy') return 1;
      if (a.class === 'relevant_content_dummy' && b.class === 'relevant_content_dummy') return a.id - b.id;
      return 0;
    });
  }, [contentList]);

  
  
  return (
    <DataList>
      <InfiniteScroll
        handlePaginationChange={fetchMoreData}
        hasMore={contentList.filter(item => item.class !== 'relevant_content_dummy').length < totalContent}
        fetchingMoreItems={fetchingMoreData}
        containerHeight='450px'
        loadingText={t('settings.step2.loading')}
      >
        {sortedContentList.map((content: any) => (
            <InfoCard
              key={content.id}
              source={source}
              content={content}
              onClick={() => {                
                setEditContent(content);
                trackingShowLibraryContent({
                  content_id: content.id,
                  content_title: content.title,
                  source: source,
                });
                toggleOpen();
              }}
              onDelete={() => {
                setCurrentEntity(content);
                setConfirmAlert(true);
              }}
              color={content.class === 'relevant_content_mandatory' && proxStep && !content.content ? 'danger' : 'warning'}
              showTags={showTags}
              onToggleHumanAttention={() => {                
                onToggleHumanAttention && onToggleHumanAttention(content);
              }}
            />
          ))}
      </InfiniteScroll>
      <DataList.Row>
        <Link appearance="primary" as="a" textDecoration="none" onClick={() => {
          toggleOpenAdditionInformation();
          trackingContentAdditionalInformationOpen({
            source: source,
            open: true,
          });
        }}>
          <Icon color="primary-interactive" source={<PlusCircleIcon />} />
          {t('settings.step2.actions.add-other-information')}
        </Link>
      </DataList.Row>
    </DataList>
  );
};

export default ContentList; 