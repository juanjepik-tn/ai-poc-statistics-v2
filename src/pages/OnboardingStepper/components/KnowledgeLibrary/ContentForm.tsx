import { Box, Button, Icon, Sidebar, Spinner, Toggle, Tooltip } from '@nimbus-ds/components';
import { FormField, Layout } from '@nimbus-ds/patterns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronLeftIcon, ExclamationCircleIcon, InfoCircleIcon } from '@nimbus-ds/icons';
import { IContentItem } from './step2.types';
import { trackingLibraryContentContentUpdate, trackingLibraryContentFormClose, trackingLibraryContentTitleUpdate, trackingLibraryContentToolUpdate, trackingModifyLibraryContent, trackingNewLibraryContent } from '@/tracking';

interface Props {
  open: boolean;
  toggleOpen: () => void;
  content?: IContentItem;
  onCreateContent: (formData: any, className: string) => boolean;
  onUpdateContent?: (contentId: string, formData: any, className: string) => boolean;
  loading: boolean;
  source: 'onboarding' | 'settings';
}

const ContentForm: React.FC<Props> = ({ open, toggleOpen, content, onCreateContent, loading, onUpdateContent, source }) => {
  const { t } = useTranslation('translations');
  const [formValues, setFormValues] = useState({    
    title: '',
    content: '',
    tool: false,
    tool_name: content?.tool_name || null,
  });
  const [errors, setErrors] = useState({
    title: '',  
    content: ''
  });

  

  useEffect(() => {
      setFormValues({
        title: content?.title || '',
        content: content?.content || '',
        tool: content?.tool || false,
        tool_name: content?.tool_name || null,
      });
    
  }, [content, open]);

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

  const handleToggle = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: checked,
    });    
    const data = {
      ...formValues,
      tool: checked,
    }
    onUpdateContent && onUpdateContent(content?.id.toString() || '', data, content?.class || '');
    trackingLibraryContentToolUpdate({
      source: source,
      content_tool: checked.toString(),
    });
  };

  const validate = () => {
    let tempErrors = { title: '', content: ''};
    if (!formValues.title) tempErrors.title = t('common.form.error-required');
    if (!formValues.content) tempErrors.content = t('common.form.error-required');
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (validate()) {
 
      let result = false;
      if (content?.content || (content?.class === 'relevant_content_mandatory' && content?.title)) {
        if (onUpdateContent) {
          result = await onUpdateContent(content.id.toString(), formValues, content?.class);
          trackingModifyLibraryContent({
            content_id: content.id.toString(),
            source: source,
          });
        }
        
      } else {
        if (onCreateContent) {
          result = await onCreateContent(formValues, content?.class || '');          
          trackingNewLibraryContent({
            content_title: formValues.title,
            source: source,
          });
        }
      }
      if (result) {
        toggleOpen();
        setFormValues({
          title: '',
          content: '',
          tool: false,
          tool_name: null,
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
          tool: false,
          tool_name: null,
        });
      }}>

        <Button
          style={{ display: 'flex', justifyContent: 'flex-start' }}
          appearance="transparent"
          onClick={() => {
            toggleOpen();
            trackingLibraryContentFormClose({
              source: source,
            });
          }}

        >
          <Icon color="currentColor" source={<ChevronLeftIcon />} />
          {t('settings.previous-step')}
        </Button>

        <Sidebar.Body>
          <Layout columns="1">
            <Layout.Section>
              <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
                <Layout columns="1">
                  <Layout.Section>
                    <Box>
                      <FormField.Input
                        label={t('settings.step2.title-input')}
                        id="select-id-title"
                        name="title"
                        //@ts-ignore
                        crossOrigin="anonymous"
                        helpText={errors.title}
                        value={t(`conversations.tags.${formValues.title}`, { defaultValue: formValues.title })}
                        onChange={handleChange}
                        disabled={content?.class !== 'relevant_content_store'}
                        helpIcon={errors.title ? ExclamationCircleIcon : undefined}
                        appearance={errors.title ? 'danger' : 'none'}
                        showHelpText
                        onBlurCapture={(e: React.FocusEvent<HTMLInputElement>) => {
                          trackingLibraryContentTitleUpdate({
                            source: source,
                            content_title: e.target.value,
                          });
                        }}
                      ></FormField.Input>
                    </Box>
                    <Box>
                      <FormField.Textarea
                        label={<>
                          <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                            {t('settings.step2.content')}
                            {/* <Box>
                              <img src="/imgs/ia-icon.svg" alt="WandIcon" width="16px" height="16px" />
                              <Link appearance="primary" textDecoration='none' as="a" fontSize="caption">{t('settings.step3.config-4.generate-with-ia')}</Link>
                            </Box> */}
                          </Box>
                        </>}
                        id="select-id-title"
                        name="content"
                        lines={12}
                        helpIcon={errors.content ? ExclamationCircleIcon : undefined}
                        appearance={errors.content ? 'danger' : 'none'}
                        showHelpText
                        helpText={errors.content}
                        //@ts-ignore
                        crossOrigin="anonymous"
                        value={formValues.content}
                        onChange={handleChange}
                        //@ts-ignore
                        placeholder={t(`KnowledgeLibrary.${formValues.title}-placeholder`, { defaultValue: '' }) ? t('settings.step2.tags.example') + ':\n \n' + t(`KnowledgeLibrary.${formValues.title}-placeholder`) : undefined}
                        onBlurCapture={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                          trackingLibraryContentContentUpdate({
                            source: source,
                            content_content: e.target.value,
                          });
                        }}
                      ></FormField.Textarea>
                    </Box>
                    {(content?.tool_name && content?.tool_name !== '') && (
                      <Box display="flex" alignItems="center" gap="2" padding="3">
                        <Toggle name='tool' label={t('settings.step2.actions.request-human-help')} checked={formValues.tool} onChange={handleToggle} />
                        {/*@ts-ignore*/}
                        <Tooltip content={
                          <>
                            <Box maxWidth="200px" style={{ textAlign: 'justify' }}>
                              <Box>
                                {t('settings.step3.config-4.help-text')}
                              </Box>
                          </Box>
                          </>
                        } position="top">
                          <Icon color="primary-interactive" source={<InfoCircleIcon size="small" />} />
                        </Tooltip>
                      </Box>
                                      
                    )}

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap="2"
                      marginTop="4"
                    >
                      <Button onClick={() => {
                        toggleOpen();
                        trackingLibraryContentFormClose({
                          source: source,
                        });
                      }} appearance="neutral">
                        {t('settings.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        // onClick={onCreateContent}
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
export default ContentForm;
