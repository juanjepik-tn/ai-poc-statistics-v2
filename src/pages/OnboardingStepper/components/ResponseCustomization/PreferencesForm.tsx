import { Box, Button, Card, Checkbox, Radio, Spinner, Text } from '@nimbus-ds/components';
import { FormField, InteractiveList } from '@nimbus-ds/patterns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PersonalityTraitsMultiple from './PersonalityTraitsMultiple';
import { trackingEnableEmojis, trackingPersonalityChange, trackingPersonalityTraits, trackingResponseLength } from '@/tracking';


type Step1Props = {
  content?: any;
  responsesLength: any;
  loading: any;
  prevStep?: any;
  nextStep?: any;
  updateResponseLength: any;
  updateEmojis: any;
  updatePersonalization: any;
  updateTraits: any;
  cancelOnboarding?: any;
  source: 'onboarding' | 'settings';
};
const PreferencesForm: React.FC<Step1Props> = ({
  content,
  responsesLength,
  prevStep,
  loading,  
  nextStep,
  updateResponseLength,
  updateEmojis,
  updatePersonalization,
  updateTraits,  
  source
}) => {
  const { t } = useTranslation('translations');
  const [formValues, setFormValues] = useState<any>({
    personality: '',
    iaPersonalization: '',
    useEmojis: false
  });

  const [previousPersonalization, setPreviousPersonalization] = useState<string>('');

  const [width] = useState<number>(window.innerWidth);
  const isMobile = width <= 768;
  const [traits, setTraits] = useState<any[]>([]);
  const [responseLengthSelection, setResponseLengthSelection] = useState<number>(0);

  const getResponseLengthImage = (responseLength: any) => {
    let imageSrc = '';
    switch (responseLength.id) {
      case 1:
        imageSrc = '/imgs/short-response.png';
        break;
      case 2:
        imageSrc = '/imgs/medium-response.png';
        break;
      case 3:
        imageSrc = '/imgs/long-response.png';
        break;
      default:
        imageSrc = '/imgs/short-response.png';
    }
    return <img width="100%" src={imageSrc} />;
  };

  useEffect(() => {
    const defaultLength = responsesLength.filter((length: any) => length.default_option)[0];
    setResponseLengthSelection(content?.ia_response_length?.id || defaultLength?.id);     
    setTraits(content?.personality_traits || []);   
    setFormValues({
      personality: content?.ia_personality?.id,
      iaPersonalization: content?.ia_personalization || '',
      useEmojis: content?.emojies || false
    });
    setPreviousPersonalization(content?.ia_personalization || '');
  }, [content]);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target as HTMLInputElement;        
    trackingEnableEmojis({
      checked: checked.toString(),
      source: source,
    });
    setFormValues({
      ...formValues,
      [name]: checked,
    });
    updateEmojis();
  };
  const handleChangePersonality = (traits: any) => {
    setTraits(traits);
    trackingPersonalityTraits({traits: traits, source: source});
  };
  const handleResponseLengthChange = (_event: React.ChangeEvent<HTMLInputElement> | null, value: string) => {
    setResponseLengthSelection(parseInt(value));
    updateResponseLength(parseInt(value));
    const selectedResponse = responsesLength.find((item: any) => item.id === parseInt(value));    
    if (selectedResponse) {
      trackingResponseLength({
        responseLength: selectedResponse.name,
        source: source,
      });
    }
  };

  return (
    
      <Box gap="6" display="flex" flexDirection="column">
        <Card 
          key="card-1"
        >
          <Card.Header title={t('settings.step3.config-4.title')} />
          <Text>{t('settings.step3.config-4.description')}</Text>
          <Card.Body>
            {/* <FormField.Input
              onChange={handleChange}
              name="iaPersonalization"
              value={formValues.iaPersonalization}
              label={t('settings.step3.config-4.personality-traits')}
              crossOrigin="anonymous"
              placeholder={t('settings.step3.config-4.personality-placeholder')}
              
            /> */}
            <PersonalityTraitsMultiple onChange={handleChangePersonality} updateTraits={updateTraits} selectedTraits={traits} />
          </Card.Body>
          <Card.Body>
            <Box display="flex" alignItems="center">
              <FormField.Textarea
                onChange={handleChange}
                name="iaPersonalization"
                value={formValues.iaPersonalization}
                label={
                  <>
                    <Box display="flex" alignItems="center" gap="1" mt="2">
                      {t('settings.step3.config-4.other-features')}
                      {/*  <img src="/imgs/ia-icon.svg" alt="WandIcon" />
                      <Link appearance="primary" textDecoration='none' as="button">{t('settings.step3.config-4.generate-with-ia')}</Link>
                      */}
                    </Box>
                  </>
                }
                showHelpText={true}
                id="textarea-id"
                //@ts-ignore
                placeholder={t('settings.step3.config-4.other-features-placeholder')}
                lines={5}
                onBlurCapture={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                  updatePersonalization(e.target.value);
                  const params = {
                    isEmpty:e.target.value.trim().length === 0,
                    hasChanged: previousPersonalization !== e.target.value,
                    source: source,
                  };
                  trackingPersonalityChange(params);
                  setPreviousPersonalization(e.target.value);
                }}
              />
            </Box>

            <Checkbox
              onChange={handleCheckboxChange}
              name="useEmojis"
              checked={formValues.useEmojis}
              label={t('settings.step3.config-4.use-emojis')}
            />

          </Card.Body>
        </Card>

        <Card key="card-2">
          <Card.Header title={`${t('settings.step3.config-1.response-sizes')}`} />
          <Text>{t('settings.step3.config-1.response-sizes-description')}</Text>
          <Card.Body>
            <Box display="flex" gap="2">
              {isMobile ? (
                <InteractiveList>
                  {responsesLength.map((responseLength: any) => (
                    <InteractiveList.RadioItem
                      title={t(`settings.step3.responses-length.${responseLength.name}`, { defaultValue: responseLength.name })}
                      description={t(`settings.step3.responses-length.${responseLength.name}-description`, { defaultValue: responseLength.name })}
                      radio={{
                        name: "radio-element",
                        checked: responseLength.id === responseLengthSelection,
                        onChange: (event: React.ChangeEvent<HTMLInputElement>) => handleResponseLengthChange(event, responseLength.id),
                      }}
                      key={responseLength.id}
                    />
                  ))}
                </InteractiveList>
              ) : (
                responsesLength.map((responseLength: any) => (
                  <Box key={`card-${responseLength.id}`}
                  onClick={() => handleResponseLengthChange(null, responseLength.id)}
                  cursor="pointer"
                  >
                    <Card 
                    key={`card-${responseLength.id}`}
                   
                    >
                      <Card.Body>
                        {getResponseLengthImage(responseLength)}
                        <Radio
                          key={`radio-${responseLength.id}`}
                          name={responseLength.id}
                          value={responseLength.id}
                          label={t(
                            `settings.step3.responses-length.${responseLength.name}`,
                            { defaultValue: responseLength.name },
                          )}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleResponseLengthChange(event, responseLength.id)}
                          checked={responseLength.id === responseLengthSelection}
                        />
                      </Card.Body>
                    </Card>
                  </Box>

                ))
              )}


            </Box>
          </Card.Body>
        </Card>



       
        {prevStep && (
            <Box display="flex" gap="2" justifyContent="flex-end">            
              <Button appearance="primary" type="submit" onClick={nextStep}>
                {t('settings.next-step')} {loading && <Spinner color='currentColor' size='small' />}
              </Button>
            </Box>
        ) }
      </Box>    
  );
};
export default PreferencesForm;
