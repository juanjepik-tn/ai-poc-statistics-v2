// @mui
import { Box, Card, Icon, Text, Thumbnail } from '@nimbus-ds/components';
import { UserIcon } from '@nimbus-ds/icons';
import { useNavigate } from 'react-router-dom';
import FormattedTextWrapper from '../conversation/providers/FormattedTextWrapper';
import { useTranslation } from 'react-i18next';
import Iconify from '../iconify';
// routes
// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hook';
// components
// import { AudioPlayer } from 'react-audio-play';
// import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description: string;
  notificationId: string;
  conversationId: string;
  avatar: string;
};

export default function NotificationCard({
  title,
  description,
  notificationId,
  conversationId,
  avatar,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation('translations');

  const renderNotificationMessage = (lastMessage: any) => {
    if (lastMessage?.class.includes('view-once')) {
      return (
        <Box display="flex" alignItems="center" gap="1">
          <Iconify icon="mynaui:one-circle" />
          <Text fontSize="caption" lineClamp={1}>{t('conversations.tags.view_once')}</Text>
        </Box>
      )
      
    }
    if (lastMessage?.mimetype?.startsWith('image')) {
      return (
        <Box display="flex" alignItems="center" gap="1">
          <Iconify icon="ic:baseline-photo" />
          <Text>{t('conversations.photo')}</Text>
        </Box>
      );
    }
    return (
      <FormattedTextWrapper text={lastMessage?.content}>
        {(formattedContent: any) => (
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        )}
      </FormattedTextWrapper>
    );
  };

  return (
    <>
      <Box
        cursor="pointer"
        onClick={() => {
          navigate(`/conversations/${conversationId}`);
        }}
      >
        <Card key={notificationId}>
          <Card.Body>
            <Box display="flex" alignItems="center" gap="4">
              <Box
                width="40px"
                height="40px"
                borderRadius="base"
                backgroundColor="neutral-surface"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {avatar ? (
                  <Thumbnail src={avatar} alt="my-image" />
                ) : (
                  <Icon
                    source={<UserIcon size="medium" />}
                    color="neutral-textHigh"
                  />
                )}
              </Box>
              <Box flex="1">
                <Text fontSize="base" fontWeight="bold">
                  {title}
                </Text>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  <Text fontSize="base" color="neutral-textLow">
                    {renderNotificationMessage(description)}
                  </Text>
                </div>
              </Box>
            </Box>
          </Card.Body>
        </Card>
      </Box>
    </>
  );
}
