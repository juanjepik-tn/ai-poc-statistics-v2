import Box from '@mui/material/Box';
//
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';

type Props = {
  name: string;
  imageUrl: string;
  height: number;
  width: number;
};

export default function ConversationAvatar({
  name,
  imageUrl,
  height,
  width,
}: Props) {
  const [loadError, setLoadError] = useState(false);

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
        <Avatar alt={name} sx={{ width, height, my: 1 }} />
      )}
    </>
  );
}
