import { Box, Button, Icon, Sidebar, Spinner } from '@nimbus-ds/components';
import { FormField, Layout } from '@nimbus-ds/patterns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronLeftIcon, ExclamationCircleIcon } from '@nimbus-ds/icons';

interface Props {
  open: boolean;
  toggleOpen: () => void;
  content?: string;
  onCreateContent: (formData: any) => Promise<boolean>;
  loading: boolean;
  title: string;
}

const DisapprovalForm: React.FC<Props> = ({ open, toggleOpen, content, onCreateContent, loading, title }) => {
  const { t } = useTranslation('translations');
  const [formValues, setFormValues] = useState({
    title: title,
    content: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (title) {
      setFormValues((prevValues) => ({
        ...prevValues,
        title: title,
      }));
    }
  }, [title]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = { title: '', content: '' };
    if (!formValues.content) tempErrors.content = t('common.form.error-required');
    if (!formValues.title) tempErrors.title = t('common.form.error-required');
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const result = await onCreateContent(formValues);
      toggleOpen();
      if (result) {
        setFormValues({
          title: '',
          content: '',
        });
      }
    }
  };
  return (
    <>
      <Sidebar maxWidth="700px" padding="base" open={open} onRemove={() => {
        toggleOpen();
        setFormValues({
          title: '',
          content: '',
        });
      }}>

        <Button
          style={{ display: 'flex', justifyContent: 'flex-start' }}
          appearance="transparent"
          onClick={toggleOpen}

        >
          <Icon color="currentColor" source={<ChevronLeftIcon />} />
          {t('base-layout.back')}
        </Button>
        <Sidebar.Header
          title={t('settings.step4.rejected-modal.title')}
        />
        <Sidebar.Body>
          <Layout columns="1">
            <Layout.Section>
              <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
                <Layout columns="1">
                  <Layout.Section>
                    <Box>
                      <FormField.Input
                        label={<>
                          <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                            {t('settings.step4.rejected-modal.question')}
                          </Box>
                        </>}
                        id="select-id-title"
                        name="title"
                        helpIcon={errors.title ? ExclamationCircleIcon : undefined}
                        appearance={errors.title ? 'danger' : 'none'}
                        showHelpText
                        helpText={errors.title}
                        //@ts-ignore
                        crossOrigin="anonymous"
                        value={formValues.title}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box>
                      <FormField.Textarea
                        label={<>
                          <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                            {t('settings.step4.rejected-modal.description')}
                          </Box>
                        </>}
                        id="select-id-title"
                        name="content"
                        lines={12}
                        //@ts-ignore
                        placeholder={t('settings.step4.rejected-modal.description-placeholder')}
                        helpIcon={errors.content ? ExclamationCircleIcon : undefined}
                        appearance={errors.content ? 'danger' : 'none'}
                        showHelpText
                        helpText={errors.content}
                        //@ts-ignore
                        crossOrigin="anonymous"
                        value={formValues.content}
                        onChange={handleChange}
                      ></FormField.Textarea>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap="2"
                      marginTop="4"
                    >
                      <Button onClick={toggleOpen} appearance="neutral">
                        {t('settings.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        appearance="primary"
                        disabled={loading}
                      >
                        {content ? t('settings.save') : t('settings.add')}
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
    </>
  );
};
export default DisapprovalForm;
