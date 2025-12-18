import React from 'react';
import { Alert, Text } from '@nimbus-ds/components';
import { Trans } from 'react-i18next';
import { IConversationMessage } from '@/types/conversation';
import { useIsMessageFailed } from '../conversation/hooks/use-is-message-failed';


interface AlertComponentProps {
  message: IConversationMessage,
  keyMessage: string
}

const FailedMessageAlertStatus: React.FC<AlertComponentProps> = ({ message, keyMessage }) => {

  const isMessageFailed = useIsMessageFailed(message);

  const renderAlertContent = () => {
    return (
    <Text>
      <Trans
        i18nKey={keyMessage}
        components={{
          Meta: <a
            href="https://business.facebook.com/business-support-home"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', fontWeight: 'bold' }}
          />
        }}
      />
    </Text> 
    );
  };

  return (
    isMessageFailed && (
      <Alert
        appearance="neutral"
        show={true}
      >
        {renderAlertContent()}
      </Alert>
    )
  );
};

export default FailedMessageAlertStatus;