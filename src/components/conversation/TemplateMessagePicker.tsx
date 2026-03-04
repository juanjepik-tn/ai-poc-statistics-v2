import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@nimbus-ds/components';
import { Box } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import Iconify from '../iconify/iconify';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status: string;
  language: string;
  category: string;
  components: Array<{
    type: string;
    text?: string;
  }>;
}

export interface TemplateMessagePickerProps {
  channelId: string;
  conversationId?: string;
  onSendTemplate: (templateId: string, templateName: string) => void;
  onClose?: () => void;
}

const getCategoryDot = (category: string): string => {
  switch (category?.toUpperCase()) {
    case 'MARKETING': return '#16a34a';
    case 'UTILITY': return '#d97706';
    case 'AUTHENTICATION': return '#dc2626';
    default: return '#9a9a9a';
  }
};

const getBodyPreview = (template: WhatsAppTemplate): string => {
  const body = template.components?.find((c) => c.type === 'BODY');
  return body?.text ?? '';
};

const formatTemplateName = (name: string): string =>
  name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const TemplateMessagePicker: React.FC<TemplateMessagePickerProps> = ({
  channelId,
  onSendTemplate,
}) => {
  const { t } = useTranslation('translations');
  const { request } = useFetch();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await request<WhatsAppTemplate[] | { data: WhatsAppTemplate[] }>({
          url: API_ENDPOINTS.whatsappBusiness.templates(channelId),
          method: 'GET',
        });
        const data = response?.content;
        const list = Array.isArray(data) ? data : (data as { data?: WhatsAppTemplate[] })?.data ?? [];
        setTemplates(list.filter((tpl) => tpl?.status?.toLowerCase() === 'approved'));
      } catch {
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [channelId, request]);

  const filtered = useMemo(() => {
    if (!search.trim()) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (tpl) =>
        tpl.name.toLowerCase().includes(q) ||
        getBodyPreview(tpl).toLowerCase().includes(q),
    );
  }, [templates, search]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: '40px' }}>
        <Spinner size="medium" />
      </Box>
    );
  }

  if (templates.length === 0) {
    return (
      <Box sx={{ py: '32px', px: '16px', textAlign: 'center' }}>
        <Iconify icon="mdi:file-document-remove-outline" width={36} color="#d1d1d1" />
        <Box sx={{ mt: '8px' }}>
          <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: '#9a9a9a' }}>
            {t('templatePicker.empty', 'Nenhum template aprovado disponível')}
          </span>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '360px' }}>
      {/* Search */}
      <Box sx={{ px: '12px', py: '10px', borderBottom: '1px solid #f0f0f0' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f6f6f6',
            borderRadius: '6px',
            px: '10px',
            py: '6px',
            transition: 'all 0.15s',
            '&:focus-within': { backgroundColor: '#fff', boxShadow: '0 0 0 2px #0059d520' },
          }}
        >
          <Iconify icon="mdi:magnify" width={16} color="#9a9a9a" />
          <InputBase
            placeholder={t('templatePicker.search', 'Buscar template...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              fontFamily: "'Geist', sans-serif",
              fontSize: 13,
              '& input': { p: 0 },
              '& input::placeholder': { color: '#9a9a9a', opacity: 1 },
            }}
          />
          {search && (
            <Box
              onClick={() => setSearch('')}
              sx={{ cursor: 'pointer', display: 'flex', lineHeight: 0 }}
            >
              <Iconify icon="mdi:close" width={14} color="#b5b5b5" />
            </Box>
          )}
        </Box>
      </Box>

      {/* List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '3px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#e0e0e0', borderRadius: '3px' },
        }}
      >
        {filtered.length === 0 ? (
          <Box sx={{ py: '28px', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: '#9a9a9a' }}>
              {t('templatePicker.no-results', 'Nenhum template encontrado')}
            </span>
          </Box>
        ) : (
          filtered.map((template) => {
            const body = getBodyPreview(template);
            const dotColor = getCategoryDot(template.category);

            return (
              <Box
                key={template.id}
                onClick={() => onSendTemplate(template.id, template.name)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  px: '14px',
                  py: '12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f5f5f5',
                  transition: 'background-color 0.1s',
                  '&:hover': { backgroundColor: '#f6f8ff' },
                  '&:active': { backgroundColor: '#eef2ff' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {/* Template icon */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: '#f0f4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon="mdi:file-document-outline" width={18} color="#0059d5" />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                    <span style={{
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      lineHeight: '18px',
                      color: '#0a0a0a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {formatTemplateName(template.name)}
                    </span>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: dotColor,
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                  {body && (
                    <span style={{
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: 12,
                      lineHeight: '16px',
                      color: '#8a8a8a',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {body}
                    </span>
                  )}
                </Box>

                {/* Send arrow */}
                <Iconify
                  icon="mdi:chevron-right"
                  width={18}
                  color="#c0c0c0"
                  style={{ flexShrink: 0 }}
                />
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default TemplateMessagePicker;
