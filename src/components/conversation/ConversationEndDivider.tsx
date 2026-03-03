import { Box, Text } from '@nimbus-ds/components';
import { StopIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';

interface Props {
  endedAt?: string;
  unreadCount?: number;
}

export default function ConversationEndDivider({ endedAt, unreadCount }: Props) {
  const { t, i18n } = useTranslation('translations');

  const formattedDate = endedAt
    ? new Date(endedAt).toLocaleDateString(i18n.language || 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const lineStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    borderTop: '1px dashed #c4c4c4',
    margin: 0,
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      my="4"
      gap="1"
    >
      <Box display="flex" alignItems="center" width="100%" gap="2">
        <hr style={lineStyle} />
        <Box
          display="flex"
          alignItems="center"
          gap="1"
          paddingX="3"
          paddingY="1"
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '20px',
            border: '1px solid #e0e0e0',
            whiteSpace: 'nowrap',
          }}
        >
          <StopIcon size={12} color="#8c8c8c" />
          <Text
            fontSize="caption"
            as="span"
            style={{
              color: '#737373',
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: '12px',
            }}
          >
            {t('conversations.end-conversation')}
          </Text>
          {formattedDate && (
            <>
              <Text
                fontSize="caption"
                as="span"
                style={{ color: '#a3a3a3' }}
              >
                ·
              </Text>
              <Text
                fontSize="caption"
                as="span"
                style={{
                  color: '#a3a3a3',
                  fontFamily: "'Geist', sans-serif",
                  fontSize: '11px',
                }}
              >
                {formattedDate}
              </Text>
            </>
          )}
        </Box>
        <hr style={lineStyle} />
      </Box>

      {unreadCount != null && unreadCount > 0 && (
        <Box
          display="flex"
          alignItems="center"
          gap="1"
          paddingX="3"
          paddingY="0-5"
          style={{
            backgroundColor: '#0050c3',
            borderRadius: '12px',
          }}
        >
          <Text
            fontSize="caption"
            as="span"
            style={{
              color: '#ffffff',
              fontFamily: "'Geist', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {t('conversations.end-conversation-unread', { count: unreadCount })}
          </Text>
        </Box>
      )}
    </Box>
  );
}
