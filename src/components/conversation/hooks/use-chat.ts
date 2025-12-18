import { useCallback } from 'react';
// redux
// import { useDispatch, useSelector } from 'src/redux/store';
// import {
//   sendMessage,
//   addRecipients,
//   createNewConversation,
// } from 'src/redux/slices/chat';
// hooks

// routes
// import { paths } from 'src/routes/paths';
// types
// import { IChatParticipant } from 'src/types/chat';
import { useMockedUser } from './use-mocked-user';

// components

// ----------------------------------------------------------------------

export default function useChat() {
  const { user } = useMockedUser();

  const currentUserId = user.id;

  const contacts: any = [];
  const recipients: any = [];
  const conversations: any = [];
  const currentConversationId: any = 1;
  const conversationsStatus: any = [];

  const currentConversation: any[] = [];
  const participantsInConversation: any[] = [];

  const onClickNavItem = useCallback(
    (conversationId: string) => {
      console.log(conversationId);
      // let _conversationId;
      // const conversation = conversations.byId[conversationId];
      // if (conversation.type === 'GROUP') {
      //   _conversationId = conversation.id;
      // } else {
      //   const participantId = conversation.participants.filter(
      //     (participant: any) => participant.id !== currentUserId,
      //   )[0].id;
      //   _conversationId = participantId;
      // }
      // router.push(`${baseUrl}?id=${_conversationId}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversations.byId, currentUserId],
  );

  const onSendMessage = useCallback(
    (body: string) => {
      try {
        console.log(body);
        // if (currentConversationId) {
        //   dispatch(sendMessage(currentConversationId, body));
        // }
      } catch (error: any) {
        console.error(error);
      }
    },
    [currentConversationId],
  );

  const onSendCompose = useCallback(
    (body: string) => {
      try {
        console.log(body);
        //  dispatch(createNewConversation(recipients, body));
      } catch (error: any) {
        console.error(error);
      }
    },
    [recipients],
  );

  const onAddRecipients = useCallback((selected: any[]) => {
    console.log(selected);
    // dispatch(addRecipients(selected));
  }, []);

  return {
    // redux
    contacts,
    recipients,
    conversations,
    conversationsStatus,
    currentConversationId,
    //
    currentConversation,
    participantsInConversation,
    //
    onSendMessage,
    onSendCompose,
    onAddRecipients,
    onClickNavItem,
  };
}
