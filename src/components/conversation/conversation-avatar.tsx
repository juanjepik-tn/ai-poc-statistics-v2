import Box from '@mui/material/Box';
import { useState } from 'react';

type Props = {
  name: string;
  imageUrl: string;
  height: number;
  width: number;
};

// Get initials from name (max 2 characters)
const getInitials = (name: string): string => {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export default function ConversationAvatar({
  name,
  imageUrl,
  height,
  width,
}: Props) {
  const [loadError, setLoadError] = useState(false);
  const initials = getInitials(name);

  return (
    <>
      {!loadError && imageUrl ? (
        <Box
          component="img"
          alt={name}
          src={imageUrl}
          onError={() => setLoadError(true)}
          sx={{
            objectFit: 'cover',
            borderRadius: '50%',
            width,
            height,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        />
      ) : (
        <Box
          sx={{
            width,
            height,
            borderRadius: '50%',
            backgroundColor: '#eef5ff', // primary/surface from Figma
            color: '#0059d5', // primary/interactive from Figma
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(width * 0.4, 12),
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {initials}
        </Box>
      )}
    </>
  );
}
