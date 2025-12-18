import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
// routes
// types
// components
//
import { ButtonStack } from '@/pages/Conversations/Conversations';
import {
  Box as BoxNimbus,
  Icon,
  Input,
  Spinner,
  Text,
  Title
} from '@nimbus-ds/components';
import { InfoCircleIcon, SearchIcon } from '@nimbus-ds/icons';
import { DataList, EmptyMessage } from '@nimbus-ds/patterns';
import { useTranslation } from 'react-i18next';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationChatView from './conversation-chat-view';
import ConversationNavItem from './conversation-nav-item';
import ConversationNavSearchResults from './conversation-nav-search-results';
import ConversationTabs from './header-mode-filter-tab';
import TagFilterSelect from './header-tag-filter-select';
import { useModeCustomer } from './providers/ModeCustomerDataProvider';
import PaymentRequiredAlert from '../PricingAlertStatus/PaymentRequiredAlert';
import { BillingDTO } from '@/types/billingDTO';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  fetchingMoreConversations: boolean;
  currentConversationId: string | null;
  conversations: any[];
  onClickConversation: (conversation: any) => void;
  handlePaginationChange: any;
  totalConversations: number;
  updateConversation: Function;
  updatePauseStatus: Function;
  handleNeedAttention: any;
  handleSearch: (query: string) => void;
  storeSelectedMode: any;
  unreadMessagesCount: number;
  markAsResolved: boolean;
  onUpdateTags: (conversationId: number) => void;
  handleTagFilter: (value: string) => void;
  availableReferenceIds: string[];
};

export default function ConversationNavMobile({
  loading,
  fetchingMoreConversations,
  conversations,
  onClickConversation,
  currentConversationId,
  handlePaginationChange,
  totalConversations,
  updateConversation,
  updatePauseStatus,
  handleNeedAttention,
  handleSearch,
  markAsResolved,
  storeSelectedMode,
  unreadMessagesCount,
  onUpdateTags,
  handleTagFilter,
  availableReferenceIds,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [showChat, setShowChat] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null,
  );
  const [distanceBottom, setDistanceBottom] = useState(0);
  const { setCustomerId } = useModeCustomer();
  const { t } = useTranslation('translations');
  // hasMore should come from the place where you do the data fetching
  // for example, it could be a prop passed from the parent component
  // or come from some store
  const [hasMore, setHasMore] = useState(true);
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);
  
  useEffect(() => {
    setHasMore(conversations.length < totalConversations);
  }, [conversations, totalConversations]);

  const scrollListener = useCallback(() => {
    const bottom =
      containerRef.current &&
      containerRef.current.scrollHeight - containerRef.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom && bottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    if (
      containerRef.current &&
      bottom &&
      containerRef.current.scrollTop > bottom - distanceBottom &&
      hasMore &&
      !fetchingMoreConversations
    ) {
      handlePaginationChange();
    }
  }, [
    hasMore,
    fetchingMoreConversations,
    distanceBottom,
    handlePaginationChange,
  ]);

  useEffect(() => {
    const tableRef: any = containerRef.current;
    if (tableRef) {
      tableRef.addEventListener('scroll', scrollListener);
    }
    return () => {
      if (tableRef) {
        tableRef.removeEventListener('scroll', scrollListener);
      }
    };
  }, [scrollListener]);

  const timeoutIdRef = useRef<any>(undefined);

  const handleSearchContact = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const searchQuery = value;
      clearTimeout(timeoutIdRef.current);
      if (value.length >= 3) {
        timeoutIdRef.current = setTimeout(() => {
          // Aquí puedes realizar tu llamada a la API con el valor
          handleSearch(searchQuery);
        }, 500);
      }
      if (value.length === 0) {
        handleSearch('');
        const { value } = event.target;
        const searchQuery = value;
        clearTimeout(timeoutIdRef.current);
        if (value.length >= 3) {
          timeoutIdRef.current = setTimeout(() => {
            // Aquí puedes realizar tu llamada a la API con el valor
            handleSearch(searchQuery);
          }, 500);
        }
        if (value.length === 0) {
          handleSearch('');
        }
      }
    },
    [],
  );
  const handleClickResult = useCallback((result: any) => {
    setSearchQuery('');
    onClickConversation(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickConversation = (conversation: any) => {
    // onCloseDesktop();
    // onClickConversation(conversation);
    setSelectedConversation(conversation);
    setCustomerId(conversation?.customer?.id);
    setShowChat(true);
  };

  const renderList = (
    <>
      {conversations.length === 0 ? (
        <BoxNimbus
          display="flex"
          flexDirection="row"
          py="12"
          alignItems="center"
          justifyContent="center"
        >
          <EmptyMessage
            text={t('conversations.no-conversations')}
            title=""
            icon={<InfoCircleIcon size={32} color="black" />}
          />
        </BoxNimbus>
      ) : (
        <DataList>
          {(loading ? [...Array(50)] : conversations).map(
            (conversation, index) =>
              conversation?.id ? (
                <DataList.Row key={conversation.id} padding="none">
                  <ConversationNavItem
                    collapse={false}
                    conversation={conversation}
                    onClickConversation={() =>
                      handleClickConversation(conversation)
                    }
                    selected={conversation.id === currentConversationId}
                    markAsResolved={markAsResolved}
                    storeSelectedMode={storeSelectedMode}
                  />
                </DataList.Row>
              ) : (
                <ChatNavItemSkeleton key={index} />
              ),
          )}
        </DataList>
      )}
    </>
  );

  const renderListResults = (
    <ConversationNavSearchResults
      searchQuery={searchQuery}
      searchResults={searchResults}
      onClickResult={handleClickResult}
    />
  );
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');

  const handleFilterChange = (value: string) => {
    handleNeedAttention();
    setSelectedFilter(value);
  };
  const handleTagFilterChange = (value: string) => {
    setSelectedTagFilter(value);
    handleTagFilter(value);
  };
  const renderContent = (
    <>
      <BoxNimbus display="flex" flexDirection="column" height="100%" gap="2">
        <BoxNimbus
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          paddingX="4"
          paddingY="2"
          alignItems="center"
        >
          <Title as="h3">{t('app.title')}</Title>
          <ButtonStack />
        </BoxNimbus>
        <BoxNimbus paddingX="4" pb="2" gap="1">
          <Input
            disabled={!billingData?.activeStatus}
            append={<Icon source={<SearchIcon />} />}
            appendPosition="start"
            placeholder={t('conversations.search')}
            onChange={handleSearchContact}
          />
        <ConversationTabs
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange}
        unreadMessagesCount={unreadMessagesCount}
      />
        </BoxNimbus>
        <TagFilterSelect
        selectedTagFilter={selectedTagFilter}
        handleTagFilterChange={handleTagFilterChange}
        availableReferenceIds={availableReferenceIds}
      />
        <BoxNimbus
          ref={containerRef}
          padding="none"
          overflow="scroll"
          height="75vh"
        >
          {billingData?.status === 'inactive' && <PaymentRequiredAlert />}
          {billingData?.status !== 'inactive' && (<>
          {!searchQuery ? renderList : renderListResults}
          {fetchingMoreConversations && (
            <>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                sx={{ pr: 5, pl: 2.5 }}
                >
                <Spinner />
                <Text>{t('conversations.loading-more')}</Text>
              </Stack>
            </>
          )}
          </>
          )}
        </BoxNimbus>
      </BoxNimbus>
    </>
  );
  const updateConversationTags = () => {
    setSelectedConversation({
      ...selectedConversation,
      customer: {
        ...selectedConversation.customer,
        undoneTags: [],
      },
    });
    onUpdateTags(selectedConversation?.id);
  };
  return (
    <>
      {renderContent}

      {selectedConversation?.id && (
        <ConversationChatView
          showChat={showChat}
          conversation={selectedConversation}
          conversationId={selectedConversation?.id}
          onUpdateChat={() => {
            updateConversation(selectedConversation?.id);
          }}
          onUpdatePaused={(val) => {
            updatePauseStatus(val);
          }}
          onParentEvent={() => setShowChat(false)}
          onUpdateChatWithOrder={() => {
            updateConversation(selectedConversation?.id);
          }}
          onClickConversation={() => onClickConversation(selectedConversation)}
          onUpdateTags={updateConversationTags}
        />
      )}
    </>
  );
}
