// @mui
import { Slide } from '@mui/material';
import Stack from '@mui/material/Stack';
// hooks

// types
// import { IChatParticipant } from 'src/types/chat';
// import { IConversationMessage } from 'src/types/conversation';
// components
// import { paths } from 'src/routes/paths';
// import axios, { API_ENDPOINTS } from 'src/utils/axios';
// import { enqueueSnackbar } from 'notistack';
// import useHasRoles from 'src/hooks/use-has-roles';
import { Box as BoxNimbus, Text } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';

//

// ----------------------------------------------------------------------


export default function IAmessageLoading() {


    const { t } = useTranslation('translations');
    // const renderActions = (
  //   <Stack
  //     direction="row"
  //     className="message-actions"
  //     sx={{
  //       pt: 0.5,
  //       opacity: 0,
  //       top: '100%',
  //       left: 0,
  //       position: 'absolute',
  //       transition: (theme) =>
  //         theme.transitions.create(['opacity'], {
  //           duration: theme.transitions.duration.shorter,
  //         }),
  //       ...(me && {
  //         left: 'unset',
  //         right: 0,
  //       }),
  //     }}
  //   >
  //     <IconButton size="small">
  //       <Iconify icon="solar:reply-bold" width={16} />
  //     </IconButton>
  //     <IconButton size="small">
  //       <Iconify icon="eva:smiling-face-fill" width={16} />
  //     </IconButton>
  //     <IconButton size="small">
  //       <Iconify icon="solar:trash-bin-trash-bold" width={16} />
  //     </IconButton>
  //   </Stack>
  // );

  return (
    <>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Stack
          direction="row"
          justifyContent='flex-end'
          sx={{ mb: 0.5 }}
        >
          <BoxNimbus alignItems="flex-end" flexDirection="column" maxWidth="80%">
            <BoxNimbus
              alignItems="center"
            >
               <BoxNimbus display='flex' flexDirection='row' alignItems='flex-end' justifyContent='flex-end'
               minWidth="48px"
               borderRadius="2"
               backgroundColor='primary-surface'
               marginRight="6"
               padding='2'
               gap='1'>
                <img src='/imgs/loading-ai-animated.gif' alt='loading-message' width='20px' height='20px'/>
                <Text color="neutral-textLow"> {t('conversations.ia-generating-answer')}</Text>
              </BoxNimbus> 
            </BoxNimbus>
          </BoxNimbus>
        </Stack>     
        </Slide>
    </>
  );
}
