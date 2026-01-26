import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// import axios, { API_ENDPOINTS } from 'src/utils/axios';

// _mock

// @mui
import { IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';

import { useDispatch, useSelector } from 'react-redux';
import ConversationHeaderCompose from '../conversation-header-compose';

import ConversationMessageList from '../conversation-message-list';
import ConversationNav from '../conversation-nav';

import { API_ENDPOINTS } from '@/app/Axios/Axios';
import nexo from '@/app/NexoClient';
import Iconify from '@/components/iconify/iconify';
import PricingAlertStatus from '@/components/PricingAlertStatus/PricingAlertStatus';
import Responsive from '@/components/Responsive';
import { useFetch } from '@/hooks';
import {
  reset,
  setNotificationConversationUpdate,
  setNotificationNewTag,
  resetReloadConversation
} from '@/redux/slices/notification';
import { conversationReferenceIds } from '@/constants/conversationReferenceIds';
import { Box, Card, useToast } from '@nimbus-ds/components';
import { InfoCircleIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns';
import { getStoreInfo } from '@tiendanube/nexo';
import { useTranslation } from 'react-i18next';
import ConversationMessageInput from '../conversation-message-input';
import ConversationNavMobile from '../conversation-nav-mobile';
import ConversationTagsHeader from '../conversation-tags-headers';
import { useBoolean } from '../hooks/use-boolean';
import useChat from '../hooks/use-chat';
import MessageInputNoChannels from '../message-input-no-channels';
import ModeCustomerDataProvider from '../providers/ModeCustomerDataProvider';
import { ModeContext } from '../providers/ModeDataProvider';
import PaymentRequiredAlert from '@/components/PricingAlertStatus/PaymentRequiredAlert';
import { BillingDTO } from '@/types/billingDTO';
import FailedMessageAlertStatus from '@/components/FailedMessageAlertStatus/FailedMessageAlertStatus';
import { IConversationMessage } from '@/types/conversation';
import WhatsAppAlertsContainer from '@/components/FailedMessageAlertStatus/WhatsAppAlertsContainer';
import { selectActiveFilter } from '@/redux/slices/channels';

//

// ----------------------------------------------------------------------
type ConversationViewProps = {
  conversationId: string;
};
export default function ConversationView({
  conversationId,
}: ConversationViewProps) {
  const loadingButton = useBoolean();
  const { selectedMode } = useContext(ModeContext);
  const { contacts, participantsInConversation } = useChat();

  // const details = !!currentConversationId;
  const [selectedStore, setSelectedStore] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(true);
  const [currentConversation, setCurrentConversation] = useState<any>();
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [loadingMoreConversations, setLoadingMoreConversations] =
    useState<boolean>(false);
  const [loadingMoreMessages, setLoadingMoreMessages] =
    useState<boolean>(false);

  const notification = useSelector((state: any) => state.notification);
  const channelFilter = useSelector(selectActiveFilter);

  // Filter conversations by channel
  const filteredConversations = useMemo(() => {
    if (channelFilter === 'all') {
      return conversations;
    }
    return conversations.filter((conv: any) => 
      conv.channel?.channelType === channelFilter
    );
  }, [conversations, channelFilter]);

  //Paginación de las conversaciones anteriores
  const [currentPage, setCurrentPage] = useState<number>(0);
  const currentPageRef = useRef(0);
  const [loadingInitialMessages, setLoadingInitialMessages] =
    useState<boolean>(true);
  const [totalMessagesPages, setTotalMessagesPages] = useState<number>(0);

  const dispatch = useDispatch();
  const stateStore: any = [];
  const [page, setPage] = useState<number>(0);
  const pageRef = useRef(page);
  const [totalConversations, setTotalConversations] = useState<number>(0);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const [pausedUser] = useState<any>();
  const [newMessageFlag, setNewMessageFlag] = useState(false);

  const { t } = useTranslation('translations');
  const { request } = useFetch();
  const [neeedAttention, setNeedAttention] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [markAsResolved, setMarkAsResolved] = useState<boolean>(false);
  const [isChannelConnected, setIsChannelConnected] = useState<boolean>(false);
  const billingData: BillingDTO = useSelector((state: any) => state?.billing?.billingData);
  const { addToast } = useToast();

  // Use hardcoded list of available reference_ids
  const availableReferenceIds = conversationReferenceIds;  
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
    setIsChannelConnected(isChannelConnected);
  }, []);

  const [conversationsQuantity, setConversationsQuantity] = useState<number>(0);
  const handleNewMessage = () => {
    setNewMessageFlag(true);
  };

  useEffect(() => {
    if (newMessageFlag) {
      const timer = setTimeout(() => {
        setNewMessageFlag(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessageFlag]);

  useLayoutEffect(() => {
    if (conversationId) {
      request<any>({
        url: API_ENDPOINTS.conversation.details(conversationId || ''),
        method: 'GET',
      })
        .then(({ content }) => {
          // updateConversation(content);
          onClickNavItem(content);
        })
        .catch((error) => {
          console.error(error);
          setLoadingMessages(false);
        });
    }
  }, [conversationId]);

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

  const toggleAttention = () => {
    setPage(0);
    setConversations([]);
    setNeedAttention((prev) => !prev);
    getUnreadConversations();
  };

  useEffect(() => {
    getUnreadConversations();
  }, []);

  const getConversationDetail = useCallback(
    (converId: string) => {
      request<any>({
        url: API_ENDPOINTS.conversation.details(converId || ''),
        method: 'GET',
      })
        .then(({ content }) => {
          if (currentConversation?.id === content.id) {            
            setChatMessages(content.messagesPanel);
          }
          setLoadingMessages(false);
        })
        .catch((error) => {
          console.error(error);
          setLoadingMessages(false);
        });
    },
    [currentConversation?.id],
  );
  useEffect(() => {
    pageRef.current = page;
    if (page >= 0) {
      if (page === 0) {
        setLoadingConversations(true);
      } else {
        setLoadingMoreConversations(true);
      }
      getConversations(page === 0, neeedAttention, searchQuery, selectedTagFilter);
    }
  }, [page, neeedAttention, searchQuery, selectedTagFilter]);

  const getConversations = useCallback((_resetPage: boolean = false, neeedAttentionFilter: boolean, searchQueryFilter: string = '', tagFilter: string = 'all') => {

    const queryParts = [`attention=${neeedAttentionFilter}`, `length=20`];
    if (searchQueryFilter) {
      queryParts.push(`search=${searchQueryFilter}`);
    }
    if (tagFilter !== 'all') {
      queryParts.push(`tagName=${tagFilter}`);
    }
    const query = queryParts.join('&');

    request<any[]>({
      url: API_ENDPOINTS.conversation.byStoreGrouped(pageRef.current.toString(), query),
      method: 'GET',
    })
      .then(({ content }: any) => {
         console.log('content', content.rows);
        if (_resetPage) {
          setConversations(content.rows);
        } else {
          setConversations((prevConversations) => {
            const newConversations = content.rows.filter(
              (newConv: any) => !prevConversations.some((prevConv: any) => prevConv.id === newConv.id)
            );
            return [...prevConversations, ...newConversations];
          });
        }
        setLoadingConversations(false);
        setLoadingMoreConversations(false);
        setTotalConversations(content.total);
      })
      .then(({ content }: any) => {
        setConversations((prevConversations) => {
          const newConversations = content.rows.filter(
            (newConv: any) =>
              !prevConversations.some(
                (prevConv: any) => prevConv.id === newConv.id,
              ),
          );
          return [...prevConversations, ...newConversations];
        });
        setLoadingConversations(false);
        setLoadingMoreConversations(false);
        setTotalConversations(content.total);
      })
      .catch(() => {
        setLoadingMoreConversations(false);
        setLoadingConversations(false);
        setLoadingMessages(false);
      });
  },
    [],
  );

  const handlePaginationChange = () => {
    let page_aux = page;
    setPage((page_aux += 1));
  };

  const onShowImagePreview = (tempUrl: any) => {
    setImgUrl(tempUrl);
  };

  // const onShowDocumentPreview = (tempUrl: any) => {
  //   setDocumentUrl(tempUrl);
  // };

  const handlePaginationConversation = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      currentPageRef.current = nextPage; // Actualizamos la referencia con el nuevo valor
      return nextPage;
    });
  };

  const fetchMoreConversations = useCallback(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:fetchMoreConversations',message:'CALLING API',data:{username:currentConversation?.customer?.username,page:currentPageRef.current},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H12'})}).catch(()=>{});
    // #endregion
    setLoadingMoreMessages(true);
    currentConversation &&
      request<any>({
        url: API_ENDPOINTS.conversation.getConversationByUsername(
          currentConversation?.customer?.username,
          currentPageRef.current,
        ),
        method: 'GET',
      })
        .then(({ content }) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:fetchMoreConversations:response',message:'API response',data:{rowsCount:content?.rows?.length,total:content?.total,firstRowMessages:content?.rows?.[0]?.messagesPanel?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H12,H13'})}).catch(()=>{});
          // #endregion
          setConversationsQuantity(content.total);
          setTotalMessagesPages(content.total);
          if (content.rows.length > 0) {
            const newMessages = content.rows.flatMap((row: any, index: number) => {
              if (row.messagesPanel.length > 0 && content.rows.length > 1 && index < content.rows.length - 1) {
                row.messagesPanel[0].isFirstMessage = true;
              }
              return row.messagesPanel;
            });

            newMessages.sort((a: any, b: any) => a.id - b.id);            
            setChatMessages((prevMessages: any) => {
              const allMessages = [...newMessages, ...prevMessages];
              const uniqueMessages = Array.from(
                new Set(allMessages.map((msg) => msg.id)),
              ).map((id) => allMessages.find((msg) => msg.id === id));
              return uniqueMessages;
            });
          }
          setLoadingInitialMessages(false);
          setLoadingMoreMessages(false);
          setLoadingMoreConversations(false);
        })
        .catch((error) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:fetchMoreConversations:error',message:'API ERROR',data:{error:error?.message||String(error)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H12'})}).catch(()=>{});
          // #endregion
          console.error(error);
          // Manejo de errores
        });
  }, [currentConversation?.customer?.username]);

  const getUnreadConversations = useCallback(() => {
    request<any>({
      url: API_ENDPOINTS.conversation.unread,
      method: 'GET',
    })
      .then(({ content }) => {
        const { count } = content;
        setUnreadMessagesCount(count);
      })
      .catch((error) => {
        console.error(error);
        // Manejo de errores
      });
  }, [currentConversation?.username]);

  // this method is used to load more messages when the user scrolls down
  useEffect(() => {
    currentPageRef.current = currentPage;
    if (currentPageRef.current > 0 && currentConversation) {
      setLoadingMoreMessages(true);
      fetchMoreConversations();
    }
  }, [currentPageRef, currentConversation?.customer?.username]);

  // useEffect(() => {
  //   if (currentConversation && chatMessages.length < import.meta.env.VITE_MIN_DISPLAYED_MESSAGES) {
  //     handlePaginationConversation();
  //     // fetchMoreConversations();
  //   }
  //   else {
  //     setLoadingInitialMessages(false);
  //   }
  // }, [currentConversation, chatMessages]);

  const [isFetchingConversation, setIsFetchingConversation] =
    useState<boolean>(false);
  useEffect(() => {
    if (notification.conversationUpdate?.conversation_id) {
      const conversationUpdate = notification.conversationUpdate;
      if (conversationUpdate && conversationUpdate.conversation_id) {
        setPage(0);
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
              if (searchQuery || selectedTagFilter !== 'all') {
                setPage(0);
                getConversations(true, neeedAttention, searchQuery, selectedTagFilter);
              }
              else {
                setConversations((prevConversations: any) => {
                  if (!Array.isArray(prevConversations)) {
                  return prevConversations;
                }
                const conversationExists = prevConversations?.some(
                  (conv: any) =>
                    conv.customer.username === conversation.customer.username,
                );

                let updatedConversations;
                if (conversationExists) {
                  if (
                    conversationUpdate.customer.username ===
                    currentConversation?.customer?.username
                  ) {
                    conversation.unreadMessages = 0;
                  }
                  updatedConversations = prevConversations.map((conv: any) =>
                    conv.customer.username === conversation.customer.username
                      ? conversation
                      : conv,
                  );
                } else {
                  updatedConversations = [...prevConversations, conversation];
                }

                // Ordenar las conversaciones por el valor del último mensaje en la colección messages
                return updatedConversations.sort((a: any, b: any) => {
                  const lastMessageA = a.lastMessage?.created_at;
                  const lastMessageB = b.lastMessage?.created_at;
                  return (
                    new Date(lastMessageB).getTime() -
                    new Date(lastMessageA).getTime()
                  );
                });
              });
            }
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
                  // filtro para eliminar los mensajes temporales que son los enviados desde el panel
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
                handleNewMessage(); // Llama a la función para activar la bandera
              } else {
                getUnreadConversations();
              }
              getUnreadConversations();
            })
            .catch(() => {
              setIsFetchingConversation(false);
            });
        }
      }
    }
    if (notification.reloadConversation) {            
        getConversations(true, neeedAttention, searchQuery, selectedTagFilter);
        currentConversation?.id && getConversationDetail(currentConversation?.id);
        getUnreadConversations();
        dispatch(resetReloadConversation());
    }
    dispatch(setNotificationConversationUpdate(false));
  }, [notification]);

  useEffect(() => {
    if (notification.newTag && notification.newTag.customer.id) {
      const newTag = notification.newTag;
      if (newTag && newTag.customer.id) {
        setPage(0);
        const updateUndoneTags = () => {
          const newUndoneHumanAttentionTags =
            newTag?.tags?.undoneHumanAttentionTags?.map(
              ({ id, name, summary }: any) => ({ id, name, summary }),
            ) || [];
          const newUndoneTaggedTags =
            newTag?.tags?.undoneTaggedTags?.map(
              ({ id, name, summary }: any) => ({ id, name, summary }),
            ) || [];
          let found = false;
          let updatedConversations: any[] = [];
          if (
            (newUndoneHumanAttentionTags || newUndoneTaggedTags) &&
            conversations
          ) {
            updatedConversations = conversations.map((conversation) => {
              if (conversation.customer.id === newTag.customer.id) {
                found = true;
                const updatedCustomer = {
                  ...conversation.customer,
                  undoneHumanAttentionTags: Array.from(
                    new Map(
                      [
                        ...(conversation.customer.undoneHumanAttentionTags ||
                          []),
                        ...newUndoneHumanAttentionTags,
                      ].map((tag) => [tag.id, tag]),
                    ).values(),
                  ),
                  undoneTaggedTags: Array.from(
                    new Map(
                      [
                        ...(conversation.customer.undoneTaggedTags || []),
                        ...newUndoneTaggedTags,
                      ].map((tag) => [tag.id, tag]),
                    ).values(),
                  ),
                  state: notification.newTag.customer.state,
                };
                return {
                  ...conversation,
                  customer: updatedCustomer,
                };
              }

              return conversation;
            });
          }
          if (!found) {
            getConversations(true, neeedAttention, searchQuery);
          } else {
            setConversations(updatedConversations);
          }

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
        setMarkAsResolved(false);
        updateUndoneTags();
      }
    }
    dispatch(setNotificationNewTag(false));
  }, [notification, getConversations, currentConversation?.customer?.id]);
  
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
        addToast({
          type: 'danger',
          text: t('settings.step4.Could not process audio due to external issues with the service that processes the audio.'),
          duration: 4000,
          id: 'error-send-audio',
        });
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
    // Leer el Blob como ArrayBuffer
    // const buffer = await blob.arrayBuffer();
    // const binaryString = Array.from(new Uint8Array(buffer), (byte) =>
    //   String.fromCharCode(byte),
    // ).join('');

    // Convertir el string binario a base64
    // const base64Data = btoa(binaryString);

    // const theImage = `data:${mimeType};base64,${base64Data}`;

    // Datos para enviar
    // const DATA = {
    //   message: theImage,
    // };
    setImgUrl(null);
    // axios
    //   .post(API_ENDPOINTS.conversation.sendImage(currentConversation.id), DATA)
    //   .then(({ data }) => {
    //     const newMessage = {
    //       ...data,
    //       role: 'assistant',
    //     };
    //     setCurrentConversation((prevConversation: IConversation) => ({
    //       ...prevConversation,
    //       messages: [...prevConversation.messages, newMessage],
    //     }));
    //     Mixpanel.track('New Message', { source: 'store-panel' });
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(t(`${error.error}`), { variant: 'error' });
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
    setLoadingInitialMessages(true);

    request<any[]>({
      url: API_ENDPOINTS.conversation.sendMessage(currentConversation.id),
      method: 'POST',
      data: newMessage,
    })
      .then(() => {
       /* const updatedConversations = conversations?.map((conversation: any) => {
          console.log(conversation);
          if (conversation.id === currentConversation.id) {
            return {
              ...conversation,
              messagesPanel: [...conversation.messagesPanel, content],
            };
          }
          return conversation;
        });
        setConversations(updatedConversations);*/
        // getConversations(false, neeedAttention, searchQuery);
        setLoadingInitialMessages(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMessages(false);
      });
  };
  
  const handleResolveAttention = () => {
    setCurrentConversation({
      ...currentConversation,
      customer: {
        ...currentConversation.customer,
        undoneHummanAttentionTags: [],
      },
    });
    updateTagsFromConversationsList(currentConversation.id);
  };
  const updateTagsFromConversationsList = (conversationId: number) => {
    getUnreadConversations();
    setConversations((prevConversations: any) => {
      const updatedConversations = prevConversations.map((conversation: any) =>
        conversation.id === conversationId
          ? {
            ...conversation,
            customer: {
              ...conversation.customer,
              undoneHumanAttentionTags: [],
            },
          }
          : conversation,
      );
      // console.log('Updated Conversations:', updatedConversations);
      return updatedConversations;
    });

    if (neeedAttention) {
      setConversations((prevConversations) =>
        prevConversations
          ? prevConversations.filter(
            (conversation) => conversation.id !== conversationId,
          )
          : [],
      );
    }
  };

  const prevStoreIdRef = useRef(stateStore.id);
  useEffect(() => {
    // Only clear conversation if store actually changed (not on initial render)
    if (prevStoreIdRef.current !== stateStore.id && prevStoreIdRef.current !== undefined) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:812-useEffect',message:'CLEARING currentConversation (store changed)',data:{prevStoreId:prevStoreIdRef.current,newStoreId:stateStore.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6-fix'})}).catch(()=>{});
      // #endregion
      setCurrentConversation(undefined);
    }
    prevStoreIdRef.current = stateStore.id;
    setSelectedStore(stateStore.id);
  }, [stateStore.id]);

  const onClickNavItem = (conversationAux: any) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:onClickNavItem',message:'SELECTING conversation',data:{conversationId:conversationAux?.id,customerId:conversationAux?.customer?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6,H8'})}).catch(()=>{});
    // #endregion
    setCurrentConversation(conversationAux);
    currentPageRef.current = 0;
    setCurrentPage(0);
    if (currentConversation?.id !== conversationAux?.id) {
      setChatMessages([]);
      setLoadingInitialMessages(true);
    }
  };

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:useEffect-fetchMessages',message:'useEffect triggered',data:{hasUsername:!!currentConversation?.customer?.username,username:currentConversation?.customer?.username,conversationId:currentConversation?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H11'})}).catch(()=>{});
    // #endregion
    if (currentConversation?.customer?.username) {
      fetchMoreConversations();
    }
  }, [
    currentConversation?.customer?.username,
    fetchMoreConversations,    
  ]);

  // Cuando se incrementa la página, cargar más mensajes
  useEffect(() => {
    if (currentPage > 0 && currentConversation) {
      fetchMoreConversations();
    }
  }, [currentPage, fetchMoreConversations]);

  const onChangeQualification = (updatedConversationId: any) => {
    console.log(updatedConversationId);
    // axios
    //   .get(API_ENDPOINTS.conversation.details(updatedConversationId))
    //   .then(({ data }) => {
    //     updateConversation(data);
    //   })
    //   .catch((error) => {
    //     // Manejo de errores
    //   });
  };

  const onChangePausedUser = () => {
    if (pausedUser) {
      // axios
      //   .delete(API_ENDPOINTS.pausedUsers.activate(pausedUser.id))
      //   .then(({ data }) => {
      //     addToast({
      //       type: 'success',
      //       text: 'Bot activado',
      //       duration: 4000,
      //       id: 'bot-tactivate',
      //     });
      //     setPausedUser(null);
      //   })
      //   .catch((error) => {
      //     enqueueSnackbar('Hubo un error al pausar el bot', {
      //       variant: 'error',
      //     });
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
      //   .then(({ data }) => {
      //     enqueueSnackbar('Bot pausado');
      //     checkPausedUser(channel.id, username);
      //   })
      //   .catch((error) => {
      //     enqueueSnackbar('Hubo un error al pausar el usuario', {
      //       variant: 'error',
      //     });
      //   });
    }
  };
  const renderHead = (
    <Stack>
      <ConversationHeaderCompose
        currentConversation={currentConversation}
        loadingState={loadingButton.value}
        onChangeQualification={() =>
          onChangeQualification(currentConversation?.id)
        }
        onChangePausedUser={onChangePausedUser}
        pausedUser={pausedUser}
        onViewOrder={() => {
          // setShowOrder(true);
          // setOrderTrigger((prev) => prev + 1);
        }}
      />
    </Stack>
  );

  const renderNav = (
    <ConversationNav
      contacts={contacts}
      conversations={filteredConversations || []}
      onClickConversation={onClickNavItem}
      loading={loadingConversations}
      currentConversationId={currentConversation?.id}
      handlePaginationChange={handlePaginationChange}
      totalConversations={totalConversations}
      fetchingMoreConversations={loadingMoreConversations}
      handleNeedAttention={toggleAttention}
      handleSearch={(query: string) => {
        setPage(0);
        setSearchQuery(query);
      }}
      handleTagFilter={(tag: string) => {
        setPage(0);
        setSelectedTagFilter(tag);
      }}
      availableReferenceIds={availableReferenceIds}
      markAsResolved={markAsResolved}
      storeSelectedMode={selectedMode}
      unreadMessagesCount={unreadMessagesCount}
    />
  );

  const getLastBotMessage = () => (chatMessages || [])
      .filter((msg: IConversationMessage) => msg.role === 'assistant')
      .slice(-1)[0] || null;

  const handleCloseImage = () => {
    setImgUrl(null);
  };
  const lastMessage = currentConversation?.lastMessage;
  const renderMessages = (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <ConversationTagsHeader
        currentConversation={currentConversation}
        onResolveAttention={handleResolveAttention}
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
            {/* #region agent log */}
            {(() => { fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:renderMessages',message:'RENDERING messages area',data:{hasConversation:true,conversationId:currentConversation?.id,messagesCount:chatMessages?.length,isChannelConnected},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H9,H10'})}).catch(()=>{}); return null; })()}
            {/* #endregion */}
            <ConversationMessageList
              messages={chatMessages || []}
              participants={participantsInConversation}
              loadMoreConversations={() => {
                handlePaginationConversation();
              }}
              store={selectedStore}
              newMessage={newMessageFlag}
              isLoading={loadingMessages}
              conversation={currentConversation}
              isLoadingInitialMessages={loadingInitialMessages}
              onClickConversation={onClickNavItem}
              hasMore={currentPageRef.current <= totalMessagesPages}
              fetchingMoreMessages={loadingMoreMessages}
            />
            <FailedMessageAlertStatus
              message={getLastBotMessage() || null}
              keyMessage={'conversations.failed-message-alert'}
            />
              <PricingAlertStatus type={billingData?.status} daysLeft={billingData?.billingPlan?.dayLeft} isCostumerInvoice={billingData?.isCostumerInvoice} />
              {isChannelConnected ? (
                <Box backgroundColor="neutral-surface">
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
                  markAsResolved={markAsResolved}
                  newTag={notification?.newTag}
                />
              </Box>
              ) : (
                <Box backgroundColor="danger-surface" height="300px">
                  <MessageInputNoChannels />
                </Box>
              )}
            
          </>
        )}
        {!currentConversation && (
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {billingData?.status === 'inactive' && <PaymentRequiredAlert />}
            {billingData?.status !== 'inactive' && <EmptyMessage
              text={t('conversations.unselected-conversation')}
              title=""
              icon={<InfoCircleIcon size={32} color="black" />}
            />}
          </Box>
        )}
      </Stack>
    </Box>
  );
  const renderMobile = (
    <Box>
      <ConversationNavMobile
        conversations={filteredConversations || []}
        onClickConversation={onClickNavItem}
        loading={loadingConversations}
        fetchingMoreConversations={loadingMoreConversations}
        currentConversationId={currentConversation?.id}
        handlePaginationChange={handlePaginationChange}
        totalConversations={totalConversations}
        updateConversation={getConversationDetail}
        updatePauseStatus={(conversationId: number) => {
          setConversations((prevConversations: any) =>
            prevConversations.map((conversation: any) => {
              if (conversation.id === conversationId) {
                return { ...conversation, isPaused: !conversation.isPaused };
              }
              return conversation;
            }),
          );
        }}
        handleNeedAttention={toggleAttention}
        handleSearch={(query: string) => {
          setPage(0);
          setSearchQuery(query);
        }}
        markAsResolved={markAsResolved}
        storeSelectedMode={selectedMode}
        unreadMessagesCount={unreadMessagesCount}
        onUpdateTags={updateTagsFromConversationsList}
        handleTagFilter={(tag: string) => {
          setPage(0);
          setSelectedTagFilter(tag);
        }}
        availableReferenceIds={availableReferenceIds}
      />
    </Box>
  );
  const renderDesktop = (
    <Card padding="none">
      <Box display="flex" flexDirection="row" height="100vh">
        {renderNav}
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
  );
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b5c293e6-5691-4fb2-95f8-27f6dbe75d88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'conversation-view.tsx:1148',message:'ConversationView render',data:{hasCurrentConversation:!!currentConversation,conversationId:currentConversation?.id,customerId:currentConversation?.customer?.id,messagesCount:chatMessages?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3,H4,H5'})}).catch(()=>{});
  // #endregion

  return (
    <ModeCustomerDataProvider
      initialCustomerId={currentConversation?.customer?.id}
    >
      <Box display="flex" flexDirection="column" gap="2" mb="2">
        <WhatsAppAlertsContainer />
      </Box>
      <Responsive mobileContent={renderMobile} desktopContent={renderDesktop} />
    </ModeCustomerDataProvider>
  );
}
