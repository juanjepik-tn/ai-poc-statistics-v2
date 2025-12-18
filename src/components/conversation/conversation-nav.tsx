import { useCallback, useContext, useEffect, useRef, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
// hooks

// routes
// import { paths } from 'src/routes/paths';
// types
// import { IChatParticipant } from 'src/types/chat';
// components
// import { useRouter } from 'src/routes/hook';
//
// import { IConversation } from 'src/types/conversation';

import { IConversation } from '@/types/conversation';
import { Box as BoxNimbus, Icon, IconButton as IconButtonNimbus, Input, Popover, Spinner, Text, Title, Tooltip } from '@nimbus-ds/components';
import { CogIcon, InfoCircleIcon, SearchIcon, StatsIcon } from '@nimbus-ds/icons';
import { EmptyMessage, InteractiveList } from '@nimbus-ds/patterns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Iconify from '../iconify/iconify';
import { useCollapseNav } from '../playground/hooks';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationNavItem from './conversation-nav-item';
import ConversationNavSearchResults from './conversation-nav-search-results';
import ConversationTabs from './header-mode-filter-tab';
import TagFilterSelect from './header-tag-filter-select';
import { useResponsive } from './hooks/use-responsive';
import { ModeContext, ModeOption } from './providers/ModeDataProvider';
import { BillingDTO } from '@/types/billingDTO';
import { useSelector } from 'react-redux';
import Announcement from '../Announcement/Announcement';

// ----------------------------------------------------------------------

const NAV_WIDTH = 350;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  contacts: any[];
  conversations: IConversation[];
  onClickConversation: (conversation: any) => void;
  currentConversationId: string | null;
  handlePaginationChange: any;
  totalConversations: number;
  fetchingMoreConversations: boolean;
  handleNeedAttention: any;
  handleSearch: (query: string) => void;
  handleTagFilter: (tag: string) => void;
  availableReferenceIds: string[];
  markAsResolved: boolean;
  storeSelectedMode: any;
  unreadMessagesCount: number;
};

export default function ConversationNav({
  conversations,
  onClickConversation,
  currentConversationId,
  handlePaginationChange,
  totalConversations,
  fetchingMoreConversations,
  handleNeedAttention,
  handleSearch,
  handleTagFilter,
  availableReferenceIds,
  loading,
  markAsResolved,
  storeSelectedMode,
  unreadMessagesCount,
}: Props) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const {
    collapseDesktop,
    onCloseDesktop,
    //
    openMobile,
    onOpenMobile,
    onCloseMobile,
  } = useCollapseNav();

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation('translations');

  const [distanceBottom, setDistanceBottom] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const billingData: BillingDTO = useSelector((state: any) => state?.billing?.billingData);
  useEffect(() => {
    setHasMore(conversations.length < totalConversations);
  }, [conversations, totalConversations]);
  const scrollListener = useCallback(() => {
    const bottom = containerRef.current && containerRef.current.scrollHeight - containerRef.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom && bottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    if (containerRef.current && bottom && containerRef.current.scrollTop > bottom - distanceBottom && hasMore && !fetchingMoreConversations) {
      handlePaginationChange();
    }
  }, [hasMore, fetchingMoreConversations, distanceBottom, handlePaginationChange]);

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

  // const handleToggleNav = useCallback(() => {
  //   if (mdUp) {
  //     onCollapseDesktop();
  //   } else {
  //     onCloseMobile();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mdUp]);
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
      }
    },
    []
  );

  /*
    const handleSearchContact = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
  
        setSearchQuery(value);
  
        if (value) {
          const results = conversations?.filter((contact) =>
            contact.name.toLowerCase().includes(value.toLowerCase()),
          );
  
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      },
      [conversations],
    ); */

  const handleClickResult = useCallback(
    (result: any) => {
      setSearchQuery('');
      onClickConversation(result);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [onCloseDesktop],
  );

  const handleClickConversation = (conversation: any) => {
    onCloseDesktop();
    onClickConversation(conversation);
  };

  /* const handleClickAwaySearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []); */

  const renderMobileBtn = (
    <IconButton
      onClick={onOpenMobile}
      sx={{
        left: 0,
        top: 84,
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        borderRadius: `0 12px 12px 0`,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        // '&:hover': {
        //   bgcolor: theme.palette.primary.darker,
        // },
      }}
    >
      <Iconify width={16} icon="solar:users-group-rounded-bold" />
    </IconButton>
  );

  const renderList = (
    <>
      {/* {(loading ? [...Array(50)] : conversations).map((conversation, index) =>
        conversation?.id ? (
          <ConversationNavItem
            key={conversation.id}
            collapse={collapseDesktop}
            conversation={conversation}
            onClickConversation={() => handleClickConversation(conversation)}
            selected={conversation.id === currentConversationId}
          />
        ) : (
          <ChatNavItemSkeleton key={index} />
        ),
      )} */}

      {loading ? [...Array(10)].map((_, index) => <ChatNavItemSkeleton key={index} />) : conversations.map((conversation, index) =>
        conversation?.id ? (
          <ConversationNavItem
            key={conversation.id}
            collapse={collapseDesktop}
            conversation={conversation}
            onClickConversation={() => handleClickConversation(conversation)}
            selected={conversation.id === currentConversationId}
            markAsResolved={markAsResolved}
            storeSelectedMode={storeSelectedMode}
          />
        ) : (
          <ChatNavItemSkeleton key={index} />
        ),
      )}
      {conversations.length === 0 && (
        <BoxNimbus display="flex" flexDirection="row" py="12" alignItems="center" justifyContent="center">
          <EmptyMessage
            text={t('conversations.no-conversations')}
            title=''
            icon={<InfoCircleIcon size={32} color="black" />}
          />
        </BoxNimbus>
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

  const { selectedMode, handleRadioChange, modeOptions } = useContext(ModeContext);
  const renderContent = (
    <>
      <BoxNimbus p="4" gap="1">
        <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" py="2">
          <Title as="h3">{t('app.title')}</Title>
          <BoxNimbus display="flex" justifyContent="flex-end" gap="2">
            <Popover
              padding='none'  
              enabledClick={billingData?.activeStatus}
              content={
                <>
                  <BoxNimbus>
                    <BoxNimbus padding='2'>
                      <Text fontWeight="bold">
                        {t('conversations.default-response-mode')}
                      </Text>
                    </BoxNimbus>

                    <InteractiveList>
                      {modeOptions.map((option: ModeOption) => (
                        <InteractiveList.RadioItem
                          key={option.number}
                          title={option.title}
                          description={option.description}
                          radio={{
                            name: 'radio-element',
                            checked: selectedMode.title === option.title,
                            onChange: () => handleRadioChange(option)
                          }}
                        />
                      ))}
                    </InteractiveList>
                  </BoxNimbus>
                </>
              }
            >

              {/* 
                <Button>
                  <img src="/imgs/ia-icon.svg" alt="WandIcon" />

                  {selectedMode.title}
                </Button> 
                */}
              <Tooltip content={selectedMode.title} position="top">
                <IconButtonNimbus
                  disabled={!billingData?.activeStatus}
                  source={selectedMode.number !== 1 ? <img src="/imgs/ia-icon-paused.svg" alt="WandIcon" /> : <img src="/imgs/ia-icon.svg" alt="WandIcon" />}
                  size="2rem"
                />
              </Tooltip>
            </Popover>

             <IconButtonNimbus
              source={<StatsIcon />}
              size="2rem"
              onClick={() => navigate('/statistics')}
            /> 
            
            <Announcement position="bottom">
                <IconButtonNimbus
                  source={<CogIcon />}
                  size="2rem"
                  onClick={() => navigate('/configurations')}
                />
            </Announcement>
          </BoxNimbus>
        </BoxNimbus>
        {!collapseDesktop && (
          <Input
            placeholder={t('conversations.search')}
            disabled={!billingData?.activeStatus}
            append={<Icon source={<SearchIcon />} />}
            appendPosition="start"
            onChange={handleSearchContact}
            name="search"
            id="search"
          />
        )}
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
      <Box
        ref={containerRef}
        sx={{ px: 0, py: 1, height: 1, overflow: 'scroll' }}
      >
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

      </Box>
    </>
  );

  return (
    <>
      {!mdUp && renderMobileBtn}

      {mdUp ? (
        <Stack
          sx={{
            height: 1,
            flexShrink: 0,
            width: NAV_WIDTH,
            borderRight: `solid 1px ${theme.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openMobile}
          onClose={onCloseMobile}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

    </>
  );
}
