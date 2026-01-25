/**
 * Mock Data for Instagram Integration
 * This file contains channel data for multi-channel support (WhatsApp + Instagram)
 */

import { ChannelType, IChannelConfig } from '@/types/conversation';

// ============================================
// CHANNEL CONFIGURATIONS
// ============================================

export const mockWhatsAppChannels: IChannelConfig[] = [
  {
    id: 'wa-001',
    channelType: 'whatsapp',
    username: '+54 9 11 1234-5678',
    displayName: 'WhatsApp Business Principal',
    status: 'connected',
    chatEnabled: true,
    marketingAutomationEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockInstagramChannels: IChannelConfig[] = [
  {
    id: 'ig-001',
    channelType: 'instagram',
    username: '@mi_tienda_ok',
    displayName: 'Mi Tienda OK',
    status: 'connected',
    chatEnabled: true,
    marketingAutomationEnabled: false,
    createdAt: '2024-06-15T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Mi+Tienda&background=eef5ff&color=0059d5',
    followers: 15200,
  },
];

export const mockFacebookChannels: IChannelConfig[] = [
  {
    id: 'fb-001',
    channelType: 'facebook',
    username: 'Mi Tienda OK',
    displayName: 'Mi Tienda OK',
    status: 'connected',
    chatEnabled: true,
    marketingAutomationEnabled: false,
    createdAt: '2024-08-20T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Mi+Tienda&background=eef5ff&color=0059d5',
    followers: 8500,
  },
];

// Combined channels
export const mockAllChannels: IChannelConfig[] = [
  ...mockWhatsAppChannels,
  ...mockInstagramChannels,
  ...mockFacebookChannels,
];

// ============================================
// AVAILABLE CHANNELS (connected channels types)
// ============================================

export const getAvailableChannelTypes = (channels: IChannelConfig[]): ChannelType[] => {
  const types = new Set<ChannelType>();
  channels.forEach(ch => {
    if (ch.status === 'connected') {
      types.add(ch.channelType);
    }
  });
  return Array.from(types);
};

// ============================================
// INSTAGRAM ACCOUNTS (from OAuth flow)
// ============================================

export interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  profilePicture: string;
  followers: number;
  isBusinessAccount: boolean;
  facebookPageId: string;
  facebookPageName: string;
}

export const mockInstagramAccounts: InstagramAccount[] = [
  {
    id: 'ig-acc-001',
    username: '@mi_tienda_oficial',
    name: 'Mi Tienda - Ropa y Accesorios',
    profilePicture: 'https://ui-avatars.com/api/?name=Mi+Tienda&background=eef5ff&color=0059d5',
    followers: 15200,
    isBusinessAccount: true,
    facebookPageId: 'fb-page-001',
    facebookPageName: 'Mi Tienda Oficial',
  },
  {
    id: 'ig-acc-002',
    username: '@mi_tienda_outlet',
    name: 'Mi Tienda Outlet',
    profilePicture: 'https://ui-avatars.com/api/?name=Outlet&background=eef5ff&color=0059d5',
    followers: 3400,
    isBusinessAccount: true,
    facebookPageId: 'fb-page-002',
    facebookPageName: 'Mi Tienda Outlet',
  },
];

// ============================================
// FACEBOOK PAGES (from OAuth flow)
// ============================================

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture: string;
  followers: number;
  isMessagingEnabled: boolean;
}

export const mockFacebookPages: FacebookPage[] = [
  {
    id: 'fb-page-001',
    name: 'Mi Tienda Oficial',
    category: 'Tienda de ropa',
    picture: 'https://ui-avatars.com/api/?name=Mi+Tienda&background=eef5ff&color=0059d5',
    followers: 8500,
    isMessagingEnabled: true,
  },
  {
    id: 'fb-page-002',
    name: 'Mi Tienda Outlet',
    category: 'Tienda de ropa',
    picture: 'https://ui-avatars.com/api/?name=Outlet&background=eef5ff&color=0059d5',
    followers: 3200,
    isMessagingEnabled: true,
  },
  {
    id: 'fb-page-003',
    name: 'Mi Blog Personal',
    category: 'Blog personal',
    picture: 'https://ui-avatars.com/api/?name=Blog&background=eef5ff&color=0059d5',
    followers: 1200,
    isMessagingEnabled: false,
  },
];

// ============================================
// CHANNEL STATISTICS
// ============================================

export interface ChannelStatistics {
  channelType: ChannelType;
  conversationsCount: number;
  messagesCount: number;
  avgResponseTime: number; // in seconds
}

export const mockChannelStatistics: ChannelStatistics[] = [
  {
    channelType: 'whatsapp',
    conversationsCount: 723,
    messagesCount: 18560,
    avgResponseTime: 45,
  },
  {
    channelType: 'instagram',
    conversationsCount: 124,
    messagesCount: 2890,
    avgResponseTime: 38,
  },
  {
    channelType: 'facebook',
    conversationsCount: 89,
    messagesCount: 1560,
    avgResponseTime: 42,
  },
];

// ============================================
// RECONNECTION STATUS
// ============================================

export interface ChannelReconnectionStatus {
  channelId: string;
  channelType: ChannelType;
  needsReconnection: boolean;
  reason?: string;
  lastConnected?: string;
}

export const mockReconnectionStatuses: ChannelReconnectionStatus[] = [
  {
    channelId: 'wa-001',
    channelType: 'whatsapp',
    needsReconnection: false,
  },
  {
    channelId: 'ig-001',
    channelType: 'instagram',
    needsReconnection: false,
  },
  {
    channelId: 'fb-001',
    channelType: 'facebook',
    needsReconnection: false,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getChannelsByType = (
  channels: IChannelConfig[],
  type: ChannelType
): IChannelConfig[] => {
  return channels.filter(ch => ch.channelType === type);
};

export const getConnectedChannels = (channels: IChannelConfig[]): IChannelConfig[] => {
  return channels.filter(ch => ch.status === 'connected');
};

export const hasChannelType = (channels: IChannelConfig[], type: ChannelType): boolean => {
  return channels.some(ch => ch.channelType === type && ch.status === 'connected');
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  whatsappChannels: mockWhatsAppChannels,
  instagramChannels: mockInstagramChannels,
  facebookChannels: mockFacebookChannels,
  allChannels: mockAllChannels,
  instagramAccounts: mockInstagramAccounts,
  facebookPages: mockFacebookPages,
  channelStatistics: mockChannelStatistics,
  reconnectionStatuses: mockReconnectionStatuses,
};

