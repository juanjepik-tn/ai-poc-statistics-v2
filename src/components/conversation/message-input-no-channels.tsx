import { Box, Link, Text, Title } from "@nimbus-ds/components";
import { ExclamationTriangleIcon, LinkIcon } from "@nimbus-ds/icons";
import { useTranslation } from "react-i18next";



const MessageInputNoChannels = () => {
  
  const { t } = useTranslation('translations');
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap="1">
        <ExclamationTriangleIcon color="warning-interactive" height={20} width={20}/>
        <Title as="h6" color="danger-textLow">
          {t('conversations.whatsapp-not-connected')}
        </Title>
        <Text>
           {t('conversations.whatsapp-not-connected-description')}
        </Text>
        <Link appearance="neutral" as="a" fontSize="caption" href="/configurations/3">
            <LinkIcon />
           <Text>
            {t('conversations.whatsapp-connect')} 
           </Text>
        </Link>

    </Box>
  );
};

export default MessageInputNoChannels;
