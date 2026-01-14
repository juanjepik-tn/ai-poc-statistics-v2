import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChannelType, IChannelConfig } from '@/types/conversation';
import { mockAllChannels, mockReconnectionStatuses, ChannelReconnectionStatus } from '@/mocks/mock-channels';

// ============================================
// TYPES
// ============================================

export type ChannelFilterValue = 'all' | ChannelType;

interface ChannelsState {
  // All connected channels
  channels: IChannelConfig[];
  // Loading states
  loading: boolean;
  error: string | null;
  // Active filter for conversations
  activeFilter: ChannelFilterValue;
  // Reconnection status per channel
  reconnectionStatuses: ChannelReconnectionStatus[];
  // Instagram onboarding state
  instagramOnboarding: {
    isOpen: boolean;
    currentStep: number;
    selectedAccountId: string | null;
    isConnecting: boolean;
  };
  // Facebook Messenger onboarding state
  facebookOnboarding: {
    isOpen: boolean;
    currentStep: number;
    selectedPageId: string | null;
    isConnecting: boolean;
  };
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: ChannelsState = {
  channels: mockAllChannels, // Start with mock data
  loading: false,
  error: null,
  activeFilter: 'all',
  reconnectionStatuses: mockReconnectionStatuses,
  instagramOnboarding: {
    isOpen: false,
    currentStep: 1,
    selectedAccountId: null,
    isConnecting: false,
  },
  facebookOnboarding: {
    isOpen: false,
    currentStep: 1,
    selectedPageId: null,
    isConnecting: false,
  },
};

// ============================================
// SLICE
// ============================================

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    // Set all channels
    setChannels: (state, action: PayloadAction<IChannelConfig[]>) => {
      state.channels = action.payload;
    },

    // Add a new channel
    addChannel: (state, action: PayloadAction<IChannelConfig>) => {
      state.channels.push(action.payload);
    },

    // Update a channel
    updateChannel: (state, action: PayloadAction<{ id: string; updates: Partial<IChannelConfig> }>) => {
      const index = state.channels.findIndex(ch => ch.id === action.payload.id);
      if (index !== -1) {
        state.channels[index] = { ...state.channels[index], ...action.payload.updates };
      }
    },

    // Remove a channel
    removeChannel: (state, action: PayloadAction<string>) => {
      state.channels = state.channels.filter(ch => ch.id !== action.payload);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set active filter for conversations
    setActiveFilter: (state, action: PayloadAction<ChannelFilterValue>) => {
      state.activeFilter = action.payload;
    },

    // Set reconnection status for a channel
    setReconnectionStatus: (state, action: PayloadAction<ChannelReconnectionStatus>) => {
      const index = state.reconnectionStatuses.findIndex(
        rs => rs.channelId === action.payload.channelId
      );
      if (index !== -1) {
        state.reconnectionStatuses[index] = action.payload;
      } else {
        state.reconnectionStatuses.push(action.payload);
      }
    },

    // Instagram onboarding actions
    openInstagramOnboarding: (state) => {
      state.instagramOnboarding.isOpen = true;
      state.instagramOnboarding.currentStep = 1;
      state.instagramOnboarding.selectedAccountId = null;
    },

    closeInstagramOnboarding: (state) => {
      state.instagramOnboarding.isOpen = false;
      state.instagramOnboarding.currentStep = 1;
      state.instagramOnboarding.selectedAccountId = null;
      state.instagramOnboarding.isConnecting = false;
    },

    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.instagramOnboarding.currentStep = action.payload;
    },

    selectInstagramAccount: (state, action: PayloadAction<string>) => {
      state.instagramOnboarding.selectedAccountId = action.payload;
    },

    setInstagramConnecting: (state, action: PayloadAction<boolean>) => {
      state.instagramOnboarding.isConnecting = action.payload;
    },

    // Toggle channel chat enabled
    toggleChannelChat: (state, action: PayloadAction<string>) => {
      const channel = state.channels.find(ch => ch.id === action.payload);
      if (channel) {
        channel.chatEnabled = !channel.chatEnabled;
      }
    },

    // Toggle channel marketing automation
    toggleChannelMarketing: (state, action: PayloadAction<string>) => {
      const channel = state.channels.find(ch => ch.id === action.payload);
      if (channel) {
        channel.marketingAutomationEnabled = !channel.marketingAutomationEnabled;
      }
    },

    // Facebook Messenger onboarding actions
    openFacebookOnboarding: (state) => {
      state.facebookOnboarding.isOpen = true;
      state.facebookOnboarding.currentStep = 1;
      state.facebookOnboarding.selectedPageId = null;
    },

    closeFacebookOnboarding: (state) => {
      state.facebookOnboarding.isOpen = false;
      state.facebookOnboarding.currentStep = 1;
      state.facebookOnboarding.selectedPageId = null;
      state.facebookOnboarding.isConnecting = false;
    },

    setFacebookOnboardingStep: (state, action: PayloadAction<number>) => {
      state.facebookOnboarding.currentStep = action.payload;
    },

    selectFacebookPage: (state, action: PayloadAction<string>) => {
      state.facebookOnboarding.selectedPageId = action.payload;
    },

    setFacebookConnecting: (state, action: PayloadAction<boolean>) => {
      state.facebookOnboarding.isConnecting = action.payload;
    },
  },
});

// ============================================
// SELECTORS
// ============================================

export const selectAllChannels = (state: { channels: ChannelsState }) => state.channels.channels;

export const selectChannelsByType = (type: ChannelType) => (state: { channels: ChannelsState }) =>
  state.channels.channels.filter(ch => ch.channelType === type);

export const selectConnectedChannels = (state: { channels: ChannelsState }) =>
  state.channels.channels.filter(ch => ch.status === 'connected');

export const selectAvailableChannelTypes = (state: { channels: ChannelsState }): ChannelType[] => {
  const types = new Set<ChannelType>();
  state.channels.channels.forEach(ch => {
    if (ch.status === 'connected') {
      types.add(ch.channelType);
    }
  });
  return Array.from(types);
};

export const selectActiveFilter = (state: { channels: ChannelsState }) => state.channels.activeFilter;

export const selectChannelsNeedingReconnection = (state: { channels: ChannelsState }) =>
  state.channels.reconnectionStatuses.filter(rs => rs.needsReconnection);

export const selectInstagramOnboarding = (state: { channels: ChannelsState }) =>
  state.channels.instagramOnboarding;

export const selectHasInstagramConnected = (state: { channels: ChannelsState }) =>
  state.channels.channels.some(ch => ch.channelType === 'instagram' && ch.status === 'connected');

export const selectHasWhatsAppConnected = (state: { channels: ChannelsState }) =>
  state.channels.channels.some(ch => ch.channelType === 'whatsapp' && ch.status === 'connected');

export const selectHasFacebookConnected = (state: { channels: ChannelsState }) =>
  state.channels.channels.some(ch => ch.channelType === 'facebook' && ch.status === 'connected');

export const selectFacebookOnboarding = (state: { channels: ChannelsState }) =>
  state.channels.facebookOnboarding;

export const selectChannelsLoading = (state: { channels: ChannelsState }) => state.channels.loading;

// ============================================
// EXPORTS
// ============================================

export const {
  setChannels,
  addChannel,
  updateChannel,
  removeChannel,
  setLoading,
  setError,
  setActiveFilter,
  setReconnectionStatus,
  openInstagramOnboarding,
  closeInstagramOnboarding,
  setOnboardingStep,
  selectInstagramAccount,
  setInstagramConnecting,
  toggleChannelChat,
  toggleChannelMarketing,
  openFacebookOnboarding,
  closeFacebookOnboarding,
  setFacebookOnboardingStep,
  selectFacebookPage,
  setFacebookConnecting,
} = channelsSlice.actions;

export default channelsSlice.reducer;


