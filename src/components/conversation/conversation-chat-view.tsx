import { useCallback, useEffect, useRef, useState } from 'react';
// import ChatHeaderDetail from 'src/sections/chat/chat-header-detail';
// import axios, { API_ENDPOINTS } from 'src/utils/axios';

// _mock

// @mui
import { IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
// routes
// components
// import { useSelector } from 'react-redux/es/hooks/useSelector';
// import { useSettingsContext } from 'src/components/settings';
// import { RootState, useDispatch } from 'src/redux/store';

// import Iconify from 'src/components/iconify';
// import useHasRoles from 'src/hooks/use-has-roles';
// import { useLocales } from 'src/locales';
//import { setNotificationConversationUpdate } from 'src/redux/slices/notification';
import { Box, Card, Sidebar } from '@nimbus-ds/components';
import Iconify from '../iconify';
import ConversationHeaderCompose from './conversation-header-compose';
import ConversationMessageInput from './conversation-message-input';
import ConversationMessageList from './conversation-message-list';
import ConversationTagsHeader from './conversation-tags-headers';
import { useBoolean } from './hooks/use-boolean';
import useChat from './hooks/use-chat';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import { useSelector } from 'react-redux';
import { getStoreInfo } from '@tiendanube/nexo';
import { nexo } from '@/app';
import { IConversation } from '@/types/conversation';
import MessageInputNoChannels from './message-input-no-channels';
import PricingAlertStatus from '../PricingAlertStatus/PricingAlertStatus';
import { BillingDTO } from '@/types/billingDTO';

//

// ----------------------------------------------------------------------

type Props = {
  conversationId: any;
  conversation: IConversation;
  onUpdateChat: (conversationId: any) => void;
  onUpdatePaused?: (conversationId: any) => void;
  onUpdateChatWithOrder?: (message: any) => void;
  onParentEvent: any;
  showChat: boolean;
  onClickConversation: (conversation: any) => void;
  onUpdateTags: () => void;
};

export default function ConversationChatView({
  conversationId,
  conversation,
  onUpdateChat,
  onUpdatePaused,
  onParentEvent,
  showChat,
  onClickConversation,
  onUpdateTags,
}: Props) {
  // const settings = useSettingsContext();
  const { request } = useFetch();
  const loadingButton = useBoolean();
  const [currentConversation, setCurrentConversation] =
    useState<any>(conversation);
  const [pausedUser] = useState<any>();
  // const [setShowOrder] = useState<boolean>(false);
  // const [setOrderTrigger] = useState<number>(0);
  const newMessageFlag = useBoolean(false);
  /** mock para el chat */
  const { participantsInConversation } = useChat();

  // const details = !!currentConversationId;
  const [selectedStore] = useState('');
  // const [conversations, setConversations] = useState<any[]>([]);
  // const [setLoadingConversations] = useState<boolean>(true);
  // const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [loadBannedUsers] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const notification = useSelector((state: any) => state.notification);
  // const [currentPage, setCurrentPage] = useState<number>(1);

  // const [bannedUser, setBannedUser] = useState<any>();
  // const dispatch = useDispatch();
  // const stateStore: any = useSelector((state: RootState) => state.store);
  const [page] = useState<number>(0);
  // const [setTotalConversations] = useState<number>(0);

  const [imgUrl, setImgUrl] = useState<string | null>(null);

  //Paginación de las conversaciones anteriores
  const [currentPage, setCurrentPage] = useState<number>(0);
  const currentPageRef = useRef(currentPage);
  const [loadingInitialMessages, setLoadingInitialMessages] =
    useState<boolean>(true);
  const [loadingMoreMessages, setLoadingMoreMessages] =
    useState<boolean>(false);
  const [totalMessagesPages, setTotalMessagesPages] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [isChannelConnected, setIsChannelConnected] = useState<boolean>(false);
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);
  useEffect(() => {
    request<any>({
      url: API_ENDPOINTS.channel.list,
      method: 'GET',
    })
      .then(({ content }) => {
        const connectedChannels = content.filter((channel: any) => channel.state.name === "Active");
        setIsChannelConnected(connectedChannels.length > 0);
      })
      .catch((error) => {
        console.log(error);
        setIsChannelConnected(false);
      });
  }, []);


  const [conversationsQuantity, setConversationsQuantity] = useState<number>(0);
  useEffect(() => {
    setLoadingInitialMessages(true);
    setCurrentPage(0);
    if (currentConversation?.id !== conversation.id) {
      setChatMessages([]);
    }
  }, [onClickConversation]);

  // const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  async function fetchConversationDetails(conversationId: string) {
    try {
      const response = await request<any>({
        url: API_ENDPOINTS.conversation.details(conversationId || ''),
        method: 'GET',
      });
      return response.content;
    } catch (error) {
      console.error(error);
      setLoadingMessages(false);
      throw error; // Re-throw the error if you want to handle it further up the call stack
    }
  }

  const getConversationDetail = useCallback(() => {
    setLoadingMessages(false);
    if (!conversationId) return;
    request<any>({
      url: API_ENDPOINTS.conversation.details(conversationId || ''),
      method: 'GET',
    })
      .then(({ content }) => {
        // updateConversation(content);
        
        if (currentConversation?.id === content.id) {
          setChatMessages(content.messagesPanel);
        }
        setLoadingMessages(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingMessages(false);
      });
    // axios
    //   .get(API_ENDPOINTS.conversation.details(conversationId || ''))
    //   .then(({ data: any }) => {
    //     setCurrentConversation(data);

    //     setLoadingMessages(false);
    //   })
    //   .catch((error: any) => {
    //     // Manejo de errores
    //   });
  }, [conversationId]);
  const handleNewMessageRef = useRef<() => void>();

  handleNewMessageRef.current = () => {
    newMessageFlag.onTrue();
    setTimeout(() => {
      newMessageFlag.onFalse();
    }, 100); // Ajusta el tiempo según sea necesario
  };

  useEffect(() => {
    setCurrentConversation(conversation);
  }, [conversation]);

  useEffect(() => {
    if (conversationId) {
      setLoadingMessages(true);
      getConversationDetail();
    }
  }, [conversationId, getConversationDetail]);

  const getConversations = useCallback(() => {
    if (selectedStore) {
      // const QUERY = `?page=${page}&length=100`;
      // const URL = isAdmin
      //   ? API_ENDPOINTS.conversation.listWhatsappByStore(selectedStore, QUERY)
      //   : API_ENDPOINTS.conversation.listWhatsappGroupedByStore(
      //       selectedStore,
      //       QUERY,
      //     );
      // axios
      //   .get(URL)
      //   .then(({ data: any }) => {
      //     setConversations(data.rows);
      //     setLoadingConversations(false);
      //     setTotalConversations(data.total);
      //   })
      //   .catch((error: any) => {
      //     // Manejo de errores
      //   });
    }
  }, [selectedStore, page]);

  // const handlePaginationChange = () => {
  //   let page_aux = page;
  //   setPage((page_aux += 1));
  // };

  const onShowImagePreview = (tempUrl: any) => {
    setImgUrl(tempUrl);
  };

  // const onShowDocumentPreview = (tempUrl: any) => {
  //   setDocumentUrl(tempUrl);
  // };enqueueSnackbar

  useEffect(() => {
    if (notification.conversationUpdate) {
      const conversationUpdate = notification.conversationUpdate;
      console.log(
        'conversationUpdate',
        conversationUpdate,
        currentConversation,
      );
      if (conversationUpdate && conversationUpdate.conversation_id) {
        if (conversationUpdate.conversation_id === currentConversation?.id) {
          console.log('conversationUpdate', conversationUpdate);
          const newMessage = conversationUpdate?.message;
          if (newMessage) {
            setChatMessages((prevMessages: any) => {
              return [...prevMessages, newMessage];
            });
          } else {
            getConversationDetail();
          }

          getConversationDetail();
        }
      }
      // dispatch(setNotificationConversationUpdate(false));
      // getConversations();
    }
  }, [
    getConversations,
    currentConversation,
    getConversationDetail,
    notification,
  ]);

const [isFetchingConversation, setIsFetchingConversation] =
useState<boolean>(false);
useEffect(() => {
  if (notification.conversationUpdate?.conversation_id) {
    const conversationUpdate = notification.conversationUpdate;
    if (conversationUpdate && conversationUpdate.conversation_id) {
      setCurrentPage(0);
      if (!isFetchingConversation) {
        setIsFetchingConversation(true);
        fetchConversationDetails(conversationUpdate.conversation_id)
          .then((conversation: any) => {
            //conversacion actualizada
            conversation.lastMessage =
              conversation.messagesPanel[
                conversation.messagesPanel.length - 1
              ];
            setIsFetchingConversation(false);            
            if (
              conversationUpdate.customer.username ===
              currentConversation?.customer?.username
            ) {
              request<any>({
                url: API_ENDPOINTS.conversation.markAsRead(
                  conversationUpdate.conversation_id,
                ),
                method: 'PUT',
              });
              let total = conversationsQuantity;
              if (currentConversation?.id !== conversationUpdate.conversation_id) {                  
                setCurrentConversation((prevConversation: any) => ({
                  ...prevConversation,
                  id: conversationUpdate.conversation_id,
                }));
                setConversationsQuantity((prevTotal: number) => {
                  const newTotal = prevTotal + 1;
                  return newTotal;
                });
                total++;
              }
              
              const { messagesPanel } = conversation;
              total > 1 && (messagesPanel[0].isFirstMessage = true);
              setChatMessages((prevMessages: any) => {
                const filteredMessages = (prevMessages ?? []).filter(
                  (message: any) => !message?.temporal
                );
                const combinedData = [
                  ...(filteredMessages ?? []),
                  ...messagesPanel,
                ];
                const uniqueData = Array.from(
                  new Map(
                    combinedData.map((item: any) => [item.id, item]),
                  ).values(),
                );
                return Array.from(uniqueData);
              });
            } 
          })
          .catch(() => {
            setIsFetchingConversation(false);
          });
      }
    }
  }
}, [notification]);
useEffect(() => {
  if (notification.newTag && notification.newTag.customer.id) {
    const newTag = notification.newTag;
    if (newTag && newTag.customer.id) {
      setCurrentPage(0);
      const updateUndoneTags = () => {
        const newUndoneHumanAttentionTags =
          newTag?.tags?.undoneHumanAttentionTags?.map(
            ({ id, name, summary }: any) => ({ id, name, summary }),
          ) || [];
        const newUndoneTaggedTags =
          newTag?.tags?.undoneTaggedTags?.map(
            ({ id, name, summary }: any) => ({ id, name, summary }),
          ) || [];      

        // Update currentConversation if it is the same
        if (currentConversation?.customer?.id === newTag.customer.id) {
          setCurrentConversation((prevConversation: any) => ({
            ...prevConversation,
            customer: {
              ...prevConversation.customer,
              undoneHumanAttentionTags: [
                ...(prevConversation.customer.undoneHumanAttentionTags || []),
                ...newUndoneHumanAttentionTags,
              ],
              undoneTaggedTags: [
                ...(prevConversation.customer.undoneTaggedTags || []),
                ...newUndoneTaggedTags,
              ],
            },
          }));
        }
      };      
      updateUndoneTags();
    }
  }
}, [notification, currentConversation?.customer?.id]);

const onSendAudio = useCallback(
  async (body: any) => {
    const buffer = await body.arrayBuffer();
    const binaryString = Array.from(new Uint8Array(buffer), byte => String.fromCharCode(byte)).join('');
    const theAudio = btoa(binaryString);
    const DATA = {        
      message: theAudio,
      type: 'audio'
    }
    const msg = {
      id: "temporal",
      content: "",
      role: "store",
      created_at: new Date(),
      class: "message-storeaudio",
      extra_data: theAudio,
      mimetype: "audio/wav",
      type: "audio"
    }
    
    // Primero agregamos el mensaje temporal
    setChatMessages((prevMessages: any) => [...prevMessages, msg]);      
    try {
      const { content } = await request<any[]>({
        url: API_ENDPOINTS.conversation.sendAudio(currentConversation.id),
        method: 'POST',
        data: DATA,
      });
      onUpdateChat(currentConversation);
      // Actualizamos usando el callback para asegurar el último estado
      setChatMessages((prevMessages: any) => {
        const updatedMessages = prevMessages.map((msg: any) => {
          if (msg.id === 'temporal') {
            return content;
          }
          return msg;
        });
        return updatedMessages;
      });
    } catch (error) {
      console.log(error);
      // Removemos el mensaje temporal en caso de error
      setChatMessages((prevMessages: any) => 
        prevMessages.filter((msg: any) => msg.id !== 'temporal')
      );   
    }
  },
  [currentConversation?.id]
);
const onSendImage = useCallback(
  async (body: any) => {     
    const base64Prefix = body.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    let imageData = body;
    if (base64Prefix) {
      imageData = body.replace(base64Prefix[0], '');
    }
    const DATA = {        
      message: imageData,
      type: 'image'
    }
    const msg = {
      id: "temporal",
      content: "",
      role: "store",
      created_at: new Date(),
      class: "message-storeimage",
      extra_data: body,
      mimetype: "image/jpeg",
      type: "image"
    }
    
    // Primero agregamos el mensaje temporal
    setChatMessages((prevMessages: any) => [...prevMessages, msg]);      
    try {
      const { content } = await request<any[]>({
        url: API_ENDPOINTS.conversation.sendImage(currentConversation.id),
        method: 'POST',
        data: DATA,
      });

      // Actualizamos usando el callback para asegurar el último estado
      onUpdateChat(currentConversation);
      setChatMessages((prevMessages: any) => {
        const updatedMessages = prevMessages.map((msg: any) => {
          if (msg.id === 'temporal') {
            return content;
          }
          return msg;
        });
        return updatedMessages;
      });

    } catch (error) {
      console.log(error);
      // Removemos el mensaje temporal en caso de error
      setChatMessages((prevMessages: any) => 
        prevMessages.filter((msg: any) => msg.id !== 'temporal')
      );        
    }
  },
  [currentConversation?.id]
);
  const sendImage = async () => {
    if (!imgUrl) {
      // enqueueSnackbar('Ha ocurrido un error al cargar la imagen', {
      //   variant: 'error',
      // });
      return;
    }

    // const response = await fetch(imgUrl);
    // const blob = await response.blob();

    // const mimeType = response.headers.get('Content-Type');
    // // Leer el Blob como ArrayBuffer
    // const buffer = await blob.arrayBuffer();
    // const binaryString = Array.from(new Uint8Array(buffer), (byte) =>
    //   String.fromCharCode(byte),
    // ).join('');

    // // Convertir el string binario a base64
    // const base64Data = btoa(binaryString);

    // const theImage = `data:${mimeType};base64,${base64Data}`;

    // // Datos para enviar
    // const DATA = {
    //   message: theImage,
    // };
    setImgUrl(null);
    // axios
    //   .post(API_ENDPOINTS.conversation.sendImage(currentConversation.id), DATA)
    //   .then(({ data: any }) => {
    //     const newMessage = {
    //       ...data,
    //       role: 'assistant',
    //     };
    //     getConversationDetail();
    //     // Mixpanel.track('New Message', { source: 'store-panel' });
    //   })
    //   .catch((error: any) => {
    //     // enqueueSnackbar(t(`${error.error}`), { variant: 'error' });
    //   });
  };
  const sendMessage = async (message: any) => {
    const trimmedMessage = message.trim();
    const { name } = await getStoreInfo(nexo);
    // temporal es para marcar el mensaje como temporal
    const newMessage = {
      class: 'message-store',
      message: trimmedMessage,
      // TODO: agregar el id del usuario de la tienda
      role: 'store',
      username: name,
      temporal: true,
      id: new Date().getTime(),
      created_at: new Date().toISOString(),
    };

    const newMessageWithContent = { ...newMessage, content: trimmedMessage };
    setChatMessages((prevMessages: any) => [
      ...prevMessages,
      newMessageWithContent,
    ]);
    handleNewMessageRef.current?.();
    request<any[]>({
      url: API_ENDPOINTS.conversation.sendMessage(currentConversation.id),
      method: 'POST',
      data: { message },
    })
      .then(() => {
        onUpdateChat(currentConversation);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMessages(false);
      });
  };
  // const checkBanStatus = (channel: string, username: string) => {
  //   console.log(channel, username);
  //   // axios
  //   //   .get(API_ENDPOINTS.bannedUsers.check(channel, username))
  //   //   .then(({ data }) => {
  //   //     setBannedUser(data);
  //   //   })
  //   //   .catch((error) => {});
  // };
  // useEffect(() => {
  //   if (currentConversation) {
  //     const { username, channel } = currentConversation;
  //     checkBanStatus(channel.id, username);
  //   }
  // }, [currentConversation]);

  const fetchConversations = useCallback(() => {
    getConversations();
  }, [getConversations]);

  useEffect(() => {
    if (selectedStore && loadBannedUsers) {
      // setLoadingConversations(true);
      fetchConversations();
    }
  }, [selectedStore, page, fetchConversations, loadBannedUsers]);

  const handlePaginationConversation = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const onChangeQualification = () => {
    getConversationDetail();
  };

  // const checkPausedUser = (channel: string, username: string) => {
  //   console.log(channel, username);
  //   // axios
  //   //   .get(API_ENDPOINTS.pausedUsers.check(channel, username))
  //   //   .then(({ data: any }) => {
  //   //     setPausedUser(data);
  //   //   })
  //   //   .catch((error: any) => {});
  // };
  // useEffect(() => {
  //   if (currentConversation) {
  //     const { username, channel } = currentConversation;
  //     checkPausedUser(channel.id, username);
  //   }
  // }, [currentConversation]);

  const onChangePausedUser = () => {
    if (onUpdatePaused) {
      onUpdatePaused(currentConversation.id);
    }

    if (pausedUser) {
      // axios
      //   .delete(API_ENDPOINTS.pausedUsers.activate(pausedUser.id))
      //   .then(({ data: any }) => {
      //     // enqueueSnackbar('Bot activado');
      //     setPausedUser(null);
      //   })
      //   .catch((error: any) => {
      //     // enqueueSnackbar('Hubo un error al pausar el bot', {
      //     //   variant: 'error',
      //     // });
      //   });
    } else {
      // const { name, username, channel, store } = currentConversation;
      // axios
      //   .post(API_ENDPOINTS.pausedUsers.pause, {
      //     name,
      //     username,
      //     channel: channel.id,
      //     store: store.id,
      //   })
      //   .then(({ data: any }) => {
      //     enqueueSnackbar('Bot pausado');
      //     checkPausedUser(channel.id, username);
      //   })
      //   .catch((error: any) => {
      //     enqueueSnackbar('Hubo un error al pausar el usuario', {
      //       variant: 'error',
      //     });
      //   });
    }
  };

  const renderHead = (
    <Box padding="1">
      <ConversationHeaderCompose
        currentConversation={currentConversation}
        loadingState={loadingButton.value}
        onChangeQualification={onChangeQualification}
        onChangePausedUser={onChangePausedUser}
        pausedUser={pausedUser}
        onViewOrder={() => {}}
        onParentEvent={onParentEvent}
      />
    </Box>
  );

  const handleCloseImage = () => {
    setImgUrl(null);
  };

  const fetchMoreConversations = useCallback(() => {
    setLoadingMoreMessages(true);
    request<any>({
      url: API_ENDPOINTS.conversation.getConversationByUsername(
        conversation?.customer?.username,
        currentPageRef.current,
      ),
      method: 'GET',
    })
      .then(({ content }) => {
        setTotalMessagesPages(content.total);
        setConversationsQuantity(content.total);
        if (content.rows.length > 0) {
          const newMessages = content.rows.flatMap(
            (row: any) => row.messagesPanel,
          );
          newMessages.sort((a: any, b: any) => a.id - b.id);
          setChatMessages((prevMessages: any) => {
            return [...newMessages, ...prevMessages];
          });
          setLoadingMoreMessages(false);
          setLoadingInitialMessages(false);
        }
      })
      .catch((error) => {
        console.error(error);
        // Manejo de errores
      });
  }, [currentConversation?.username]);

  useEffect(() => {
    currentPageRef.current = currentPage;
    if (currentPage > 0) {
      setLoadingMoreMessages(true);
      fetchMoreConversations();
    }
  }, [currentPage, fetchMoreConversations]);

  useEffect(() => {
    if (
      currentConversation &&
      chatMessages.length < import.meta.env.VITE_MIN_DISPLAYED_MESSAGES
    ) {
      fetchMoreConversations();
    } else {
      setLoadingInitialMessages(false);
    }
  }, [currentConversation]);

  const lastMessage = currentConversation?.lastMessage;

  const renderMessages = (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <ConversationTagsHeader
        currentConversation={currentConversation}
        onResolveAttention={onUpdateTags}
      />
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#ffffff',
        }}
      >
        {imgUrl && (
          <Box
            width="100%"
            height="100%"
            position="relative"
            style={{
              backgroundColor: '#E9EDEF',
            }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
            >
              <img
                src={imgUrl}
                alt="Preview"
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </Box>
            <Box position="absolute" top="2" left="20">
              <IconButton
                onClick={handleCloseImage}
                sx={{
                  backgroundColor: 'grey.100',
                  '&:hover': {
                    backgroundColor: 'grey.400',
                  },
                }}
              >
                <Iconify icon="eva:close-fill" color="black" />
              </IconButton>
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
              sx={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}
            >
              <IconButton
                onClick={sendImage}
                sx={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1ebe5f',
                  },
                }}
              >
                <Iconify width={24} icon="ic:baseline-send" />
              </IconButton>
            </Stack>
          </Box>
        )}
        {!imgUrl && currentConversation && (
          <>
            <ConversationMessageList
              messages={chatMessages || []}
              participants={participantsInConversation}
              loadMoreConversations={() => {
                handlePaginationConversation();
              }}
              store={selectedStore}
              newMessage={newMessageFlag.value}
              isLoading={loadingMessages}
              conversation={currentConversation}
              isLoadingInitialMessages={loadingInitialMessages}
              onClickConversation={() => {}}
              hasMore={currentPageRef.current <= totalMessagesPages}
              fetchingMoreMessages={loadingMoreMessages}
            />
            <PricingAlertStatus type={billingData?.status} daysLeft={billingData?.billingPlan?.dayLeft} isCostumerInvoice={billingData?.isCostumerInvoice} />
            {isChannelConnected ? (
               <Box backgroundColor="primary-surface">

               <ConversationMessageInput
                 recipients={[]}
                 onSendCompose={sendMessage}
                 onSendMessage={sendMessage}
                 onShowImagePreview={onShowImagePreview}
                 onSendAudio={onSendAudio}
                 onSendImage={onSendImage}
                 currentConversation={currentConversation}
                 isLoadingInitialMessages={loadingInitialMessages}
                 lastMessage={lastMessage}
                 newTag={notification?.newTag}
               />
             </Box>
            ) : (
              <Box backgroundColor="danger-surface" padding="4" alignItems="center" justifyContent="center">
                <MessageInputNoChannels />
              </Box>
            )}
           
          </>
        )}
      </Stack>
    </Box>
  );

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-chat-view.tsx:822',message:'ChatView render',data:{showChat,hasCurrentConversation:!!currentConversation,conversationId:currentConversation?.id,messagesCount:chatMessages?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3,H5'})}).catch(()=>{});
  // #endregion

  return (
    <Sidebar padding="none" open={showChat} onRemove={() => {}} maxWidth="100%">
      <Card padding="none">
        <Box display="flex" flexDirection="row" height="90vh">
          <Stack
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
          >
            {currentConversation && renderHead}

            <Stack
              direction="row"
              sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              {renderMessages}
            </Stack>
          </Stack>
        </Box>
      </Card>
    </Sidebar>
  );
}
