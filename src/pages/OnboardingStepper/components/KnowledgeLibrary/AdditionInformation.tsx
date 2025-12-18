import {
  Box,
  Button,
  Icon,
  Link,
  Sidebar,
  Text,
  Tooltip
} from '@nimbus-ds/components';
import {
  ChevronLeftIcon,
  InfoCircleIcon,
  PlusCircleIcon
} from '@nimbus-ds/icons';
import {
  InteractiveList
} from '@nimbus-ds/patterns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ContentForm from './ContentForm';
import { trackingContentAdditionalInformation, trackingContentAdditionalInformationOpen, trackingOptionalLibraryContentAdd } from '@/tracking';

interface AdditionInformationProps {
  open: boolean;
  toggleOpen: () => void;
  optionalsList: any[];
  onCreateContent: (formData: any) => boolean;
  source: 'onboarding' | 'settings';
}


const AdditionInformation: React.FC<AdditionInformationProps> = ({
  open,
  toggleOpen,
  optionalsList,
  onCreateContent,
  source
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('translations');
  const [currentComponent, setCurrentComponent] =
    useState<React.ReactNode>(null);

  useEffect(() => {
    if (open) {
      setCurrentComponent(null);
    }
  }, [open, navigate]);


  const renderContent = () => {
    if (currentComponent) {
      return currentComponent;
    }
    return (
      <>
        <Button appearance="transparent" onClick={()=>{
          toggleOpen();
          trackingContentAdditionalInformationOpen({
            source: source,
            open: false,
          });
        }}>
          <Icon color="currentColor" source={<ChevronLeftIcon />} />
          {t('settings.previous-step')}
        </Button>
        <Sidebar.Header title={t('settings.step2.actions.add-information')} />
        <Sidebar.Body>
          <Box
            alignItems="center"
            borderColor="neutral-interactive"
            boxSizing="border-box"
            display="flex"
            justifyContent="center"
            width="100%"
          >
            <InteractiveList>
              {optionalsList.map(({title, tool_name}, index) => (
                <InteractiveList.ButtonItem
                  style={{ height: '40px' }}
                  key={index}
                  title={t(`conversations.tags.${title}`)}
                  showTitle={false}
                  iconButton={{
                    onClick: () =>{
                      // @ts-ignore
                      setCurrentComponent(<ContentForm source={source} open={true} toggleOpen={toggleOpen} onCreateContent={onCreateContent} loading={false} content={{ title, content: '', class: 'relevant_content_optional', tool_name }} />)
                      trackingOptionalLibraryContentAdd({
                        source: source,
                        content_title: title,
                      });
                    }
                  }}
                >
                  <Box padding="none" display="flex" alignItems="center" gap="2">
                    <Text color="primary-textLow">{t(`conversations.tags.${title}`)}</Text>
                     {/*@ts-ignore*/}
                    <Tooltip content={
                          <>
                            <Box maxWidth="200px" style={{ textAlign: 'justify' }}>
                              <Box>
                                {t(`KnowledgeLibrary.${title}-tooltip`)}
                              </Box>
                          </Box>
                          </>
                        }>
                          <Icon color="primary-interactive" source={<InfoCircleIcon size="small" />} />
                        </Tooltip>
                  </Box>
      
                </InteractiveList.ButtonItem>
              ))}
              <InteractiveList.ButtonItem
                showTitle={false}
                title=""
                iconButton={{
                  onClick: () =>{
                    // @ts-ignore                  
                    setCurrentComponent(<ContentForm open={true} source={source} toggleOpen={toggleOpen} onCreateContent={onCreateContent} loading={false} content={{ title: '', content: '', class: 'relevant_content_store' }}  />),
                    trackingContentAdditionalInformation({
                      source: source,                      
                    });
                  }
                }}
              >
                <Link appearance="primary" as="a" textDecoration='none' >
                  <Icon color="primary-interactive" source={<PlusCircleIcon />} />
                  {t('settings.step2.actions.add-other-information')}
                </Link>
              </InteractiveList.ButtonItem>
            </InteractiveList>
          </Box>
        </Sidebar.Body>
      </>
    );
  };

  return (
    <>
      <Sidebar padding="base" open={open} onRemove={toggleOpen}>
        {renderContent()}
      </Sidebar>
    </>
  );
};
export default AdditionInformation;
