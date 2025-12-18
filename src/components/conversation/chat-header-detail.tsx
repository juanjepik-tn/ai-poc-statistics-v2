// @mui
import Avatar from '@mui/material/Avatar';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
// utils
// import { fToNow } from 'src/utils/format-time';
// types
import Iconify from '../iconify';
// components

// ----------------------------------------------------------------------

type Props = {
  participants: any[];
  closeModal?: any;
};

export default function ChatHeaderDetail({ participants, closeModal }: Props) {
  const group = participants.length > 1;

  const singleParticipant = participants[0];

  return (
    <>
      {group ? (
        <AvatarGroup
          max={3}
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 32,
              height: 32,
            },
          }}
        >
          {participants.map((participant) => (
            <Avatar
              key={participant.id}
              alt={participant.name}
              src={participant.avatarUrl}
            />
          ))}
        </AvatarGroup>
      ) : (
        <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
          <Badge
            variant={singleParticipant?.status}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar
              src={singleParticipant?.avatarUrl}
              alt={singleParticipant?.name}
            />
          </Badge>

          <ListItemText
            primary={singleParticipant.name}
            secondaryTypographyProps={{
              component: 'span',
              ...(singleParticipant?.status !== 'offline' && {
                textTransform: 'capitalize',
              }),
            }}
          />
        </Stack>
      )}

      <Stack flexGrow={1} />
      <IconButton onClick={closeModal}>
        <Iconify icon="carbon:close-filled" />
      </IconButton>
    </>
  );
}
