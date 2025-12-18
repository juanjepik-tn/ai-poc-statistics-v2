import React, { createContext, useEffect, useState } from 'react';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useTranslation } from 'react-i18next';

export interface ModeOption {
  title: string;
  description: string;
  number: number;
  name: string;
  customerName?: string;
}

const ModeDataProvider: React.FC<any> = ({ children }) => {
  const { addToast } = useToast();
  const { request } = useFetch();

  const { t } = useTranslation('translations');

  // Automático: customerName 'Active' number 1 - Responda todos los mensajes automáticamente usando IA
  // Manual: customerName 'Paused' number 3 - Desactive todas las respuestas creadas por IA
  const modeOptions: ModeOption[] = [
    {
      title: t('settings.step3.config-3.autopilot.title'),
      description: t('settings.step3.config-3.autopilot.description'),
      number: 1,
      name: 'AutoPilot',
      customerName: 'Active',
    },
    // { title: t('settings.step3.config-3.copilot.title'), description: t('settings.step3.config-3.copilot.description'), number: 2, name: 'Copilot', customerName: 'Copilot' },
    {
      title: t('settings.step3.config-3.unbound.title'),
      description: t('settings.step3.config-3.unbound.description'),
      number: 3,
      name: 'Off',
      customerName: 'Paused',
    },
  ];
  const [selectedMode, setSelectedMode] = useState<ModeOption>(modeOptions[0]);
  const isActive = () => selectedMode?.number === 1;
  const handleRadioChange = (selected: any) => {
    setSelectedMode(selected);
    return request<any>({
      url: API_ENDPOINTS.store.updateOperationMode(selected.number),
      method: 'PUT',
    })
      .then(() => {
        addToast({
          type: 'success',
          text: t('config.success-message'),
          duration: 4000,
          id: 'update-operation-mode',
        });
        return selectedMode;
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: t(`apiCodes.${error.message}`, { defaultValue: t('apiCodes.default') }),
          duration: 4000,
          id: 'error-update-messages',
        });
        return false;
      });
  };
  const onGetStoreDetails = () => {
    return request<any>({
      url: API_ENDPOINTS.store.info,
      method: 'GET',
    })
      .then(({ content }: any) => {
        const { ia_operation_mode } = content;
        setSelectedMode(
          modeOptions.find((option) => option?.name === ia_operation_mode?.name) ||
            modeOptions[0],
        );
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-operation-mode',
        });
      });
  };
  useEffect(() => {
    onGetStoreDetails();
  }, []);

  // return children({ selectedMode, handleRadioChange, modeOptions });
  return (
    <ModeContext.Provider
      value={{ selectedMode, handleRadioChange, modeOptions, isActive }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export default ModeDataProvider;
export const ModeContext = createContext<any>(null);
