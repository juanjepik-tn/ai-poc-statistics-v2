import React, { useEffect, useState, useCallback } from 'react';
import { Link, Tag } from '@nimbus-ds/components';
import { ProductUpdates } from '@nimbus-ds/patterns';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useTranslation } from 'react-i18next';

const VIEWED_STORAGE_KEY = 'announcements_viewed';

function getViewedIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(VIEWED_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function markIdAsViewed(id: number): void {
  const ids = getViewedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify(ids));
  }
}

interface AnnouncementData {
  '@context': string;
  '@id': string;
  '@type': string;
  id: number;
  title: string;
  body: string;
  content?: string;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
  priority?: number;
}

interface AnnouncementProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
}

const Announcement: React.FC<AnnouncementProps> = ({ 
  children, 
  position = 'bottom',
  disabled = false,
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [visible, setVisible] = useState(false);
  const { request } = useFetch();
  const { t } = useTranslation('translations');

  const fetchUnreadAnnouncement = useCallback(async () => {
    if (disabled) return;
    try {
      const { content } = await request<AnnouncementData[]>({
        url: API_ENDPOINTS.announcements.unread,
        method: 'GET',
      });
      if (content && content.length > 0) {
        const viewedIds = getViewedIds();
        const unseen = content.filter((a) => !viewedIds.includes(a.id));
        if (unseen.length === 0) return;

        const sorted = [...unseen].sort(
          (a, b) => (a.priority ?? 99) - (b.priority ?? 99),
        );
        setAnnouncements(sorted);
        setVisible(true);
      }
    } catch (error) {
      console.error('Failed to fetch announcement:', error);
    }
  }, [request, disabled]);

  useEffect(() => {
    fetchUnreadAnnouncement();
  }, [fetchUnreadAnnouncement]);

  const currentAnnouncement = announcements[0];

  const getAnnouncementBody = (announcement: AnnouncementData): string =>
    announcement.body || announcement.content || '';

  const handleMarkAsViewed = async () => {
    if (!currentAnnouncement) return;

    markIdAsViewed(currentAnnouncement.id);

    try {
      await request({
        url: API_ENDPOINTS.announcements.markAsViewed(currentAnnouncement.id),
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to mark announcement as viewed:', error);
    }

    const remaining = announcements.slice(1);
    setAnnouncements(remaining);

    if (remaining.length === 0) {
      setVisible(false);
    }
  };

  if (disabled || !currentAnnouncement) {
    return <>{children}</>;
  }

  const titleKey = `announcements.read-unread.title`;
  const bodyKey = `announcements.read-unread.body`;
  const localizedTitle = t(titleKey, { defaultValue: '' });
  const localizedBody = t(bodyKey, { defaultValue: '' });

  const displayTitle = localizedTitle || currentAnnouncement.title;
  const displayBody = localizedBody || getAnnouncementBody(currentAnnouncement);

  return (
    <ProductUpdates
      visible={visible}
      onVisibility={setVisible}
      arrow
      position={position}
      title={displayTitle}
      text={displayBody}
      maxWidth="250px"
      tag={<Tag appearance="primary">{t('common.new')}</Tag>}
      dismissLink={
        <Link
          as="button"
          appearance="neutral-background"
          onClick={handleMarkAsViewed}
        >
          {t('common.understood')}
        </Link>
      }
    >
      {children}
    </ProductUpdates>
  );
};

export default Announcement;
