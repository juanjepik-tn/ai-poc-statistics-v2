import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks

// types
// import { IChatParticipant } from 'src/types/chat';
// import { IConversationMessage } from 'src/types/conversation';
// components
import Modal from '@mui/material/Modal';
// import { paths } from 'src/routes/paths';
// import axios, { API_ENDPOINTS } from 'src/utils/axios';
// import { enqueueSnackbar } from 'notistack';
// import useHasRoles from 'src/hooks/use-has-roles';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';
import { IConversationMessage } from '@/types/conversation';
import {
  Box as BoxNimbus,
  IconButton as NimbusIconButton,
  Skeleton,
  Spinner,
  Text,
  Icon,
  Link,
  Popover,
} from '@nimbus-ds/components';
import { ClockIcon, ExclamationCircleIcon, ExternalLinkIcon, TiendanubeIcon, WhatsappIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, EllipsisIcon } from '@nimbus-ds/icons';
import { t } from 'i18next';
import Iconify from '../iconify';
import { AudioMessagePlayer } from './AudioMessagePlayer';
import FormattedTextWrapper from './providers/FormattedTextWrapper';
import { isMarketingMessage, isPaymentMessage, getSystemMessageContent } from '@/utils/messageUtils';
import FeedbackModal from './FeedbackModal';
import { toast } from 'sonner';
import { useIsMessageFailed } from './hooks/use-is-message-failed';
import { ChannelIcon } from '@/components';
import { ChannelType } from '@/types/conversation';

//

// ----------------------------------------------------------------------

type Props = {
  message: any;
  participants: any[];
  onOpenLightbox: (value: string) => void;
  store: string;
  channelType?: ChannelType;
};

export default function ConversationMessageItem({ message, store, channelType = 'whatsapp' }: Props) {
  const messageRef = useRef<HTMLDivElement>(null);

  const [me, setme] = useState(false);
  // fromApp will be true if the message was sent from the app, not from the website
  const { role, created_at, hasImage, fromApp, class: classMessage } = message;
  const [openModal, setOpenModal] = useState(false);

  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);
  const { request } = useFetch();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [localResponseScore, setLocalResponseScore] = useState<number | null | undefined>(message.response_score);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);

  
  
    useEffect(() => {
      setLocalResponseScore(message.response_score);
  }, [message.response_score]);
  
  const isMessageFailed = useIsMessageFailed(message);
  const downloadThumbnail = useCallback(
    async (message: IConversationMessage): Promise<void> => {
      if (message.mimetype?.startsWith('image/')) {
        request<any>({
          url: API_ENDPOINTS.message.downloadThumbnail(message.id),
          method: 'GET',
          responseType: 'blob',
        })
          .then(({ content }) => {
            const blobUrl = URL.createObjectURL(content);
            setThumbnail(blobUrl);
          })
          .catch((error) => {
            console.error('Error al descargar el archivo:', error);
            downloadFile(message);
            setThumbnail(null);
          });
      }
    },
    [message.id, message.mimetype],
  );

  const downloadFile = async (
    message: IConversationMessage,
  ): Promise<string | null> => {
    if (message.mimetype) {
      setIsDownloading(true);
      try {
        const { content } = await request<any>({
          url: API_ENDPOINTS.message.downloadFile(message.id),
          method: 'GET',
          responseType: 'blob',
        });

        const blobUrl = URL.createObjectURL(content);
        if (message.mimetype?.startsWith('audio/') && !audioUrl) {
          setAudioUrl(blobUrl);
        } else {
          setThumbnail(blobUrl);
        }
        setIsDownloading(false);
        return blobUrl;
      } catch (error) {        
        setIsDownloading(false);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!message.mimetype || message.id === 'temporal') return;
    // este método permite descargar el thumbnail de la imagen cuando se hace scroll y se ve la imagen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {            
            if (message.mimetype?.startsWith('image/')) {              
              downloadThumbnail(message);              
            } else if (message.mimetype?.startsWith('audio/')) {              
              downloadFile(message);              
            }
            observer.disconnect(); // Desconectar después de cargar
          }
        });
      },
      {
        root: null,
        rootMargin: '50px', // Cargar un poco antes de que sea visible
        threshold: 0.1
      }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [message.mimetype, message.id, downloadThumbnail]);


  useEffect(() => {
    setme(['assistant', 'store'].includes(role));
  }, [role]);

  const downloadBase64Data = (base64Data: any) => {
    const base64Prefix = base64Data.match(
      /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/,
    );
    let fixedBase64Data = base64Data;
    //  let mimeType = 'application/octet-stream';

    if (base64Prefix) {
      fixedBase64Data = base64Data.replace(base64Prefix[0], '');
    }
    const paddedBase64Data = fixedBase64Data.padEnd(
      fixedBase64Data.length + ((4 - (fixedBase64Data.length % 4)) % 4),
      '=',
    );

    const finalBase64Data = paddedBase64Data
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const binaryData = atob(finalBase64Data);
    const arrayBuffer = Uint8Array.from(binaryData, (char) =>
      char.charCodeAt(0),
    ).buffer;
    const blob = new Blob([arrayBuffer]);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const mime = message.mimetype.split('/');
    const MIMETYPE = mime.length > 1 ? mime[1] : mime[0];
    link.setAttribute('download', `VICI-${store}.${MIMETYPE}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadFiles = () => {
    if (message.mimetype) {
      downloadBase64Data(message.extra_data);
    } else {
      // const URL = API_ENDPOINTS.store.pdf(store, '1', '1');
      // axios
      //   .get(URL, { responseType: 'blob' })
      //   .then(({ data }) => {
      //     const url = window.URL.createObjectURL(new Blob([data]));
      //     const link = document.createElement('a');
      //     link.href = url;
      //     link.setAttribute('download', `VICI-${store}.pdf`); // or any other extension
      //     document.body.appendChild(link);
      //     link.click();
      //   })
      //   .catch((error) => {
      //     enqueueSnackbar('Se ha producido un error al descargar el Menú', {
      //       variant: 'error',
      //     });
      //   });
    }
  };

  // Feedback handlers
  const handleLike = async () => {
    setLikeLoading(true);
    try {
      await request<any>({
        url: API_ENDPOINTS.message.feedback(message.id),
        method: 'PUT',
        data: {
          score: 10,
          content: ''
        }
      });
      setLocalResponseScore(10); 
      toast.success(t('conversations.feedback.success.positive'));
    } catch (error) {
      toast.error(t('conversations.feedback.error'));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = () => {
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (feedback: string) => {
    setFeedbackLoading(true);
    try {
      await request<any>({
        url: API_ENDPOINTS.message.feedback(message.id),
        method: 'PUT',
        data: {
          score: 0,
          content: feedback
        }
      });
      setLocalResponseScore(0);
      setFeedbackModalOpen(false);
      toast.success(t('conversations.feedback.success.negative'));
    } catch (error) {
      toast.error(t('conversations.feedback.error'));
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      toast.success(t('conversations.message-copied') || 'Mensaje copiado');
    }
    setMoreOptionsOpen(false);
  };

  const renderPreview = () => {
    if (message.mimetype === 'pdf' || message.mimetype === 'application/pdf') {
      return renderIcon();
    }
    if (message.mimetype) {
      return (
        <Box
          component="img"
          alt="attachment"
          src={message.extra_data}
          // onClick={() => onOpenLightbox(content)}
          sx={{
            objectFit: 'contain',
            minHeight: 220,
            borderRadius: 1.5,
            width: 400,
            maxheight: 500,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        />
      );
    }
    return null;
  };

  const renderIcon = () => {
    const isPdf =
      !message.extra_data ||
      message.mimetype === 'pdf' ||
      message.mimetype === 'application/pdf';

    return (
      <>
        <Iconify
          width={48}
          icon={
            isPdf
              ? 'vscode-icons:file-type-pdf2'
              : 'material-symbols:image-sharp'
          }
        />

        <Typography variant="caption" component="span">
          {isPdf ? 'Archivo PDF' : 'Archivo'}
        </Typography>
      </>
    );
  };
  const renderAudio = () => {    
    return (
     <AudioMessagePlayer 
        audioUrl={audioUrl}
        message={message}
      />
    );
  };
  const handleOpenModal = async () => {
    setOpenModal(true);
    if (!downloadedFile) {
      const fileBlob = await downloadFile(message);
      if (fileBlob) {
        setDownloadedFile(fileBlob as string);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const imageModal = (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          bgcolor: 'transparent',
          boxShadow: 24,
          p: 2,
          marginTop: 4,
        }}
      >
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'common.white',
            backgroundColor: 'grey.900',
            '&:hover': {
              backgroundColor: 'grey.800',
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={24} height={24} />
        </IconButton>
        {isDownloading ? (
          <Spinner size="large" />
        ) : (
          <img
            src={downloadedFile || ''}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              display: 'block',
            }}
            alt="Vista ampliada de la imagen"
          />
        )}
      </Box>
    </Modal>
  );

  // const renderDocument = (
  //   <>
  //     <button
  //       type="button"
  //       style={{
  //         background: 'none',
  //         border: 'none',
  //         padding: 0,
  //         cursor: 'pointer',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //       onClick={() => handleOpenDocument(message.extra_data)}
  //       onKeyDown={(event) => {
  //         if (event.key === 'Enter') {
  //           handleOpenDocument(message.extra_data);
  //         }
  //       }}
  //     >
  //       <Iconify
  //         icon="mdi-file-pdf-box" // Asume que este es el identificador de un icono de PDF en Iconify
  //         width={50}
  //         height={50}
  //         style={{
  //           color: 'red', // Puedes personalizar el color aquí si es necesario
  //         }}
  //       />
  //       <span style={{ marginLeft: '10px' }}>Open PDF</span>
  //     </button>
  //   </>
  // );

  // function handleOpenDocument(base64Data: any) {
  //   const newWindow = window.open();
  //   newWindow?.document.write(`
  //     <iframe src="data:application/pdf;base64,${base64Data}" style="width:100%; height:100%;" frameborder="0"></iframe>
  //   `);
  // }
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  // useEffect(() => {
  //   if (imageDimensions.width > 0 && imageDimensions.height > 0) {
  //     renderImage();
  //   }
  // }, [imageDimensions])
  const renderImage = () => {
    let renderDimensions = { width: '200px', height: '200px' };
    if (imageDimensions.width === imageDimensions.height) {
      // Render para imágenes cuadradas
      renderDimensions = { width: '200px', height: '200px' };
    } else if (imageDimensions.width > imageDimensions.height) {
      // Render para imágenes anchas
      renderDimensions = { width: '200px', height: '120px' };
    } else {
      // Render para imágenes altas
      renderDimensions = { width: '160px', height: '200px' };
    }
    return (
      <button
        type="button" // Explicitamente declara el tipo de botón como "button"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          position: 'relative', // Necesario para posicionar el spinner sobre la imagen
        }}
        onClick={() => handleOpenModal()}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleOpenModal();
          }
        }}
      >
        {thumbnail ? (
          <>
            <img
              key={thumbnail + new Date().getTime()}
              width={renderDimensions.width}
              style={{
                maxHeight: renderDimensions.height,
                backgroundColor: 'transparent', // de esta manera no se ve el fondo blanco del contenedor
                width: '100%', // La imagen ocupará todo el ancho del contenedor
                objectFit: 'contain', // Mantiene el aspecto de la imagen sin distorsionarla
              }}
              src={thumbnail || ''}
              alt="Imagen del mensaje"
            />
            <BoxNimbus display="flex" height="100%" width="100%" marginTop="2">
              {message.content && message.content != '[Image Sent]'&& (
                <Text>{message.content}</Text>
              )}
            </BoxNimbus>
          </>
        ) : (
          <Skeleton
            height={renderDimensions.height}
            width={renderDimensions.width}
          >
            <BoxNimbus
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
            >
              <Iconify icon="ic:baseline-photo" width={32} height={32} />
            </BoxNimbus>
          </Skeleton>
        )}
      </button>
    );
  };
  const cart = useMemo(() => {
    return message.decodedContent?.cart;
  }, [message.decodedContent]);
  const renderCart = () => {
    try {

      if (!cart || !cart.items) {
        return null;
      }

      return (
      
            <BoxNimbus display="flex" flexDirection="column" gap="2">  
            <Text>{t('conversations.cart-sent-message')}</Text>
              {cart.items.map((item: any, index: number) => (
                <BoxNimbus 
                  key={item.id || index}
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  padding="2"
                >
                  <BoxNimbus display="flex" flexDirection="column" gap="1">
                    <BoxNimbus as="ul" paddingLeft="2" style={{ margin: 0 }}>
                      <li>
                        <Text fontSize="base" lineClamp={2}>
                          {item.quantity}x {item.name} -  {cart.currency} {item.price}
                        </Text>
                      </li>
                    </BoxNimbus>
                  </BoxNimbus>
                </BoxNimbus>
              ))}
              
              <BoxNimbus 
                display="flex" 
                flexDirection="column" 
                gap="1"
              >
                
                {cart.shipping && (
                  <BoxNimbus display="flex" justifyContent="space-between">
                    <Text fontSize="base">Envío:</Text>
                    <Text fontSize="base" fontWeight="medium">
                      {cart.currency} {cart.shipping}
                    </Text>
                  </BoxNimbus>
                )}
                
                {cart.discount > 0 && (
                  <BoxNimbus display="flex" justifyContent="space-between">
                    <Text fontSize="base">Descuento:</Text>
                    <Text fontSize="base" fontWeight="medium" color="success-text">
                      -{cart.currency} {cart.discount}
                    </Text>
                  </BoxNimbus>
                )}
                
                <BoxNimbus 
                  display="flex" 
                  justifyContent="space-between"
                >
                  <Text fontSize="base" color="primary-textHigh">
                   Total: {cart.currency} {cart.total}
                  </Text>
                </BoxNimbus>
                {cart?.url && (
                <BoxNimbus paddingTop="2" display="flex" justifyContent="space-between">
                  <Link
                    as="a"
                    href={cart.url}
                    target="_blank"
                    appearance="primary"
                    textDecoration="none"
                  >
                    {t('conversations.view-cart')}
                    <Icon source={<ExternalLinkIcon />} color="currentColor" />
                  </Link>
                </BoxNimbus>
                )}
              </BoxNimbus>
            </BoxNimbus>
         
      );
    } catch (error) {
      console.error('Error parsing cart data:', error);
      return null;
    }
  };

  
  const renderMessageContent = useMemo(() => {
    if (message.mimetype?.startsWith('application/')) {
      return renderPDF;
    }

    if (message.mimetype?.startsWith('audio/')) {
      return renderAudio();
    }

    if (message.mimetype?.startsWith('image/')) {
      const img = new Image();
      img.src = downloadedFile || '';
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      return renderImage();
    }

    if (message.decodedContent && typeof message.decodedContent === 'string') {
      try {
        const parsedContent = JSON.parse(message.decodedContent);
        if (parsedContent.cart) {
          return renderCart();
        }
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }

    if (isPaymentMessage(classMessage)) {
     return renderCart();
    }
    if (isMarketingMessage(classMessage)) {
      return (
        <Text>{getSystemMessageContent(classMessage, t)}</Text>
      );
    }

    return (
      <FormattedTextWrapper text={message.content}>
        {(formattedContent: any) => (
          <>
            {classMessage === 'message-customer-view-once' ? (
              <BoxNimbus display="flex" flexDirection="row" alignItems="center" gap="1">
                <ClockIcon />
                <div dangerouslySetInnerHTML={{ __html: t('conversations.view-once-message') }} />
              </BoxNimbus>
    
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
            )}
          </>
        )}
      </FormattedTextWrapper>
    );
  }, [thumbnail, audioUrl, cart]);
  const renderAuthor = (
    <BoxNimbus
      justifyContent="flex-end"
      textAlign="right"
      pr="6"
      pb="1"
      display="flex"
      alignItems="center"
      gap="2"
    >
      <Text as="span" fontSize="caption" style={{ color: '#5d5d5d', fontWeight: 500 }}>
        {me &&
          (classMessage === 'message-bot' || classMessage === 'message-api' && !isPaymentMessage(classMessage)) &&
          t(`conversations.role.${role}`)}
        {me &&
          (isPaymentMessage(classMessage) || classMessage === 'message-order-status') &&
          t('conversations.role.sales-assistant')}
        {me &&
          classMessage.includes('store') &&
          fromApp &&
          t(`conversations.source.whatsapp`)}
        {me &&
          classMessage.includes('store') &&
          !fromApp &&
          t(`conversations.source.tiendanube`)}
      </Text>
      {(classMessage === 'message-bot' || classMessage === 'message-api' || isPaymentMessage(classMessage) || classMessage === 'message-order-status') && (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(72deg, rgba(0, 80, 195, 0.03) 16%, rgba(71, 54, 180, 0.03) 42%, rgba(216, 68, 110, 0.03) 83%)',
        }}>
          <img src="/imgs/ia-icon.svg" alt="ia-icon" width={16} height={16} />
        </div>
      )}
      {classMessage.includes('store') &&
        (fromApp ? (
          <ChannelIcon channel={channelType} size="small" />
        ) : (
          <TiendanubeIcon width={18} />
        ))}
    </BoxNimbus>
  );
  const renderTimestamp = new Date(created_at).getTime() < new Date().setHours(0, 0, 0, 0)
    ? new Date(created_at).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : new Date(created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

  // Actions row with icons + timestamp (outside the bubble)
  // Figma specs: gap 8px between bubble and row, icons 16px, gap between icons ~4px
  // User messages: timestamp left-aligned, no action icons
  // Bot messages: action icons + timestamp right-aligned
  const renderActionsRow = (
    <BoxNimbus
      display="flex"
      justifyContent={me ? 'flex-end' : 'flex-start'}
      alignItems="center"
      gap="2"
      marginTop="2"
      marginRight={me ? '6' : 'none'}
      marginLeft={me ? 'none' : '0'}
      width="100%"
    >
      {/* Action icons for bot messages - order: 👍 👎 📋 ⋮ timestamp */}
      {me && message.role === 'assistant' && message.run_id && !isMessageFailed && (
        <BoxNimbus display="flex" alignItems="center" gap="2">
          <NimbusIconButton
            source={likeLoading ? <Spinner size="small" /> : <ThumbsUpIcon size={16} />}
            backgroundColor="transparent"
            borderColor="transparent"
            onClick={handleLike}
            disabled={likeLoading || feedbackLoading}
            size="small"
          />
          <NimbusIconButton
            source={<ThumbsDownIcon size={16} />}
            backgroundColor="transparent"
            borderColor="transparent"
            onClick={handleDislike}
            disabled={likeLoading || feedbackLoading}
            size="small"
          />
          <NimbusIconButton
            source={<CopyIcon size={16} />}
            backgroundColor="transparent"
            borderColor="transparent"
            onClick={handleCopyMessage}
            size="small"
          />
          <Popover
            content={
              <BoxNimbus padding="2" cursor="pointer" onClick={handleCopyMessage}>
                <Text fontSize="base">{t('conversations.copy-code') || 'Copiar código'}</Text>
              </BoxNimbus>
            }
            visible={moreOptionsOpen}
            onVisibility={setMoreOptionsOpen}
            position="top-end"
          >
            <NimbusIconButton
              source={<EllipsisIcon size={16} />}
              backgroundColor="transparent"
              borderColor="transparent"
              onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
              size="small"
            />
          </Popover>
        </BoxNimbus>
      )}
      
      {/* Timestamp */}
      <Text fontSize="caption" color="neutral-textDisabled" style={{ color: '#777' }}>
        {renderTimestamp}
      </Text>
    </BoxNimbus>
  );

  const renderPDF = (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={handleDownloadFiles}
        sx={{ cursor: 'pointer' }}
      >
        {renderPreview()}
      </Stack>
    </>
  );
  const getFeedbackStatus = () => {
    if (localResponseScore === null || localResponseScore === undefined) {
      return null; // No feedback dado
    }
    if (localResponseScore === 10) {
      return true; // Feedback positivo
    }
    if (localResponseScore === 0) {
      return false; // Feedback negativo
    }
    return null;
  };

  const renderFeedbackButtons = () => {
    // don't show feedback buttons for failed messages.
    // otherwise people will compain about that instead of giving valuable feedback
    if (isMessageFailed) {
      return null;
    }
    
    if (role === 'assistant' && message.run_id) {
      const feedbackStatus = getFeedbackStatus();
      
      if (feedbackStatus !== null) {
        return (
          <BoxNimbus 
            display="flex" 
            gap="0-5" 
            flexDirection="column" 
            marginTop="1"
            alignItems="flex-end"
            paddingX="6"
          >
            <BoxNimbus display="flex" justifyContent="flex-end" gap="0-5" alignItems="center">
              <Icon 
                source={feedbackStatus === false ? <ThumbsDownIcon size={12} /> : <ThumbsUpIcon size={12} />}
                color={feedbackStatus === false ? "danger-interactive" : "success-interactive"}
              />
              <Text 
                as="span" 
                fontSize="caption" 
                color={feedbackStatus === false ? "danger-interactive" : "success-interactive"}
              >
                {feedbackStatus === false ? t('conversations.feedback.negative') : t('conversations.feedback.positive')}
              </Text>
            </BoxNimbus>
          </BoxNimbus>
        );
      }

      return (
        <BoxNimbus 
          display="flex" 
          gap="0-5" 
          flexDirection="column" 
          marginTop="1"
          alignItems="flex-end"
          paddingX="6"
        >
          <BoxNimbus display="flex" justifyContent="flex-end">
            <Text as="span" color="neutral-textHigh" fontSize="caption">
              {t('conversations.feedback.question')}
            </Text>
          </BoxNimbus>
          <BoxNimbus display="flex" gap="0-5" justifyContent="flex-end">
            <NimbusIconButton
              source={likeLoading ? <Spinner size="small" color="success-interactive" /> : <ThumbsUpIcon size={16} />}
              backgroundColor="transparent"
              borderColor="transparent"
              onClick={handleLike}
              disabled={likeLoading || feedbackLoading}
            />
            <NimbusIconButton
              source={<ThumbsDownIcon size={16} />}
              backgroundColor="transparent"
              borderColor="transparent"
              onClick={handleDislike}
              disabled={likeLoading || feedbackLoading}
            />
          </BoxNimbus>
        </BoxNimbus>
      );
    }
    return null;
  };

  const renderBody = (
    <>
      <BoxNimbus
        paddingX={hasImage ? 'none' : '4'}
        paddingY={hasImage ? 'none' : '2-5'}
        minWidth="40px"
        backgroundColor={(isMarketingMessage(classMessage)) ? 'neutral-surfaceDisabled' : 'primary-surface'}
        marginRight="6"
        style={{ borderRadius: '16px' }}
      >
        <div style={{ whiteSpace: 'pre-wrap', fontStyle: (isMarketingMessage(classMessage)) ? 'italic' : 'normal' }}>
          <Text color="neutral-textHigh" style={{ wordBreak: 'break-word', fontSize: '14px', lineHeight: '20px' }}>
            {renderMessageContent}
          </Text>
        </div>
      </BoxNimbus>
    </>
  );

  return (
    <>
      {openModal && imageModal}
      <FeedbackModal
        open={feedbackModalOpen}
        toggleOpen={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        loading={feedbackLoading}
        question={message.content}
      />
      {role !== 'system' && (
        <Stack
          ref={messageRef}
          direction="row"
          justifyContent={me ? 'flex-end' : 'unset'}
          sx={{ mb: 0.5 }}
        >
          <BoxNimbus
            alignItems="flex-end"
            flexDirection="column"
            maxWidth="80%"
          >
            {me && renderAuthor}
            <BoxNimbus alignItems="center">
              {renderBody}
            </BoxNimbus>
            {renderActionsRow}
            {message.role === 'assistant' && isMessageFailed && (
              <BoxNimbus display="flex" alignItems="center" justifyContent="flex-end" gap="1" marginTop="1" marginRight="6">
                <Icon color="danger-interactive" source={< ExclamationCircleIcon size="small" />} />
                <Text color="danger-textLow" fontSize="caption">{t('conversations.message-not-delivered')}</Text>
              </BoxNimbus>
            )}
          </BoxNimbus>
        </Stack>
      )}
    </>
  );
}
