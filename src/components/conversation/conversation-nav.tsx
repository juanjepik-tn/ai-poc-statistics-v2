import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { IConversation } from '@/types/conversation';
import { Box as BoxNimbus, Button, Icon, IconButton as IconButtonNimbus, Input, Link, Popover, Spinner, Text, Title, Tooltip } from '@nimbus-ds/components';
import { ChatDotsIcon, CheckCircleIcon, CogIcon, EllipsisIcon, GenerativeStarsIcon, InfoCircleIcon, SearchIcon, TagIcon, ToolsIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Iconify from '../iconify/iconify';
import ChatReadIcon from '../icons/ChatReadIcon';
import ChatUnreadIcon from '../icons/ChatUnreadIcon';
import { useCollapseNav } from '../playground/hooks';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ConversationNavItem from './conversation-nav-item';
import ConversationNavSearchResults from './conversation-nav-search-results';
import ConversationTabs from './header-mode-filter-tab';
import ChatFilterPanel from './ChatFilterPanel';
import { useResponsive } from './hooks/use-responsive';
import { BillingDTO } from '@/types/billingDTO';
import { useSelector, useDispatch } from 'react-redux';
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
  handleAtendimentoFilter: (tags: string[]) => void;
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
  selectionMode?: boolean;
  selectedConversationIds?: Set<string>;
  onToggleSelection?: (conversationId: string) => void;
  onEnterSelectionMode?: (conversationId?: string) => void;
  onExitSelectionMode?: () => void;
  onSelectAll?: () => void;
  onBulkMarkAsRead?: () => void;
  onBulkMarkAsUnread?: () => void;
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
  handleAtendimentoFilter,
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
  selectionMode,
  selectedConversationIds,
  onToggleSelection,
  onEnterSelectionMode,
  onExitSelectionMode,
  onSelectAll,
  onBulkMarkAsRead,
  onBulkMarkAsUnread,
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
            onClickConversation={() => selectionMode ? onToggleSelection?.(conversation.id) : handleClickConversation(conversation)}
            selected={conversation.id === currentConversationId}
            markAsResolved={markAsResolved}
            storeSelectedMode={storeSelectedMode}
            onMarkAsUnread={onMarkAsUnread}
            onMarkAsRead={onMarkAsRead}
            selectionMode={selectionMode}
            isSelected={selectedConversationIds?.has(conversation.id)}
            onToggleSelection={onToggleSelection}
            onEnterSelectionMode={onEnterSelectionMode}
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
  const [selectedAtendimentoTags, setSelectedAtendimentoTags] = useState<string[]>([]);
  const handleFilterChange = (value: string) => {
    handleNeedAttention();
    setSelectedFilter(value);
  };
  const handleTagFilterChange = (value: string) => {
    setSelectedTagFilter(value);
    handleTagFilter(value);
  };
  const handleAtendimentoTagsChange = (tags: string[]) => {
    setSelectedAtendimentoTags(tags);
    handleAtendimentoFilter(tags);
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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (channelFilter !== 'all') count++;
    if (selectedAtendimentoTags.length > 0) count++;
    if (selectedTagFilter !== 'all') count++;
    return count;
  }, [channelFilter, selectedAtendimentoTags, selectedTagFilter]);

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
        {selectionMode ? (
          <BoxNimbus
            display="flex"
            flexDirection="column"
            gap="2"
            paddingBottom="2"
          >
            <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py="2">
              <BoxNimbus display="flex" alignItems="center" gap="2">
                <IconButtonNimbus
                  source={<Iconify icon="mdi:arrow-left" width={20} />}
                  size="2rem"
                  onClick={() => onExitSelectionMode?.()}
                />
                <Text fontWeight="bold" fontSize="base">
                  {selectedConversationIds?.size || 0} {t('conversations.bulk.selected')}
                </Text>
              </BoxNimbus>
            </BoxNimbus>
            <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
              <BoxNimbus display="flex" gap="2" alignItems="center">
                <Link as="button" appearance="primary" onClick={() => onSelectAll?.()}>
                  {t('conversations.bulk.select-all')}
                </Link>
                {(selectedConversationIds?.size ?? 0) > 0 && (
                  <>
                    <Text color="neutral-textDisabled">|</Text>
                    <Link as="button" appearance="neutral" onClick={() => onExitSelectionMode?.()}>
                      {t('conversations.bulk.clear')}
                    </Link>
                  </>
                )}
              </BoxNimbus>
              <BoxNimbus display="flex" flexDirection="row" gap="2" alignItems="center">
                <Tooltip content={t('conversations.mark-as-read')} position="bottom">
                  <IconButtonNimbus
                    source={<ChatReadIcon size={20} />}
                    size="2rem"
                    onClick={() => onBulkMarkAsRead?.()}
                  />
                </Tooltip>
                <Tooltip content={t('conversations.mark-as-unread')} position="bottom">
                  <IconButtonNimbus
                    source={<ChatUnreadIcon size={20} />}
                    size="2rem"
                    onClick={() => onBulkMarkAsUnread?.()}
                  />
                </Tooltip>
              </BoxNimbus>
            </BoxNimbus>
          </BoxNimbus>
        ) : (
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
                      onEnterSelectionMode?.();
                    }}
                  >
                    <Icon source={<CheckCircleIcon />} color="neutral-textLow" />
                    <Text fontSize="base" color="neutral-textHigh">{t('conversations.bulk.select')}</Text>
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
        )}

        {!selectionMode && (
          <>
            <ConversationTabs
              selectedFilter={activeSegmentFilter || selectedFilter}
              handleFilterChange={handleSegmentFilterChange || handleFilterChange}
              unreadMessagesCount={unreadMessagesCount}
              onFilterClick={() => setShowFilters(!showFilters)}
              filtersActive={showFilters}
              activeFilterCount={activeFilterCount}
            />

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
            
            {showFilters && (
              <ChatFilterPanel
                channelFilter={channelFilter}
                onChannelFilterChange={handleChannelFilterChange}
                availableChannels={availableChannelTypes}
                selectedAtendimentoTags={selectedAtendimentoTags}
                onAtendimentoTagsChange={handleAtendimentoTagsChange}
                selectedCartFilter={selectedTagFilter}
                onCartFilterChange={handleTagFilterChange}
              />
            )}
          </>
        )}

      </BoxNimbus>
      <Box
        ref={containerRef}
        sx={{
          px: 0,
          py: 1,
          maxHeight: 'calc(100vh - 280px)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
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
            minHeight: 0,
            flexShrink: 0,
            overflow: 'hidden',
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
