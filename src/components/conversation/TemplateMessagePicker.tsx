import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Text,
  Spinner,
  Tag,
} from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';

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

const getCategoryTagAppearance = (category: string): 'success' | 'warning' | 'danger' | 'neutral' => {
  switch (category?.toUpperCase()) {
    case 'MARKETING':
      return 'success';
    case 'UTILITY':
      return 'warning';
    case 'AUTHENTICATION':
      return 'danger';
    default:
      return 'neutral';
  }
};

const getBodyPreview = (template: WhatsAppTemplate): string => {
  const bodyComponent = template.components?.find((c) => c.type === 'BODY');
  if (!bodyComponent?.text) return '';
  const text = bodyComponent.text;
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
};

const TemplateMessagePicker: React.FC<TemplateMessagePickerProps> = ({
  channelId,
  onSendTemplate,
  onClose,
}) => {
  const { t } = useTranslation('translations');
  const { request } = useFetch();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);

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
        const approved = list.filter(
          (tpl) => tpl?.status?.toLowerCase() === 'approved'
        );
        setTemplates(approved);
      } catch {
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [channelId, request]);

  const handleSend = (template: WhatsAppTemplate) => {
    onSendTemplate(template.id, template.name);
    onClose?.();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="6" minHeight="120px">
        <Spinner size="medium" />
      </Box>
    );
  }

  if (templates.length === 0) {
    return (
      <Box padding="6">
        <Text color="neutral-textLow" textAlign="center">
          {t('templatePicker.empty', 'Nenhum template aprovado disponível')}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2"
      maxHeight="320px"
      overflowY="auto"
      padding="2"
    >
      {templates.map((template) => (
        <Box
          key={template.id}
          padding="3"
          borderColor="neutral-interactive"
          borderRadius="2"
          borderStyle="solid"
          borderWidth="1"
          display="flex"
          flexDirection="column"
          gap="2"
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="2">
            <Text fontWeight="bold" fontSize="base">
              {template.name}
            </Text>
            <Tag appearance={getCategoryTagAppearance(template.category)}>
              {template.category}
            </Tag>
          </Box>
          {getBodyPreview(template) && (
            <Text fontSize="caption" color="neutral-textLow" lineClamp={2}>
              {getBodyPreview(template)}
            </Text>
          )}
          <Box display="flex" justifyContent="flex-end" marginTop="1">
            <Button
              appearance="primary"
              size="small"
              onClick={() => handleSend(template)}
            >
              {t('templatePicker.send', 'Enviar')}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TemplateMessagePicker;
