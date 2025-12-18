import { ChatNavItemSkeleton } from '@/components/conversation/chat-skeleton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Box as BoxNimbus, Icon, IconButton as IconButtonNimbus, Input, Title } from '@nimbus-ds/components';
import { CogIcon, SearchIcon, StatsIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';

const NAV_WIDTH = 350;

export default function ConversationNavSkeleton() {
    const theme = useTheme();

    const { t } = useTranslation('translations');


    const renderList = (
        <>
            {[...Array(4)].map((_, index) => (
                <ChatNavItemSkeleton key={index} />
            ))}
        </>
    );

    const renderContent = (
        <>
            <BoxNimbus p="4" gap="1">
                <BoxNimbus display="flex" flexDirection="row" justifyContent="space-between" py="2">
                    <Title as="h3">{t('app.title')}</Title>
                    <BoxNimbus display="flex" justifyContent="flex-end" gap="2">
                        <IconButtonNimbus
                            source={<img src="/imgs/ia-icon-paused.svg" alt="WandIcon" />}
                            size="2rem"
                        />
                        <IconButtonNimbus
                            source={<StatsIcon />}
                            size="2rem"
                        />
                        <IconButtonNimbus
                            source={<CogIcon />}
                            size="2rem"
                        />
                    </BoxNimbus>
                </BoxNimbus>

                <Input
                    placeholder={t('conversations.search')}
                    append={<Icon source={<SearchIcon />} />}
                    appendPosition="start"
                    disabled
                />
            </BoxNimbus>

            <Box >
                {renderList}
            </Box>
        </>
    );

    return (
        <>
            <Stack
                sx={{
                    height: 1,
                    flexShrink: 0,
                    width: NAV_WIDTH,
                    borderRight: `solid 1px ${theme.palette.divider}`,
                }}
            >
                {renderContent}
            </Stack>
        </>
    );
}
