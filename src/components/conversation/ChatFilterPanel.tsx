import React, { useRef, useState, useEffect } from 'react';
import { Box, Checkbox, Input, Select, Text } from '@nimbus-ds/components';
import { SearchIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BillingDTO } from '@/types/billingDTO';
import { type ChannelType } from '@/components/ChannelCard';
import { getReferenceIdTranslation } from '@/hooks';
import type { ChannelFilterValue } from '@/redux/slices/channels';

type ChatFilterPanelProps = {
  channelFilter: ChannelFilterValue;
  onChannelFilterChange: (value: ChannelFilterValue) => void;
  availableChannels: ChannelType[];

  selectedAtendimentoTags: string[];
  onAtendimentoTagsChange: (tags: string[]) => void;

  selectedCartFilter: string;
  onCartFilterChange: (value: string) => void;
};

const ATENDIMENTO_GROUPS: { groupKey: string; ids: string[] }[] = [
  {
    groupKey: 'orders',
    ids: [
      'get_order_status',
      'return_or_exchange_order',
      'customize_order',
      'wholesale_order',
      'modify_order_in_progress',
    ],
  },
  {
    groupKey: 'shipping',
    ids: [
      'delivery_coordination',
      'complementary_shipment_policies',
    ],
  },
  {
    groupKey: 'support',
    ids: [
      'requires_human_review',
      'human_request',
      'user_sent_image',
      'unknown',
    ],
  },
];

const ALL_ATENDIMENTO_IDS = ATENDIMENTO_GROUPS.flatMap((g) => g.ids);

const ChatFilterPanel: React.FC<ChatFilterPanelProps> = ({
  channelFilter,
  onChannelFilterChange,
  availableChannels,
  selectedAtendimentoTags,
  onAtendimentoTagsChange,
  selectedCartFilter,
  onCartFilterChange,
}) => {
  const { t } = useTranslation('translations');
  const billingData: BillingDTO = useSelector((state: any) => state?.billing?.billingData);
  const disabled = !billingData?.activeStatus;

  const [atendimentoOpen, setAtendimentoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAtendimentoOpen(false);
      }
    };
    if (atendimentoOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [atendimentoOpen]);

  const isAllSelected = selectedAtendimentoTags.length === ALL_ATENDIMENTO_IDS.length;
  const hasSelection = selectedAtendimentoTags.length > 0;

  const handleToggleAll = () => {
    onAtendimentoTagsChange(isAllSelected ? [] : [...ALL_ATENDIMENTO_IDS]);
  };

  const handleToggleTag = (id: string) => {
    if (selectedAtendimentoTags.includes(id)) {
      onAtendimentoTagsChange(selectedAtendimentoTags.filter((tag) => tag !== id));
    } else {
      onAtendimentoTagsChange([...selectedAtendimentoTags, id]);
    }
  };

  const getTriggerLabel = (): string => {
    if (!hasSelection) return t('conversations.filterPanel.selectSubjects', 'Selecionar assuntos');
    if (isAllSelected) return t('conversations.filterPanel.allSubjects', 'Todos os assuntos');
    if (selectedAtendimentoTags.length === 1) {
      return getReferenceIdTranslation(t, selectedAtendimentoTags[0]);
    }
    return t('conversations.filterPanel.nSelected', '{{count}} selecionados', {
      count: selectedAtendimentoTags.length,
    });
  };

  const filteredGroups = ATENDIMENTO_GROUPS.map((group) => ({
    ...group,
    ids: group.ids.filter((id) => {
      if (!searchTerm) return true;
      const label = getReferenceIdTranslation(t, id);
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    }),
  })).filter((group) => group.ids.length > 0);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="4"
      paddingTop="4"
    >
      {/* Canal */}
      {availableChannels.length > 1 && (
        <Box display="flex" flexDirection="column" gap="1">
          <Text fontSize="caption" fontWeight="medium" color="neutral-textLow">
            {t('conversations.filterPanel.channel', 'Canal')}
          </Text>
          <Select
            id="filter-channel"
            name="filter-channel"
            value={channelFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChannelFilterChange(e.target.value as ChannelFilterValue)
            }
            disabled={disabled}
          >
            <Select.Option value="all" label={t('conversations.filterPanel.allChannels', 'Todos os canais')} />
            {availableChannels.includes('whatsapp') && (
              <Select.Option value="whatsapp" label="WhatsApp" />
            )}
            {availableChannels.includes('instagram') && (
              <Select.Option value="instagram" label="Instagram" />
            )}
            {availableChannels.includes('facebook') && (
              <Select.Option value="facebook" label="Messenger" />
            )}
          </Select>
        </Box>
      )}

      {/* Atendimento — multi-select checkbox dropdown */}
      <Box display="flex" flexDirection="column" gap="1">
          <Text fontSize="caption" fontWeight="medium" color="neutral-textLow">
            {t('conversations.filterPanel.service', 'Atendimento humano')}
          </Text>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          {/* Trigger — real Nimbus Select for identical styling */}
          <Select
            id="filter-atendimento"
            name="filter-atendimento"
            appearance="neutral"
            value="__trigger__"
            disabled={disabled}
            onChange={() => {}}
          >
            <Select.Option value="__trigger__" label={getTriggerLabel()} />
          </Select>
          {/* Click overlay to open dropdown instead of native select */}
          {!disabled && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setAtendimentoOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setAtendimentoOpen((prev) => !prev);
                }
              }}
              style={{
                position: 'absolute',
                inset: 0,
                cursor: 'pointer',
                zIndex: 1,
              }}
            />
          )}

          {/* Dropdown panel */}
          {atendimentoOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                maxHeight: 340,
                overflowY: 'auto',
                border: '1px solid var(--color-neutral-interactive, #d4d4d8)',
                borderRadius: 8,
                backgroundColor: '#fff',
                zIndex: 900,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {/* Search */}
              <Box padding="2" paddingLeft="3" paddingRight="3">
                <Input
                  id="atendimento-search"
                  name="atendimento-search"
                  placeholder={t('conversations.filterPanel.searchSubject', 'Buscar assunto...')}
                  appendPosition="start"
                  append={<SearchIcon size={14} />}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </Box>

              {/* Separator */}
              <div style={{ height: 1, backgroundColor: '#e4e4e7' }} />

              {/* Select all */}
              {!searchTerm && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f4f4f5',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    name="atendimento-all"
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                    label={t('conversations.filterPanel.selectAll', 'Selecionar todos')}
                  />
                </div>
              )}

              {/* Grouped checkboxes */}
              {filteredGroups.map((group, groupIdx) => (
                <React.Fragment key={group.groupKey}>
                  {groupIdx > 0 && (
                    <div style={{ height: 1, backgroundColor: '#e4e4e7' }} />
                  )}
                  {group.ids.map((id) => (
                    <div
                      key={id}
                      style={{
                        padding: '6px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      <Checkbox
                        name={`atendimento-${id}`}
                        checked={selectedAtendimentoTags.includes(id)}
                        onChange={() => handleToggleTag(id)}
                        label={getReferenceIdTranslation(t, id)}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </Box>

      {/* Carrinhos */}
      <Box display="flex" flexDirection="column" gap="1">
        <Text fontSize="caption" fontWeight="medium" color="neutral-textLow">
          {t('conversations.filterPanel.carts', 'Carrinhos')}
        </Text>
        <Select
          id="filter-carrinhos"
          name="filter-carrinhos"
          appearance="neutral"
          value={selectedCartFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCartFilterChange(e.target.value)}
          disabled={disabled}
        >
          <Select.Option
            value="all"
            label={t('conversations.filterPanel.selectCart', 'Selecionar carrinho')}
          />
          <Select.Option
            value="cart-sent"
            label={t('conversations.filterPanel.cartSent', 'Enviados')}
          />
          <Select.Option
            value="cart-abandoned"
            label={t('conversations.filterPanel.cartAbandoned', 'Abandonados')}
          />
          <Select.Option value="" label={t('conversations.filterPanel.paidCarts', 'Pagos')} disabled />
          <Select.Option
            value="link-checkout"
            label={`  ${t('conversations.filterPanel.checkout', 'Checkout (loja)')}`}
          />
          <Select.Option
            value="one-click-payment"
            label={`  ${t('conversations.filterPanel.oneClick', 'WhatsApp (one-click)')}`}
          />
        </Select>
      </Box>

    </Box>
  );
};

export default ChatFilterPanel;
