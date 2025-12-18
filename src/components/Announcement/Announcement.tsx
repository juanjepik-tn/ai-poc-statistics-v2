import React, { useEffect, useState, useCallback } from 'react';
import { Box, Popover, Text, Link } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useTranslation } from 'react-i18next';

interface AnnouncementData {
  '@context': string;
  '@id': string;
  '@type': string;
  id: number;
  title: string;
  body: string;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
}

interface AnnouncementProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
}


const Announcement: React.FC<AnnouncementProps> = ({ 
  children, 
  position = 'bottom',
  disabled = true, // TODO: Cambiar a false cuando se quiera activar el tooltip
}) => {
  // Si está desactivado, solo renderizar los children sin el popover
  if (disabled) {
    return <>{children}</>;
  }
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [visible, setVisible] = useState(false);
  const { request } = useFetch();

  const { t } = useTranslation('translations');
  
  const fetchUnreadAnnouncement = useCallback(async () => {
    try {
      const { content } = await request<AnnouncementData[]>({
        url: API_ENDPOINTS.announcements.unread,
        method: 'GET',
      });
      if (content && content.length > 0) {
        setAnnouncements(content);
        setVisible(true);
      }
    } catch (error) {
      console.error('Failed to fetch announcement:', error);
    }
  }, [request]);

  useEffect(() => {
    fetchUnreadAnnouncement();
  }, [fetchUnreadAnnouncement]);

  const currentAnnouncement = announcements[0];

  const handleMarkAsViewed = async () => {
    if (!currentAnnouncement) return;

    try {
      await request({
        url: API_ENDPOINTS.announcements.markAsViewed(currentAnnouncement.id),
        method: 'POST',
      });
      const remaining = announcements.slice(1);
      setAnnouncements(remaining);
      
      if (remaining.length === 0) {
        setVisible(false);
      }
    } catch (error) {
      console.error('Failed to mark announcement as viewed:', error);
    }

   
  };

  if (!currentAnnouncement) {
    return <>{children}</>;
  }

  return (
    <Popover
      visible={visible}
      onVisibility={setVisible}
      arrow
      padding="none"
      position={position}
      content={
        <Box
          display="flex"
          flexDirection="column"
          gap="2"
          p="4"
          backgroundColor="primary-interactive"
          borderRadius="2"
          maxWidth="280px"
        >
          <Text fontSize="base" fontWeight="bold" color="neutral-background">
            {currentAnnouncement.title}
          </Text>
          <Text fontSize="caption" color="neutral-background">
            {currentAnnouncement.body}
          </Text>
          <Box pt="2">
            <Link
              as="button"
              appearance="neutral-background"
              onClick={handleMarkAsViewed}
            >
              {t('common.understood')}
            </Link>
          </Box>
        </Box>
      }
    >
      {children}
    </Popover>
  );
};

export default Announcement;