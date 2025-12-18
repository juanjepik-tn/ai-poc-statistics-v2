import { Box, Button, Checkbox, Spinner } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type HumanInterventionFormProps = {
  content?: any;
  loading: any;
  onUpdateIaConfigurations: any;
};
const HumanInterventionForm: React.FC<HumanInterventionFormProps> = ({
  content,
  loading,
  onUpdateIaConfigurations,
}) => {
  const { t } = useTranslation('translations');
  const [formValues, setFormValues] = useState({
    tools: {},
    iaPersonalization: '',
    responseLength: '',
  });

  useEffect(() => {
    setFormValues({
      tools: content?.tools || {},
      iaPersonalization: content?.ia_personalization || '',
      responseLength: content?.ia_response_length?.id || '',
    });
  }, [content]);

  const handleChangeTools = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues({
      ...formValues,
      tools: {
        ...formValues.tools,
        [name]: checked,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateIaConfigurations({ ...formValues });
  };

  return (
    <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
      <Box gap="6" display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap="4" pb="4">
          {Object.keys(content?.tools ?? {}).length > 0 ? (
            Object.keys(content?.tools ?? {}).map((key) => (
              <Box key={key} flex="1 1 45%">
                <Checkbox
                  name={key}
                  label={t(`settings.step3.config-5.${key}`, {
                    defaultValue: key,
                  })}
                  checked={
                    formValues.tools[key as keyof typeof formValues.tools] ??
                    false
                  }
                  onChange={handleChangeTools}
                />
              </Box>
            ))
          ) : (
            <Spinner />
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" mt="4">
          <Button appearance="primary" type="submit">
            {t('config.save')}{' '}
            {loading && <Spinner color="currentColor" size="small" />}
          </Button>
        </Box>
      </Box>
    </form>
  );
};
export default HumanInterventionForm;
