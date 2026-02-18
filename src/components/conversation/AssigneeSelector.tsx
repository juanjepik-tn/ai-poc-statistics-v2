import React, { useEffect, useState } from 'react';
import {
  Box,
  Icon,
  Popover,
  Text,
  Spinner,
} from '@nimbus-ds/components';
import { CheckIcon, ChevronDownIcon, UserCircleIcon } from '@nimbus-ds/icons';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { IAssignee } from '@/types/conversation';

export type AssigneeSelectorProps = {
  currentAssignee: IAssignee | null | undefined;
  onAssign: (assignee: IAssignee | null) => void;
  isAIActive?: boolean;
  onSelectAI?: () => void;
  aiLabel?: string;
};

const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
  currentAssignee,
  onAssign,
  isAIActive = false,
  onSelectAI,
  aiLabel = 'Agente IA',
}) => {
  const { request } = useFetch();
  const [users, setUsers] = useState<IAssignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    request<IAssignee[]>({
      url: API_ENDPOINTS.storeUsers.list,
      method: 'GET',
    })
      .then(({ content }: any) => {
        if (!cancelled && Array.isArray(content)) {
          setUsers(content);
        }
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Determine trigger label
  const getTriggerContent = () => {
    if (isAIActive) {
      return (
        <>
          <img src="/imgs/ia-icon.svg" alt="AI" width={14} height={14} />
          <Text fontSize="base" color="neutral-textHigh">{aiLabel}</Text>
        </>
      );
    }
    if (currentAssignee) {
      return (
        <Text fontSize="base" color="neutral-textHigh">{currentAssignee.name}</Text>
      );
    }
    return (
      <Text fontSize="base" color="neutral-textLow">{aiLabel}</Text>
    );
  };

  const handleSelectAI = () => {
    onSelectAI?.();
    setPopoverOpen(false);
  };

  const handleSelectUser = (user: IAssignee) => {
    onAssign(user);
    setPopoverOpen(false);
  };

  return (
    <Popover
      visible={popoverOpen}
      onVisibility={setPopoverOpen}
      enabledClick
      enabledDismiss
      arrow={false}
      position="bottom-end"
      padding="none"
      content={
        <Box width="280px" padding="2">
          {loading ? (
            <Box display="flex" justifyContent="center" padding="4">
              <Spinner size="small" />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap="0-5">
              {/* AI Agent option */}
              {onSelectAI && (
                <>
                  <button
                    onClick={handleSelectAI}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 8px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f4f4f5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <img src="/imgs/ia-icon.svg" alt="AI" width={16} height={16} />
                    <span style={{ flex: 1 }}>{aiLabel}</span>
                    {isAIActive && (
                      <Icon source={<CheckIcon size="medium" />} color="primary-interactive" />
                    )}
                  </button>
                  <div style={{ height: 1, backgroundColor: '#e8e8e8', margin: '2px 0' }} />
                </>
              )}

              {/* Users list */}
              {users.map((user) => {
                const isSelected = !isAIActive && currentAssignee?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 8px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f4f4f5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name}
                    </span>
                    {isSelected && (
                      <Icon source={<CheckIcon size="medium" />} color="primary-interactive" />
                    )}
                  </button>
                );
              })}

            </Box>
          )}
        </Box>
      }
    >
      <Box
        display="inline-flex"
        flexDirection="row"
        gap="1"
        cursor="pointer"
        alignItems="center"
        paddingX="2"
        paddingY="1"
        borderRadius="base"
        borderColor="neutral-interactive"
        borderWidth="1"
      >
        {getTriggerContent()}
        <Icon source={<ChevronDownIcon size="small" />} color="neutral-textLow" />
      </Box>
    </Popover>
  );
};

export default AssigneeSelector;
