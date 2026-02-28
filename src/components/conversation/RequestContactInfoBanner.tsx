import React from 'react';
import { Box, Button, Icon, Spinner, Text } from '@nimbus-ds/components';
import { CheckCircleIcon, UserIcon } from '@nimbus-ds/icons';
import { useBsuidMode, ContactInfoRequestState } from './providers/BsuidModeProvider';

const RequestContactInfoBanner: React.FC = () => {
  const { isBsuidMode, currentBsuidConversation, contactInfoRequestState, requestContactInfo } = useBsuidMode();

  if (!isBsuidMode || !currentBsuidConversation) return null;

  const customer = currentBsuidConversation.customer;
  if (customer.identifierType === 'phone') return null;

  const state: ContactInfoRequestState = contactInfoRequestState[currentBsuidConversation.id] || 'idle';

  if (state === 'received') {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="3"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
          borderTop: '1px solid rgba(16, 185, 129, 0.3)',
        }}
      >
        <Icon source={<CheckCircleIcon size={20} />} color="success-interactive" />
        <Box display="flex" flexDirection="column" gap="1" flexGrow="1">
          <Text fontWeight="bold" fontSize="caption" color="success-textHigh">
            Dual-key ativo
          </Text>
          <Box display="flex" gap="2" alignItems="center" flexWrap="wrap">
            <Box display="flex" gap="1" alignItems="center">
              <span style={{ fontSize: 10, fontWeight: 600, color: '#059669', backgroundColor: 'rgba(16,185,129,0.12)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)' }}>
                PHONE
              </span>
              <Text fontSize="caption" color="neutral-textHigh">+54 11 5555-9876</Text>
            </Box>
            <Box display="flex" gap="1" alignItems="center">
              <span style={{ fontSize: 10, fontWeight: 600, color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(99,102,241,0.25)' }}>
                BSUID
              </span>
              <Text fontSize="caption" color="neutral-textLow">{customer.bsuid ? `${customer.bsuid.substring(0, 8)}...` : ''}</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (state === 'sent') {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        padding="3"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(37, 99, 235, 0.06) 100%)',
          borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <Spinner size="small" />
        <Box display="flex" flexDirection="column" gap="0-5">
          <Text fontWeight="bold" fontSize="caption" color="primary-textHigh">
            Solicitação enviada
          </Text>
          <Text fontSize="caption" color="neutral-textLow">
            Esperando que o contato compartilhe seu número...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      padding="3"
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(217, 119, 6, 0.06) 100%)',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="36px"
        height="36px"
        borderRadius="full"
        style={{ background: 'rgba(245, 158, 11, 0.15)' }}
        flexShrink="0"
      >
        <Icon source={<UserIcon size={18} />} color="warning-interactive" />
      </Box>
      <Box display="flex" flexDirection="column" gap="0-5" flexGrow="1">
        <Text fontWeight="bold" fontSize="caption" color="warning-textHigh">
          Você não tem o número deste contato
        </Text>
        <Text fontSize="caption" color="neutral-textLow">
          {customer.identifierType === 'username'
            ? `Este usuário usa WhatsApp com username (${customer.username})`
            : 'Este usuário é identificado apenas por BSUID'}
        </Text>
      </Box>
      <Button
        appearance="primary"
        size="small"
        onClick={() => requestContactInfo(currentBsuidConversation.id)}
      >
        Solicitar número
      </Button>
    </Box>
  );
};

export default RequestContactInfoBanner;
