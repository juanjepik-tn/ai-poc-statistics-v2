import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { IConversation } from '@/types/conversation';
import { Box as BoxNimbus, Button, Icon, IconButton as IconButtonNimbus, Input, Popover, Spinner, Text, Title } from '@nimbus-ds/components';
import { ChatDotsIcon, CogIcon, EllipsisIcon, GenerativeStarsIcon, InfoCircleIcon, SearchIcon, TagIcon, ToolsIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns';
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
import { BillingDTO } from '@/types/billingDTO';
import { useSelector, useDispatch } from 'react-redux';
import { ChannelFilter } from '../ChannelFilter';
import { ReconnectBanner } from '../ReconnectBanner';
import { 
  selectAvailableChannelTypes, 
  selectActiveFilter, 
  setActiveFilter,
  selectChannelsNeedingReconnection,
  type ChannelFilterValue 
} from '@/redux/slices/channels';
import NewConversationModal from './NewConversationModal';
import { ModeContext } from './providers/ModeDataProvider';
import { useBsuidMode } from './providers/BsuidModeProvider';

// ----------------------------------------------------------------------

const BsuidToggleInNav: React.FC = () => {
  const { isBsuidMode, toggleBsuidMode } = useBsuidMode();
  return (
    <BoxNimbus
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="2"
      borderRadius="base"
      style={{
        background: isBsuidMode
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)'
          : 'var(--color-neutral-surface)',
        border: isBsuidMode ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={toggleBsuidMode}
    >
      <BoxNimbus display="flex" alignItems="center" gap="2">
        <BoxNimbus
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="24px"
          height="24px"
          borderRadius="base"
          style={{
            background: isBsuidMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.05)',
            fontSize: '14px',
          }}
        >
          🆔
        </BoxNimbus>
        <BoxNimbus display="flex" flexDirection="column">
          <Text fontSize="caption" fontWeight="bold" color={isBsuidMode ? 'primary-textHigh' : 'neutral-textHigh'}>
            BSUID & Usernames
          </Text>
        </BoxNimbus>
      </BoxNimbus>
      <div
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: isBsuidMode ? '#6366f1' : '#D1D5DB',
          position: 'relative',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 2,
            left: isBsuidMode ? 18 : 2,
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </BoxNimbus>
  );
};

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
  onMarkAsUnread?: (conversationId: string) => void;
  onMarkAsRead?: (conversationId: string) => void;
  onConversationCreated?: () => void;
  handleSegmentFilterChange?: (value: string) => void;
  activeSegmentFilter?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
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
  onMarkAsUnread,
  onMarkAsRead,
  onConversationCreated,
  handleSegmentFilterChange,
  activeSegmentFilter,
  onRefresh,
  isRefreshing,
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
  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const { handleRadioChange, modeOptions } = useContext(ModeContext);

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
            onMarkAsUnread={onMarkAsUnread}
            onMarkAsRead={onMarkAsRead}
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

  
  // Channel filter state from Redux
  const dispatch = useDispatch();
  const availableChannelTypes = useSelector(selectAvailableChannelTypes);
  const channelFilter = useSelector(selectActiveFilter);
  const channelsNeedingReconnection = useSelector(selectChannelsNeedingReconnection);
  
  const handleChannelFilterChange = (value: ChannelFilterValue) => {
    dispatch(setActiveFilter(value));
  };

  const handleReconnect = (_channelType?: string) => {
    // Navigate to configurations page for channel reconnection
    navigate('/admin/chat#/configurations');
  };

  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const renderContent = (
    <>
      {/* Reconnection Banner */}
      {channelsNeedingReconnection.length > 0 && (
        <BoxNimbus p="2">
          {channelsNeedingReconnection.map((channel) => (
            <ReconnectBanner
              key={channel.channelId}
              channel={channel.channelType}
              onReconnect={() => handleReconnect(channel.channelType)}
            />
          ))}
        </BoxNimbus>
      )}
      
      <BoxNimbus p="4" gap="1">
        <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py="2">
          <Title as="h3">Chat</Title>
          <BoxNimbus display="flex" justifyContent="flex-end" gap="2" alignItems="center">
            <IconButtonNimbus
              source={
                <Iconify
                  icon="mdi:sync"
                  width={20}
                  style={{
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  }}
                />
              }
              size="2rem"
              onClick={() => onRefresh?.()}
              disabled={isRefreshing}
            />
            <IconButtonNimbus
              source={<SearchIcon />}
              size="2rem"
              onClick={() => setShowSearch(!showSearch)}
              disabled={!billingData?.activeStatus}
            />
            <IconButtonNimbus
              source={<CogIcon />}
              size="2rem"
              onClick={() => navigate('/configurations')}
            />
            <Popover
              visible={moreMenuOpen}
              onVisibility={setMoreMenuOpen}
              enabledClick
              enabledDismiss
              arrow={false}
              position="bottom-end"
              padding="none"
              offset={-16}
              content={
                <BoxNimbus display="flex" flexDirection="column" paddingY="1" minWidth="220px">
                  <BoxNimbus
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap="3"
                    paddingX="4"
                    paddingY="2-5"
                    cursor="pointer"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      setShowNewConvModal(true);
                    }}
                  >
                    <Icon source={<ChatDotsIcon />} color="neutral-textLow" />
                    <Text fontSize="base" color="neutral-textHigh">Nova conversa</Text>
                  </BoxNimbus>
                  <BoxNimbus
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap="3"
                    paddingX="4"
                    paddingY="2-5"
                    cursor="pointer"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      // TODO: implement create tag logic
                    }}
                  >
                    <Icon source={<TagIcon />} color="neutral-textLow" />
                    <Text fontSize="base" color="neutral-textHigh">Criar etiqueta</Text>
                  </BoxNimbus>
                  <BoxNimbus
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap="3"
                    paddingX="4"
                    paddingY="2-5"
                    cursor="pointer"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      const autoMode = modeOptions?.find((o: any) => o.number === 1);
                      if (autoMode) handleRadioChange(autoMode);
                    }}
                  >
                    <Icon source={<GenerativeStarsIcon />} color="neutral-textLow" />
                    <Text fontSize="base" color="neutral-textHigh">Automático todas conversas</Text>
                  </BoxNimbus>
                  <BoxNimbus
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap="3"
                    paddingX="4"
                    paddingY="2-5"
                    cursor="pointer"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      const manualMode = modeOptions?.find((o: any) => o.number === 3);
                      if (manualMode) handleRadioChange(manualMode);
                    }}
                  >
                    <Icon source={<ToolsIcon />} color="neutral-textLow" />
                    <Text fontSize="base" color="neutral-textHigh">Manual todas conversas</Text>
                  </BoxNimbus>
                </BoxNimbus>
              }
            >
              <IconButtonNimbus
                source={<EllipsisIcon />}
                size="2rem"
              />
            </Popover>
          </BoxNimbus>
        </BoxNimbus>

        {/* BSUID Mode Toggle */}
        <BsuidToggleInNav />

        {/* Segmented Control + Filter Button */}
        <ConversationTabs
          selectedFilter={activeSegmentFilter || selectedFilter}
          handleFilterChange={handleSegmentFilterChange || handleFilterChange}
          unreadMessagesCount={unreadMessagesCount}
          onFilterClick={() => setShowFilters(!showFilters)}
          filtersActive={showFilters}
        />

        {/* Search Input - only visible when search icon is clicked */}
        {showSearch && !collapseDesktop && (
          <BoxNimbus paddingTop="2">
            <Input
              placeholder={t('conversations.search')}
              disabled={!billingData?.activeStatus}
              append={<SearchIcon size={16} />}
              appendPosition="start"
              onChange={handleSearchContact}
              name="search"
              id="search"
            />
          </BoxNimbus>
        )}
        
        {/* Filters Panel - only visible when filter button is clicked */}
        {showFilters && (
          <BoxNimbus 
            paddingTop="4"
            display="flex" 
            flexDirection="column" 
            gap="4"
          >
            {/* Channel Filter - only show if multiple channels are available */}
            {availableChannelTypes.length > 1 && (
              <BoxNimbus display="flex" flexDirection="column" gap="1">
                <Text fontSize="caption" fontWeight="medium" color="neutral-textLow">
                  Canal
                </Text>
                <ChannelFilter
                  value={channelFilter}
                  onChange={handleChannelFilterChange}
                  availableChannels={availableChannelTypes}
                  disabled={!billingData?.activeStatus}
                />
              </BoxNimbus>
            )}

            {/* Tag Filter */}
            <BoxNimbus display="flex" flexDirection="column" gap="1">
              <Text fontSize="caption" fontWeight="medium" color="neutral-textLow">
                Etiqueta
              </Text>
              <TagFilterSelect
                selectedTagFilter={selectedTagFilter}
                handleTagFilterChange={handleTagFilterChange}
                availableReferenceIds={availableReferenceIds}
              />
            </BoxNimbus>
          </BoxNimbus>
        )}

      </BoxNimbus>
      <Box
        ref={containerRef}
        sx={{ px: 0, py: 1, height: 1, overflow: 'auto' }}
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
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
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

      {/* New Conversation Modal (Feature 8) */}
      <NewConversationModal
        open={showNewConvModal}
        onClose={() => setShowNewConvModal(false)}
        onConversationCreated={() => {
          setShowNewConvModal(false);
          onConversationCreated?.();
        }}
      />
    </>
  );
}
