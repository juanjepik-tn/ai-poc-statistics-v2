import React, { useMemo } from 'react';
import { Box, Text } from '@nimbus-ds/components';
import { IQuickReply } from '@/types/conversation';

export type QuickReplyListProps = {
  query: string;
  replies: IQuickReply[];
  onSelect: (content: string) => void;
  onClose: () => void;
  visible: boolean;
};

const QuickReplyList: React.FC<QuickReplyListProps> = ({
  query,
  replies,
  onSelect,
  onClose,
  visible,
}) => {
  const filteredReplies = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return replies;
    return replies.filter(
      (r) =>
        r.shortcut.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q)
    );
  }, [replies, query]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        maxHeight: 200,
        overflowY: 'auto',
        padding: 8,
        border: '1px solid #e0e0e0',
        zIndex: 100,
      }}
    >
      {filteredReplies.length === 0 ? (
        <Box padding="2">
          <Text fontSize="caption" color="neutral-textLow">
            Nenhuma sugestão encontrada
          </Text>
        </Box>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredReplies.map((reply) => (
            <button
              key={reply.id}
              type="button"
              onClick={() => {
                onSelect(reply.content);
                onClose();
              }}
              style={{
                padding: 8,
                borderRadius: 4,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: "'Geist', sans-serif",
                fontSize: 14,
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f4f4f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Text fontSize="base" color="neutral-textHigh">
                <Text as="span" fontWeight="bold">
                  /{reply.shortcut}
                </Text>
                {' — '}
                <Text as="span">{reply.title}</Text>
              </Text>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickReplyList;
