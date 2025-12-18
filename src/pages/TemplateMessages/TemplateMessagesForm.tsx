import { Box, Button, Icon, Sidebar, Spinner, useToast } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ExclamationCircleIcon, InfoCircleIcon } from '@nimbus-ds/icons';
import { FormField } from '@nimbus-ds/patterns';
import { Layout } from '@nimbus-ds/patterns';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch } from '@/hooks';

interface TemplateMessageFormProps {
  open: boolean;
  toggleOpen: () => void;
  templateMessage?: any;
  onGetTemplateMessages: () => void;
}

const TemplateMessagesForm: React.FC<TemplateMessageFormProps> = ({ open, toggleOpen, templateMessage, onGetTemplateMessages }) => {
  const { t } = useTranslation('translations');
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>({
    name: '',
    language: 'es',
    components: [],
    category: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    language: '',
    body: '',
    footer: '',
    category: ''
  });

  const { request } = useFetch();

  useEffect(() => {
    addToast
    setFormValues({
      name: templateMessage?.name || '',
      language: templateMessage?.language || 'es',
      components: templateMessage?.components || [],
      category: templateMessage?.category || 'marketing'
    });
    setErrors({
      name: '',
      language: '',
      body: '',
      category: '',
      footer: ''
    });
  }, [templateMessage, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
        ...formValues,
        [name]: value
    });
    };

  const validate = () => {
    console.log(formValues);
    let tempErrors = { name: '', body: '', category: '', footer: '', language: '' };
    if (!formValues.name) tempErrors.name = t('common.form.error-required');
    if (!formValues.body) tempErrors.body = t('common.form.error-required');
    if (!formValues.category) tempErrors.category = t('common.form.error-required');
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const onCreateTemplateMessage = (formData: any) => {
    const formattedData = {
      name: formData.name,
      language: formData.language,
      category: formData.category,
      components: [
        {
          type: "BODY",
          text: formData.body
        },
        formData.footer && {
          type: "FOOTER",
          text: formData.footer
        }
      ]
    };
    setLoading(true);
    request<any[]>({
      url: API_ENDPOINTS.whatsappBusiness.createTemplate('117'),
      method: 'POST',
      data: formattedData
    })
      .then((content: any) => {       
        console.log(content); 
        setLoading(false);
        onGetTemplateMessages();
        toggleOpen();
        addToast({
          type: 'success',
          text: 'Plantilla creada correctamente',
          duration: 4000,
          id: 'success-create-template'
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      let result = false;

        onCreateTemplateMessage(formValues);
      
      if (result) {
        toggleOpen();
        setFormValues({
          name: '',
          body: '',
          category: '',
          footer: '',
          header: '',
          buttons: ''
        });
      }
    }
  };

  return (
    <Sidebar maxWidth="700px" padding="base" open={open} onRemove={() => {
        toggleOpen();
        setFormValues({
          name: '',
          body: '',
          category: '',
          footer: '',
          header: '',
          buttons: ''
        });
      }}>

        <Button
          style={{ display: 'flex', justifyContent: 'flex-start' }}
          appearance="transparent"
          onClick={toggleOpen}

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
                      <Box display="flex" flexDirection="row" gap="4">
                        <Box display="grid" gridTemplateColumns="6fr 2fr" gap="4" width="100%">
                          <FormField.Input
                            label="Nombre de la plantilla"
                            id="select-id-title"
                            name="name"
                            //@ts-ignore
                            crossOrigin="anonymous"
                            helpText={errors.name}
                            value={formValues.name}
                            onChange={handleChange}
                            helpIcon={errors.name ? ExclamationCircleIcon : undefined}
                            appearance={errors.name ? 'danger' : 'none'}
                            showHelpText
                          ></FormField.Input>
                          <FormField.Select
                            label="Idioma"
                            id="select-id-language"
                            name="language"
                            //@ts-ignore
                            crossOrigin="anonymous"
                            value={formValues.language}
                            onChange={handleChange}
                          >
                            <option value="es">Español</option>
                            <option value="en">Inglés</option>
                          </FormField.Select>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <FormField.Select
                        label="Categoría"
                        id="select-id-category"
                        name="category"
                        //@ts-ignore
                        crossOrigin="anonymous"
                        helpText={errors.category}
                        value={formValues.category}
                        onChange={handleChangeSelect}
                        helpIcon={errors.category ? ExclamationCircleIcon : undefined}
                        appearance={errors.category ? 'danger' : 'none'}
                        showHelpText
                      >
                        <option value="marketing">Marketing</option>
                        <option value="utility">Utility</option>
                        <option value="transactional">Transactional</option>
                      </FormField.Select>
                    </Box>
                    <Box>
                      <FormField.Select
                        label={<>
                          <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                            Encabezado
                          </Box>
                        </>}
                        id="select-id-header"
                        name="header"
                        //@ts-ignore
                        crossOrigin="anonymous"
                        value={formValues.header}
                        onChange={handleChange}
                      >
                        <option value="none">
                          <Icon source={<ExclamationCircleIcon />} />
                          Ninguno
                        </option>
                        <option value="text">
                          <Icon source={<InfoCircleIcon />} />
                          Mensaje de texto
                        </option>
                        <option value="image">
                          <Icon source={<InfoCircleIcon />} />
                          Imagen
                        </option>
                        <option value="video">
                          <Icon source={<InfoCircleIcon />} />
                          Vídeo
                        </option>
                        <option value="document">
                          <Icon source={<InfoCircleIcon />} />
                          Documento
                        </option>
                        <option value="location">
                          <Icon source={<InfoCircleIcon />} />
                          Ubicación
                        </option>
                      </FormField.Select>
                    </Box>
                    <Box>
                      <FormField.Textarea
                        label={<>
                          <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                            Cuerpo
                          </Box>
                        </>}
                        id="select-id-body"
                        name="body"
                        lines={6}
                        helpIcon={errors.body ? ExclamationCircleIcon : undefined}
                        appearance={errors.body ? 'danger' : 'none'}
                        showHelpText
                        helpText={errors.body}
                        //@ts-ignore
                        crossOrigin="anonymous"
                        value={formValues.body}
                        onChange={handleChange}
                      ></FormField.Textarea>
                    </Box>
                    <Box>
                    <FormField.Textarea
                      label={<>
                        <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                          Pie de página
                        </Box>
                      </>}
                      id="select-id-footer"
                      name="footer"
                      lines={3}
 
                      showHelpText
       
                      //@ts-ignore
                      crossOrigin="anonymous"
                      value={formValues.footer}
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
                        appearance="primary"
                        disabled={loading}
                      >
                        {templateMessage ? t('settings.save') : t('settings.add')}
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

export default TemplateMessagesForm; 