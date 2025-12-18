import {
  Box,
  Card,
  IconButton,
  Tag,
  Title,
  Tooltip
} from '@nimbus-ds/components';
import { QrCodeIcon, TrashIcon } from '@nimbus-ds/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
  
type ActualStatus = {
  id: number;
  name: string;
};

// Define el tipo para instance
export type Instance = {
  id: string; // o el tipo que corresponda
  username: string;
  actualStatus: ActualStatus;
  basePath: string;
  channelName: string;
  country: string;
  hasError?: boolean;
};


  type InstanceCardProps = {
    instance: Instance;
    onDelete: () => void;
    onGenerate?: () => void;
    hasError?: boolean;
  }
  const InstanceCard: React.FC<InstanceCardProps> = ({instance, onDelete, onGenerate, hasError = false}) => {
    
    const { t } = useTranslation('translations');
    const {username, actualStatus} = instance;

    return (
        <Card key={instance.id}>
        <Card.Header>
        <Box display='flex' flexDirection='column' gap='2'>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >            
            <Title as="h5">{username}</Title>                     
            <Box display='flex' flexDirection='row' gap='1'>            
              {instance.channelName !== 'WhatsAppBusiness' && actualStatus?.name !== 'Connected' && onGenerate && (
                <Tooltip content={t('instances.generate-qr')}>
                  <IconButton onClick={onGenerate} source={<QrCodeIcon size='small'/>} size='2rem'/>
                </Tooltip>
              )}
            <Tooltip content={t('common.delete')} >
              <IconButton onClick={onDelete} source={<TrashIcon size='small'/>}  size='2rem'/>
            </Tooltip>           
            {/* <Tooltip content='Plantillas de Mensajes'>
              <IconButton onClick={() => { navigate('/template-messages'); }} source={<ListIcon size='small'/>} size='2rem'/>
            </Tooltip> */}
            </Box>
          </Box>
          <Box display='flex' flexDirection='row' gap='1'>
            {hasError && <Tag appearance='danger'>{t('common.error')}</Tag>}
            <Tag appearance={actualStatus?.name?.toLowerCase() === 'connected' ? 'success' : 'danger'}>{t(`instances.${actualStatus?.name?.toLowerCase()}`)}</Tag>
            {instance.channelName === 'WhatsAppBusiness' && <Tag appearance='primary'>WhatsApp Business</Tag>}
          </Box>
          </Box>
        </Card.Header>             
      </Card>
    );
  };
  export default InstanceCard;
  