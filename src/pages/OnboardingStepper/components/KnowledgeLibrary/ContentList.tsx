import { Box, Link, Icon } from '@nimbus-ds/components';
import { PlusCircleIcon } from '@nimbus-ds/icons';
import InfiniteScroll from '@/components/InfiniteScroll';
import InfoCard from './InfoCard';
import { useTranslation } from 'react-i18next';
import { DataList } from '@nimbus-ds/patterns';
import { trackingContentAdditionalInformationOpen, trackingShowLibraryContent } from '@/tracking';
import { useMemo } from 'react';
import { useKnowledgeLibraryData } from './Step2DataProvider';

export type ViewMode = 'list' | '2col' | '3col';

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
  source: 'onboarding' | 'settings';
  viewMode?: ViewMode;
  showAddLink?: boolean;
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
  source,
  viewMode = 'list',
  showAddLink = true,
}: ContentListProps) => {
  const { t } = useTranslation('translations');
  
  const sortedContentList = useMemo(() => {
    return [...contentList].sort((a: any, b: any) => {
      // 1. MCP tools (connected/dummy) last
      if (a.class === 'relevant_content_dummy' && b.class !== 'relevant_content_dummy') return 1;
      if (b.class === 'relevant_content_dummy' && a.class !== 'relevant_content_dummy') return -1;
      if (a.class === 'relevant_content_dummy' && b.class === 'relevant_content_dummy') return a.id - b.id;
      
      // 2. Human help enabled (tool: true) at the top
      // This includes items that need review since they also have tool: true
      if (a.tool && !b.tool) return -1;
      if (b.tool && !a.tool) return 1;
      
      // 3. Within human help enabled items, show 'to_review' first for user confirmation
      if (a.tool && b.tool) {
        if (a.state === 'to_review' && b.state !== 'to_review') return -1;
        if (b.state === 'to_review' && a.state !== 'to_review') return 1;
      }
      
      // 4. Maintain order by ID for equal items
      return a.id - b.id;
    });
  }, [contentList]);

  
  
  const isGridMode = viewMode !== 'list';
  const cardLayout = isGridMode ? 'grid' : 'list';

  const renderCards = () => (
    sortedContentList.map((content: any) => (
      <InfoCard
        key={content.id}
        source={source}
        content={content}
        layout={cardLayout}
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
        color={!content.content ? 'neutral' : 'warning'}
        showTags={showTags}
      />
    ))
  );

  const renderAddLink = () => (
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
  );

  if (isGridMode) {
    return (
      <Box display="flex" flexDirection="column" gap="4">
        <InfiniteScroll
          handlePaginationChange={fetchMoreData}
          hasMore={contentList.filter(item => item.class !== 'relevant_content_dummy').length < totalContent}
          fetchingMoreItems={fetchingMoreData}
          containerHeight='450px'
          loadingText={t('settings.step2.loading')}
        >
          <Box
            display="grid"
            gap="4"
            gridTemplateColumns={{
              xs: '1fr',
              md: `repeat(${viewMode === '2col' ? 2 : 3}, 1fr)`,
            }}
            style={{ gridAutoRows: '1fr' }}
          >
            {renderCards()}
          </Box>
        </InfiniteScroll>
        {showAddLink && (
          <Box padding="2">
            {renderAddLink()}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <DataList>
      <InfiniteScroll
        handlePaginationChange={fetchMoreData}
        hasMore={contentList.filter(item => item.class !== 'relevant_content_dummy').length < totalContent}
        fetchingMoreItems={fetchingMoreData}
        containerHeight='450px'
        loadingText={t('settings.step2.loading')}
      >
        {renderCards()}
      </InfiniteScroll>
      {showAddLink && (
        <DataList.Row>
          {renderAddLink()}
        </DataList.Row>
      )}
    </DataList>
  );
};

export default ContentList; 