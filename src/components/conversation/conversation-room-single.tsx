// import { SingleFilePreview } from 'src/components/upload';
// import useHasRoles from 'src/hooks/use-has-roles';
//import { useLocales } from 'src/locales';
//import { IConversation } from 'src/types/conversation';
// import OrderItemShort from '../order/order-item-short';

// ----------------------------------------------------------------------

type Props = {
  conversation: any;
  orders: any;
  totalOrders: number;
  handlePaginationChange: any;
};

export default function ConversationRoomSingle({ conversation }: Props) {
  console.log(conversation.id);
  // const collapse = useBoolean(true);
  // const collapseHistorial = useBoolean(false);
  // const collapseLastOrder = useBoolean(true);

  // const { name, order, username } = conversation;

  // if (order) {
  //   order.conversation = conversation;
  // }

  // const containerRef = useRef<HTMLDivElement | null>(null);
  // const { t } = useLocales();

  // const renderFiles = (
  //   <>
  //     <Card
  //       sx={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         py: 2,
  //       }}
  //     >
  //       <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
  //         Archivos, enlaces y documentos
  //       </Typography>
  //       {conversation.messages.map(
  //         (message, index) =>
  //           message.class === 'message-pdf' && (
  //             <SingleFilePreview key={index} />
  //           ),
  //       )}
  //     </Card>
  //   </>
  // );

  // const renderInfo = (
  //   <Card
  //     sx={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       py: 2,
  //       mb: 2,
  //     }}
  //   >
  //     <ConversationAvatar
  //       name={conversation.name}
  //       imageUrl={conversation.avatar}
  //       height={150}
  //       width={150}
  //     />

  //     <Typography variant="subtitle1">{name}</Typography>
  //     <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
  //       {username}
  //     </Typography>
  //   </Card>
  // );

  // const renderBtn = (
  //   <ListItemButton
  //     onClick={collapse.onToggle}
  //     sx={{
  //       pl: 2.5,
  //       pr: 1.5,
  //       height: 40,
  //       flexShrink: 0,
  //       flexGrow: 'unset',
  //       typography: 'overline',
  //       color: 'text.secondary',
  //       bgcolor: 'background.neutral',
  //     }}
  //   >
  //     <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
  //       {t('in_progress')}
  //     </Box>
  //     <Iconify
  //       width={16}
  //       icon={
  //         collapse
  //           ? 'eva:arrow-ios-downward-fill'
  //           : 'eva:arrow-ios-forward-fill'
  //       }
  //     />
  //   </ListItemButton>
  // );

  // const renderBtnOrders = (
  //   <ListItemButton
  //     onClick={collapseHistorial.onToggle}
  //     sx={{
  //       pl: 2.5,
  //       pr: 1.5,
  //       height: 40,
  //       flexShrink: 0,
  //       flexGrow: 'unset',
  //       typography: 'overline',
  //       color: 'text.secondary',
  //       bgcolor: 'background.neutral',
  //     }}
  //   >
  //     <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
  //       Historial de pedidos
  //     </Box>
  //     <Iconify
  //       width={16}
  //       icon={
  //         collapseHistorial.value
  //           ? 'eva:arrow-ios-downward-fill'
  //           : 'eva:arrow-ios-forward-fill'
  //       }
  //     />
  //   </ListItemButton>
  // );

  // const renderOrders = (
  //   <>
  //     <Stack
  //       spacing={2}
  //       sx={{
  //         px: 2,
  //         py: 2.5,
  //         '& svg': {
  //           mr: 1,
  //           flexShrink: 0,
  //           color: 'text.disabled',
  //         },
  //       }}
  //     >
  //       {orders.length > 0 &&
  //         orders?.map((historyOrder) => (
  //           <OrderItemShort
  //             key={`orderHistory-${historyOrder?.id}`}
  //             order={historyOrder}
  //             onView={() => {}}
  //           />
  //         ))}
  //     </Stack>
  //     {orders?.length > 0 && orders.length < totalOrders && (
  //       <Stack
  //         direction="column"
  //         alignItems="center"
  //         justifyContent="space-between"
  //         sx={{ py: 5, pr: 5, pl: 2.5 }}
  //       >
  //         <Button
  //           sx={{ my: 3 }}
  //           variant="contained"
  //           endIcon={<Iconify icon="mdi:package-variant-closed-delivered" />}
  //           onClick={handlePaginationChange}
  //         >
  //           Cargar más
  //         </Button>
  //       </Stack>
  //     )}
  //   </>
  // );

  // const renderBtnLastOrder = (
  //   <>
  //     <ListItemButton
  //       onClick={collapseLastOrder.onToggle}
  //       sx={{
  //         pl: 2.5,
  //         pr: 1.5,
  //         height: 40,
  //         flexShrink: 0,
  //         flexGrow: 'unset',
  //         typography: 'overline',
  //         color: 'text.secondary',
  //         bgcolor: 'background.neutral',
  //       }}
  //     >
  //       <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
  //         Pedido Finalizado
  //       </Box>
  //       <Iconify
  //         width={16}
  //         icon={
  //           collapseLastOrder.value
  //             ? 'eva:arrow-ios-downward-fill'
  //             : 'eva:arrow-ios-forward-fill'
  //         }
  //       />
  //     </ListItemButton>
  //   </>
  // );

  return (
    <>
      {/* <Scrollbar
        ref={containerRef}
        sx={{ px: 1, py: 5, height: 1 }}
      ></Scrollbar> */}
    </>
  );
}
