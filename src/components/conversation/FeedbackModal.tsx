import { Box, Button, Icon, Sidebar, Spinner } from '@nimbus-ds/components';
import { FormField, Layout } from '@nimbus-ds/patterns';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon } from '@nimbus-ds/icons';

interface Props {
  open: boolean;
  toggleOpen: () => void;
  onSubmit: (feedback: string) => void;
  loading: boolean;
  question: string;
}

const FeedbackModal: React.FC<Props> = ({ 
  open, 
  toggleOpen, 
  onSubmit, 
  loading, 
  question 
}) => {
  const { t } = useTranslation('translations');
  const [feedback, setFeedback] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(feedback);
    setFeedback('');
  };

  const handleClose = () => {
    toggleOpen();
    setFeedback('');
  };

  return (
    <Sidebar maxWidth="700px" padding="base" open={open} onRemove={handleClose}>
      <Button
        style={{ display: 'flex', justifyContent: 'flex-start' }}
        appearance="transparent"
        onClick={handleClose}
      >
        <Icon color="currentColor" source={<ChevronLeftIcon />} />
        {t('base-layout.back')}
      </Button>
      
      <Sidebar.Header title={t('conversations.feedback.title')} />
      
      <Sidebar.Body>
        <Layout columns="1">
          <Layout.Section>
            <form onSubmit={handleSubmit}>
              <Layout columns="1">
                <Layout.Section>
                  <Box>
                    <FormField.Input
                      label={t('conversations.feedback.question')}
                      id="feedback-question"
                      name="question"
                      value={question}
                      disabled
                      appearance="neutral"
                    />
                  </Box>
                  
                  <Box>
                    <FormField.Textarea
                      label={t('conversations.feedback.description')}
                      id="feedback-content"
                      name="content"
                      lines={8}
                      placeholder={t('conversations.feedback.placeholder')}
                      value={feedback}
                      onChange={handleChange}
                    />
                  </Box>
                  
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    gap="2"
                    marginTop="4"
                  >
                    <Button onClick={handleClose} appearance="neutral">
                      {t('settings.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      appearance="primary"
                      disabled={loading}
                    >
                      {t('settings.add')}
                      {loading && <Spinner size="small" color="currentColor" />}
                    </Button>
                  </Box>
                </Layout.Section>
              </Layout>
            </form>
          </Layout.Section>
        </Layout>
      </Sidebar.Body>
    </Sidebar>
  );
};

export default FeedbackModal;
