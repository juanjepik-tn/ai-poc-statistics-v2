/**
 * Comment Item Component
 * Muestra un comentario individual con sus respuestas y acciones
 */

import React, { useState } from 'react';
import { Box, Text, Button, Icon, IconButton } from '@nimbus-ds/components';
import { CheckCircleIcon, TrashIcon, UndoIcon } from '@nimbus-ds/icons';
import { Comment } from './comments.types';
import { useComments } from './useComments';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
}

// Format relative time
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Ahora';
  if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)}h`;

  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
};

// Avatar component - shows profile photo or initial
const Avatar: React.FC<{ 
  name: string; 
  color: string; 
  avatarUrl?: string;
  size?: string 
}> = ({
  name,
  color,
  avatarUrl,
  size = '32px',
}) => {
  const initial = name[0]?.toUpperCase() || '?';

  // If we have an avatar URL, show the image
  if (avatarUrl) {
    return (
      <Box
        width={size}
        height={size}
        borderRadius="full"
        style={{ 
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <img 
          src={avatarUrl} 
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          referrerPolicy="no-referrer"
        />
      </Box>
    );
  }

  // Fallback to initial
  return (
    <Box
      width={size}
      height={size}
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ backgroundColor: color, flexShrink: 0 }}
    >
      <Text
        fontSize={size === '24px' ? 'caption' : 'base'}
        fontWeight="bold"
        color="neutral-background"
      >
        {initial}
      </Text>
    </Box>
  );
};

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { resolveComment, deleteComment, addReply } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (text: string) => {
    addReply(comment.id, text);
    setShowReplyForm(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Eliminar este comentario?')) {
      deleteComment(comment.id);
    }
  };

  return (
    <Box
      data-comment-id={comment.id}
      backgroundColor="neutral-surface"
      borderRadius="2"
      padding="4"
      marginBottom="3"
      borderWidth="none"
      borderLeftWidth="1"
      borderStyle="solid"
      borderColor={comment.resolved ? 'success-interactive' : 'primary-interactive'}
      style={{
        borderLeftWidth: '4px',
        opacity: comment.resolved ? 0.7 : 1,
        transition: 'all 0.2s',
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="2">
        <Box display="flex" alignItems="center" gap="2">
          <Avatar 
            name={comment.author} 
            color={comment.color} 
            avatarUrl={comment.avatarUrl}
          />
          <Box display="flex" flexDirection="column">
            <Text fontSize="base" fontWeight="medium" color="neutral-textHigh">
              {comment.author}
            </Text>
            <Text fontSize="caption" color="neutral-textLow">
              {formatTime(comment.timestamp)}
            </Text>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end" gap="1">
          <Box
            backgroundColor="neutral-surfaceHighlight"
            borderRadius="1"
            paddingX="2"
            paddingY="1"
          >
            <Text fontSize="caption" color="neutral-textLow">
              📍 {comment.pageId}
            </Text>
          </Box>
          {comment.position && (
            <Text fontSize="caption" color="neutral-textDisabled">
              x:{comment.position.x}% y:{comment.position.y}%
            </Text>
          )}
        </Box>
      </Box>

      {/* Comment Text */}
      <Box marginBottom="3">
        <Text fontSize="base" color="neutral-textHigh" lineHeight="base">
          {comment.text}
        </Text>
      </Box>

      {/* Actions */}
      <Box display="flex" gap="2" flexWrap="wrap">
        <Button
          appearance="transparent"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <Text fontSize="caption" color="neutral-textLow">
            💬 Responder
          </Text>
        </Button>
        <Button
          appearance="transparent"
          onClick={() => resolveComment(comment.id)}
        >
          <Icon
            source={comment.resolved ? <UndoIcon size="small" /> : <CheckCircleIcon size="small" />}
            color={comment.resolved ? 'neutral-textLow' : 'success-interactive'}
          />
          <Text fontSize="caption" color={comment.resolved ? 'neutral-textLow' : 'success-textLow'}>
            {comment.resolved ? 'Reabrir' : 'Resolver'}
          </Text>
        </Button>
        <IconButton
          source={<TrashIcon size="small" />}
          size="2rem"
          onClick={handleDelete}
        />
      </Box>

      {/* Reply Form */}
      {showReplyForm && (
        <Box marginTop="3">
          <CommentForm
            placeholder="Escribe tu respuesta..."
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            submitLabel="Responder"
            compact
          />
        </Box>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <Box
          marginTop="3"
          paddingLeft="4"
          borderLeftWidth="1"
          borderStyle="solid"
          borderColor="neutral-surfaceHighlight"
          style={{ borderLeftWidth: '2px' }}
        >
          {comment.replies.map((reply) => (
            <Box
              key={reply.id}
              backgroundColor="neutral-background"
              borderRadius="1"
              padding="3"
              marginBottom="2"
            >
              <Box display="flex" alignItems="center" gap="2" marginBottom="2">
                <Avatar 
                  name={reply.author} 
                  color={reply.color} 
                  avatarUrl={reply.avatarUrl}
                  size="24px" 
                />
                <Box display="flex" flexDirection="column">
                  <Text fontSize="caption" fontWeight="medium" color="neutral-textHigh">
                    {reply.author}
                  </Text>
                  <Text fontSize="caption" color="neutral-textLow">
                    {formatTime(reply.timestamp)}
                  </Text>
                </Box>
              </Box>
              <Text fontSize="caption" color="neutral-textHigh" lineHeight="base">
                {reply.text}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentItem;

