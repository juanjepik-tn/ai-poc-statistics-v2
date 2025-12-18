import { Box, Button, Icon, Select, Sidebar } from '@nimbus-ds/components';
import { ChevronLeftIcon } from '@nimbus-ds/icons';
import { FormField, Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { nexo } from '@/app';
import Step2DataProvider from './Step2DataProvider';
import { FrecuentQuestionItem } from './step2.types';

interface Props {
  onBack: () => void;
  frequentQuestion?: FrecuentQuestionItem | any;
}

const FrecuentQuestionsForm: React.FC<Props> = ({
  onBack,
  frequentQuestion,
}) => {
  const { t } = useTranslation('translations');

  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  return (
    <>
      <>
        <Button appearance="transparent" onClick={onBack}>
          <Icon color="currentColor" source={<ChevronLeftIcon />} />
          {t('settings.previous-step')}
        </Button>
        <Sidebar.Header
          title={t('settings.step2.frecuent-questions-page-title')}
        />
        <Sidebar.Body>
          <Layout columns="1">
            <Layout.Section>
              <Step2DataProvider>
                {({ categories, onCreateFrecuentQuestion }: any) => (
                  <>
                    <Page>
                      <Page.Body>
                        <Layout columns="1">
                          <Layout.Section>
                            <Box display="flex">
                              <FormField.Select
                                name="select-category"
                                label={t('settings.step2.category')}
                                id="select-id"
                                key="select-category"
                                //@ts-ignore
                                crossOrigin="anonymous"
                              >
                                <Select.Option
                                  disabled
                                  label={t('settings.select')}
                                  selected
                                  value=""
                                />
                                {categories.map((categorie: any) => (
                                  <Select.Option
                                    label={categorie.value}
                                    value={categorie.id}
                                  />
                                ))}
                              </FormField.Select>
                            </Box>
                            <Box>
                              <FormField.Textarea
                                label={t('settings.step2.question')}
                                id="id-question"
                                name="name-question"
                                lines={4}
                                value={frequentQuestion?.question}
                                //@ts-ignore
                                crossOrigin="anonymous"
                              />
                            </Box>
                            <Box>
                              <FormField.Textarea
                                label={t('settings.step2.response')}
                                id="id-response"
                                name="name-response"
                                lines={4}
                                value={frequentQuestion?.answer}
                                //@ts-ignore
                                crossOrigin="anonymous"
                              ></FormField.Textarea>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              gap="2"
                              marginTop="4"
                            >
                              <Button onClick={onBack} appearance="neutral">
                                {t('settings.cancel')}
                              </Button>
                              <Button
                                onClick={onCreateFrecuentQuestion}
                                appearance="primary"
                              >
                                {t('settings.add')}
                              </Button>
                            </Box>
                          </Layout.Section>
                        </Layout>
                      </Page.Body>
                    </Page>
                  </>
                )}
              </Step2DataProvider>
            </Layout.Section>
          </Layout>
        </Sidebar.Body>
      </>
    </>
  );
};
export default FrecuentQuestionsForm;
