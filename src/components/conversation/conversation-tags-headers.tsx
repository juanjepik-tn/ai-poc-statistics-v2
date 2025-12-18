import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch, getTagTranslation, useStoreDetails } from '@/hooks';
import {
  Alert,
  Box,
  Button,
  Icon,
  Link,
  Modal,
  Spinner,
  Tag,
  Tooltip,
  useToast,
} from '@nimbus-ds/components';
import { CheckCircleIcon, ExclamationTriangleIcon, ShoppingCartIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import {
  ModeOption,
  useModeCustomer,
} from './providers/ModeCustomerDataProvider';
import { isPaymentTag } from '@/utils/messageUtils';
import { TagText } from './TagText';

//

// ----------------------------------------------------------------------
type ConversationViewProps = {
  currentConversation: any;
  onResolveAttention: () => void;
};
export default function ConversationTagsHeader({
  currentConversation,
  onResolveAttention,
}: ConversationViewProps) {
  const { t } = useTranslation('translations');
  const { request } = useFetch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prevState) => !prevState);
  const [selectedTag, setSelectedTag] = useState<any>();
  const [isResolvingAttention, setIsResolvingAttention] =
    useState<boolean>(false);
  const { addToast } = useToast();
  const { setSelectedModeCustomer, modeOptions } = useModeCustomer();
  const { storeDetails } = useStoreDetails();
  const isBrazilianStore = storeDetails?.country === 'BR';

  const filterPaymentTags = (tags: any[]) => {
    if (isBrazilianStore) {
      return tags;
    }
    return tags.filter((tag: any) => !isPaymentTag(tag?.name));
  };
  const handleResolveAttention = () => {
    setIsResolvingAttention(true);
    request<any[]>({
      url: API_ENDPOINTS.customer.resolveAllAttention(
        currentConversation.customer.id,
        currentConversation.id,
      ),
      method: 'PUT',
    })
      .then(({ content }: any) => {
        if (content?.state?.name) {
          setSelectedModeCustomer(
            modeOptions.find(
              (option: ModeOption) =>
                option.customerName === content?.state?.name,
            ),
          );
        }
        setIsResolvingAttention(false);
        currentConversation.customer.undoneHumanAttentionTags = [];
        onResolveAttention();
        addToast({
          type: 'success',
          text: t('conversations.tags.success-message'),
          duration: 4000,
          id: 'success-resolve-message',
        });
      })
      .catch((error) => {
        console.log(error);
        setIsResolvingAttention(false);
      });
  };

  const handleClickTag = (tag: any) => {
    setSelectedTag(tag);
    setOpen(true);
  };

  return (
    <>
      {currentConversation &&
        (currentConversation.customer?.undoneHumanAttentionTags?.length > 0 ||
          currentConversation.customer?.undoneTaggedTags?.length > 0) && (
          <Box
            backgroundColor="neutral-surface"
            borderRadius="1"
            borderColor="neutral-surfaceHighlight"
            display="flex"
            flexDirection="row"
            width="100%"
            height="46px"
            alignItems="center"
            gap="2"
            padding="4"
            justifyContent="space-between"
          >
            <Tooltip content={t('conversations.tags.view')}>
              <Box
                display="flex"
                justifyContent="flex-start"
                gap="2"
                cursor="pointer"
              >
                {currentConversation.customer?.undoneHumanAttentionTags
                  .filter(
                    (tag: any, index: any, self: any) =>
                      index === self.findIndex((t: any) => t.id === tag.id),
                  )
                  .map((tag: any, index: any) => (
                    <Tag
                      key={index}
                      appearance="warning"
                      onClick={() => handleClickTag(tag)}
                    >
                      <ExclamationTriangleIcon />
                      <TagText tagName={tag?.name} color="warning-textLow" fontSize="caption" />
                    </Tag>
                  ))}
                {filterPaymentTags(currentConversation.customer.undoneTaggedTags)
                  .filter(
                    (tag: any, index: any, self: any) =>
                      index === self.findIndex((t: any) => t.id === tag.id),
                  )
                  .sort((a: any, b: any) => a.id - b.id)
                  .map((tag: any, index: any) => (
                    <Tag
                      key={index}
                      appearance="neutral"
                      onClick={() => handleClickTag(tag)}
                    >
                      <Box display="flex" alignItems="center" gap="1">
                
                      {tag?.name === 'cart-sent' && <ShoppingCartIcon color="currentColor" />}
                        <TagText tagName={tag?.name} color="neutral-textLow" fontSize="caption" />
                      </Box>
                    
                    </Tag>
                  ))}
              </Box>
            </Tooltip>

            {currentConversation?.customer?.undoneHumanAttentionTags.length >
              0 && (
              <Box display="flex" justifyContent="flex-end" gap="2">
                <Link
                  onClick={handleResolveAttention}
                  appearance="primary"
                  textDecoration="none"
                >
                  {t('conversations.tags.resolve')}
                  {!isResolvingAttention && (
                    <Icon
                      color="currentColor"
                      source={<CheckCircleIcon />}
                      style={{ marginLeft: '8px' }}
                    />
                  )}
                  {isResolvingAttention && <Spinner size="small" />}
                </Link>
              </Box>
            )}
          </Box>
        )}

      <Modal open={open} onDismiss={handleOpen} padding="none">
        <Modal.Body padding="none">
          <Alert title={getTagTranslation(t, selectedTag?.name)}>
            {selectedTag?.summary
              ? t(`conversations.tags.${selectedTag.summary}`, {
                  defaultValue: selectedTag?.summary,
                })
              : selectedTag?.summary}
            <Box
              display="flex"
              justifyContent="flex-end"
              flexWrap="wrap"
              gap="2"
            >
              <Button onClick={handleOpen}>
                {t('conversations.tags.accept')}
              </Button>
            </Box>
          </Alert>
        </Modal.Body>
      </Modal>
    </>
  );
}
