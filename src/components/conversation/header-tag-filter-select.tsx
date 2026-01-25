import React, { useEffect, useState } from 'react';
import { Select, Box as BoxNimbus, Box } from '@nimbus-ds/components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BillingDTO } from '@/types/billingDTO';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import useFetch from '@/hooks/useFetch/useFetch';
import { useStoreDetails, getTagTranslation } from '@/hooks';
import { getReferenceIdTranslation } from '@/hooks';
import { conversationTags } from '@/constants/conversationTags';

type TagFilterSelectProps = {
  selectedTagFilter: string;
  handleTagFilterChange: (value: string) => void;
  availableReferenceIds: string[];
};

const TagFilterSelect: React.FC<TagFilterSelectProps> = ({ 
  selectedTagFilter, 
  handleTagFilterChange,
  availableReferenceIds 
}) => {
  const { t } = useTranslation('translations');
  const billingData: BillingDTO = useSelector((state: any) => state.billing?.billingData);
  const [...restTags] = conversationTags;
  const { request } = useFetch();
  const paymentTags = ['link-checkout', 'one-click-payment'];
  const [viewCartsEnabled, setViewCartsEnabled] = useState<boolean>(false);
  const { storeDetails} = useStoreDetails();

  const isBrazilianStore = storeDetails?.country === 'BR';

  const allOption = availableReferenceIds
    .filter((refId) => refId === 'all')
    .map((refId) => ({ refId, label: getReferenceIdTranslation(t, refId) }));
  
  const otherReferenceIds = availableReferenceIds
    .filter((refId) => refId !== 'all')
    .map((refId) => ({ refId, label: getReferenceIdTranslation(t, refId) }))
    .sort((a, b) => a.label.localeCompare(b.label));
  
  const sortedReferenceIds = [...allOption, ...otherReferenceIds];

  const TAG = 'nuvem-chat-view-carts-enabled';
  const sortTagsByLabel = (tags: string[]) => 
    tags
      .map((tag) => ({ tag, label: getTagTranslation(t, tag)  }))
      .sort((a, b) => a.label.localeCompare(b.label));

  const sortedPaymentTags = sortTagsByLabel(paymentTags.filter(tag => restTags.includes(tag)));
  useEffect(() => {
    request<any>({
      url: API_ENDPOINTS.store.hasTag(TAG),
      method: 'GET',
    })
      .then(({ content }: any) => {
        setViewCartsEnabled(content?.has_tag || false);
      })
      .catch(() => {
        setViewCartsEnabled(false);
      });
  }, [request]);
  return (
    <BoxNimbus>
      <Select
        appearance="neutral"
        id="Id"
        name="Name"
        value={selectedTagFilter}
        disabled={!billingData?.activeStatus}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleTagFilterChange(event.target.value)}
      >
        
        {sortedReferenceIds.map(({ refId, label }) => (
          <Select.Option key={refId} label={label} value={refId} />
        ))}
        {viewCartsEnabled && <Select.Option key='conversations.tags.cart-sent' label={t('conversations.tags.cart-sent')} value='cart-sent' />}

        {viewCartsEnabled && isBrazilianStore && (
          <>
           {/* When we sunset the tag, remove this and allow sortedOtherTags without excluding cart-sent */}
        
          <Select.Option 
            key="payment-location-header" 
            label={t('conversations.tags.paymentLocation')} 
            value="" 
            disabled 
          />
          {sortedPaymentTags.map(({ tag, label }) => (

            <Box key={tag} display="flex" flexDirection="row" gap="2" alignItems="center">

              <Select.Option label={label} value={tag} />
                
            </Box>
            ))}
          </>
        )}

          
      </Select>
    </BoxNimbus>
  );
};

export default TagFilterSelect;