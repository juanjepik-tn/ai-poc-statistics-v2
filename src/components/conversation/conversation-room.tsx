import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
// hooks
// types
// import { IChatParticipant } from 'src/types/chat';
// components

//
// import { IOrderItem } from 'src/types/order';
// import axios, { API_ENDPOINTS } from 'src/utils/axios';
// import { IConversation } from 'src/types/conversation';
import { useCollapseNav } from '../playground/hooks';
import { useResponsive } from './hooks/use-responsive';

// ----------------------------------------------------------------------

const NAV_WIDTH = 300;

type Props = {
  participants: any[];
  conversation: any;
  orderTrigger?: number;
};

export default function ConversationRoom({
  conversation,
  orderTrigger,
}: Props) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');
  const [page, setPage] = useState<number>(0);
  // const [showOrderdetail, setShowOrderdetail] = useState<boolean>(false);

  const {
    collapseDesktop,
    onCollapseDesktop,
    openMobile,
    onOpenMobile,
    onCloseMobile,
  } = useCollapseNav();

  useEffect(() => {
    if (orderTrigger && orderTrigger > 0) {
      if (lgUp) {
        onCollapseDesktop();
      } else {
        onOpenMobile();
      }
    }
  }, [orderTrigger, lgUp, onCollapseDesktop, onOpenMobile]);
  // const handleToggleNav = useCallback(() => {
  //   if (lgUp) {
  //     onCollapseDesktop();
  //   } else {
  //     onOpenMobile();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lgUp]);

  useEffect(() => {
    if (!conversation.order) {
      onCollapseDesktop();
    }
    if (!lgUp) {
      onCollapseDesktop();
    }
  }, [onCollapseDesktop, lgUp, conversation.order]);

  // const handlePaginationChange = () => {
  //   let page_aux = page;
  //   setPage((page_aux += 1));
  // };

  useEffect(() => {
    setPage(0);
  }, [conversation]);

  useEffect(() => {
    // const { channel, order } = conversation;
    // const QUERY = `?page=${page}&length=10`;
    // Revisar!! si la conversacion no tiene order no tengo manera de recuperar el customer.id
    // if (order) {
    // axios
    //   .get(
    //     API_ENDPOINTS.customer.ordersByCustomerAndChannel(
    //       order?.customer?.id,
    //       channel.id,
    //       QUERY,
    //     ),
    //   )
    //   .then(({ data: any }) => {
    //     setOrders((prevData) => [...prevData, ...data.rows]);
    //     setTotalOrders(data.total);
    //   })
    //   .catch((error: any) => {
    //     setOrders([]);
    //   });
    // }
  }, [conversation, page]);

  const renderContent = (
    <>
      {/* <ConversationRoomSingle
        conversation={conversation}
        orders={orders}
        totalOrders={totalOrders}
        handlePaginationChange={handlePaginationChange}
      /> */}
    </>
  );

  // const renderBtn = (
  //   <Button
  //     onClick={handleToggleNav}
  //     sx={{
  //       top: 12,
  //       right: 0,
  //       zIndex: 9,
  //       // width: 32,
  //       height: 32,
  //       borderRight: 0,
  //       position: 'absolute',
  //       borderRadius: `12px 0 0 12px`,
  //       //boxShadow: theme.customShadows.z8,
  //       bgcolor: theme.palette.primary.main,
  //       color: theme.palette.primary.contrastText,
  //       border: `solid 1px ${theme.palette.divider}`,
  //       '&:hover': {
  //         //bgcolor: theme.palette.primary.lighter,
  //       },
  //       ...(lgUp && {
  //         ...(!collapseDesktop && {
  //           right: NAV_WIDTH,
  //         }),
  //       }),
  //     }}
  //     startIcon={
  //       lgUp ? (
  //         <Iconify
  //           width={16}
  //           icon={
  //             collapseDesktop
  //               ? 'eva:arrow-ios-back-fill'
  //               : 'eva:arrow-ios-forward-fill'
  //           }
  //         />
  //       ) : (
  //         <Iconify width={16} icon="eva:arrow-ios-back-fill" />
  //       )
  //     }
  //   >
  //     Pedidos
  //   </Button>
  // );

  return (
    <Box sx={{ position: 'relative' }}>
      {/* !lgUp && orders.length > 0 && renderBtn */}

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            flexShrink: 0,
            width: NAV_WIDTH,
            borderLeft: `solid 1px ${theme.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && {
              width: 0,
            }),
          }}
        >
          {!collapseDesktop && renderContent}
        </Stack>
      ) : (
        <Drawer
          anchor="right"
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
    </Box>
  );
}
