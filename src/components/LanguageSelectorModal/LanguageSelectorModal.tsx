import React from 'react';
import { Box, Icon, Modal, Text } from '@nimbus-ds/components';
import { CheckIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/app/I18n/I18n';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'es-AR', name: 'Español (Argentina)', flag: '🇦🇷' },
  { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽' },
  { code: 'es-CO', name: 'Español (Colombia)', flag: '🇨🇴' },
  { code: 'es-CL', name: 'Español (Chile)', flag: '🇨🇱' },
];

interface LanguageSelectorModalProps {
  open: boolean;
  onDismiss: () => void;
  currentLanguage: string;
  onLanguageChange?: (language: string) => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  open,
  onDismiss,
  currentLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation('translations');

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    localStorage.setItem('app_language', languageCode);
    onLanguageChange?.(languageCode);
    onDismiss();
  };

  return (
    <Modal
      maxWidth={{ xs: '100%', md: '400px' }}
      open={open}
      onDismiss={onDismiss}
      padding="base"
    >
      <Modal.Header title={t('languageSelector.title')} />
      <Modal.Body padding="none">
        <Box display="flex" flexDirection="column" gap="1">
          {languages.map((language) => {
            const isSelected = currentLanguage === language.code;
            return (
              <Box
                key={language.code}
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="3"
                borderRadius="2"
                width="100%"
                cursor="pointer"
                backgroundColor={isSelected ? 'primary-surface' : 'transparent'}
                borderWidth="none"
                onClick={() => handleLanguageSelect(language.code)}
                style={{
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Box display="flex" alignItems="center" gap="3">
                  <Text fontSize="base">{language.flag}</Text>
                  <Text
                    fontSize="base"
                    fontWeight={isSelected ? 'medium' : 'regular'}
                    color={isSelected ? 'primary-interactive' : 'neutral-textHigh'}
                  >
                    {language.name}
                  </Text>
                </Box>
                {isSelected && (
                  <Icon
                    source={<CheckIcon size="medium" />}
                    color="primary-interactive"
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default LanguageSelectorModal;
