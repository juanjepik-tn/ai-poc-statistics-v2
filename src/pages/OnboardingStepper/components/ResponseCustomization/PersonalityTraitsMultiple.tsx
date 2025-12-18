import FormProvider from '@/components/playground/hooks/form-provider';
import RHFAutocomplete from '@/components/playground/hooks/rhf-autocomplete';
import { Box, Checkbox, Chip, Label } from '@nimbus-ds/components';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';


type Props = {
  onChange: Function;
  updateTraits: Function;
  selectedTraits?: any[];
};
const PersonalityTraitsMultiple = ({ onChange, updateTraits, selectedTraits }: Props) => {
  const traits = [
    'Accessible',
    'Friendly',
    'Lively',
    'Assertive',
    'Collaborative',
    'Consistent',
    'Cautious',
    'Curious',
    'Relaxed',
    'Fun',
    'Polite',
    'Empathetic',
    'Flexible',
    'Formal',
    'Kind',
    'Informal',
    'Motivated',
    'Optimistic',
    'Observant',
    'Patient',
    'Persuasive',
    'Helpful',
    'Proactive',
    'Resilient',
    'Problem Solver',
    'Transparent',
    'Technical',
    'Organized',
    'Results Oriented',
    'Inspiring',
    'Informative',
    'Professional',
  ];
  const { t } = useTranslation('translations');
  const defaultValues = useMemo(
    () => ({
      traits: selectedTraits || [],
    }),
    [selectedTraits]
  );  
  useEffect(() => {
    setValue('traits', selectedTraits || []);
  }, [selectedTraits]);
  const methods = useForm<any>({
    defaultValues,
  });
  const {
    handleSubmit,    
    setValue,
    getValues,    
  } = methods;

  const onSubmit = useCallback(
    async (data: any) => {
      onChange(data.traits);

    },
    [onChange]
  );

  /* useEffect(() => {
    const selectedTraitsFilter = traits.filter(trait => selectedTraits?.includes(trait.id));
    setValue('traits', selectedTraitsFilter);
  }, [selectedTraits, setValue, traits]);
*/
  const handleAutocompleteChange = useCallback(
    (selectedOption: any) => {      
      setValue('traits', selectedOption);
      onSubmit(getValues());
    },
    [getValues, onSubmit, setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {traits && (
        <>          
        <Box mb="2">
          <Label>{t('settings.step3.config-4.personality-traits')}</Label>
        </Box>
          <RHFAutocomplete
            sx={{ '& fieldset': { borderRadius: '8px' }}}
            name="traits" 
            limitTags={5}                        
            disableClearable
            disableCloseOnSelect
            autoHighlight
            multiple   
            onChange={(_event, value) => {     
              handleAutocompleteChange(value);
              _event.preventDefault();              
            }}
            onBlur={() => {
              updateTraits(getValues('traits'));
            }}
            isOptionEqualToValue={(option, value) => option === value}
            options={traits.map((option) => option)}
            getOptionLabel={(option: any) => `${t('settings.step3.config-4.traits-words.' + option)}` || ''}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                <Checkbox
                  name={`traits-${option}`}
                  label={`${t('settings.step3.config-4.traits-words.' + option)}`}      
                  checked={getValues('traits').some((trait: any) => trait === option)}                              
                />
              </li>
            )}       
            renderTags={(value, getTagProps) => {              
              const numTags = value.length;
              const limitTags = 5;
              return (
                <>
                <Box display="flex" flexWrap="wrap" gap="2">
                  {value.slice(0, limitTags).map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      text={`${t('settings.step3.config-4.traits-words.' + option, { defaultValue: option })}`}
                      removable     
                      onClick={() => {
                        const updatedTraits = getValues('traits').filter((trait: any) => trait !== option);
                        setValue('traits', updatedTraits, { shouldValidate: true });
                        handleAutocompleteChange(updatedTraits);
                      }}                 
                    />
                  ))}
                  {numTags > limitTags && (
                    <Chip
                      style={{ backgroundColor: 'rgba(145, 158, 171, 0.16)', color: '#637381', marginLeft: '5px' }}
                      key='more'
                      text={`+${numTags - limitTags}`}                   
                    />
                  )}
                </Box>
                </>
              );
            }}
            openOnFocus
          />
        </>
      )}
    </FormProvider>
  );
};
export default PersonalityTraitsMultiple;
