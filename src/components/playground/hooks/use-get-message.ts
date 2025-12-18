

// ----------------------------------------------------------------------

type Props = {
  message: any;
  currentUserId: string;
  participants: any[];
};

export default function useGetMessage({ message }: Props) {


  const senderDetails =
    message.role === "user"
      ? {
          type: 'me',
        }
      : {
          avatarUrl: null,
          firstName: 'Bot',
        };

  const me = senderDetails.type === 'me';

  const hasImage = false;

  return {
    hasImage,
    me,
    senderDetails,
  };
}
