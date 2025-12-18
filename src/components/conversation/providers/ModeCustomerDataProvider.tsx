import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useTranslation } from 'react-i18next';
import { ModeContext } from './ModeDataProvider';

export interface ModeOption {
  title: string;
  description: string;
  number: number;
  name: string;
  customerName?: string;
}
const ModeCustomerContext = createContext<any>(null);

export const useModeCustomer = () => useContext(ModeCustomerContext);

const ModeCustomerDataProvider: React.FC<any> = ({
  children,
  initialCustomerId,
}) => {
  const { handleRadioChange } = useContext(ModeContext);
  const { addToast } = useToast();
  const { request } = useFetch();

  const { t } = useTranslation('translations');
  // Modo de operación del contacto
  // Automático: customerName 'Active' number 1 - Responda todos los mensajes automáticamente usando IA
  // Manual: customerName 'Privated' number 5 - Desactive todas las respuestas creadas por IA
  // Manual Temporalmente: customerName 'Paused' number 3- Desactive todas las respuestas creadas por IA temporalmente
  const modeOptions: ModeOption[] = [
    {
      title: t('settings.step3.config-3.autopilot.title'),
      description: t('settings.step3.config-3.autopilot.description'),
      number: 1,
      name: 'AutoPilot',
      customerName: 'Active',
    },
    {
      title: t('settings.step3.config-3.unbound.title'),
      description: t('settings.step3.config-3.unbound.description'),
      number: 5,
      name: 'Privated',
      customerName: 'Privated',
    },
    {
      title: t('settings.step3.config-3.temporarily.title'),
      description: t('settings.step3.config-3.temporarily.description'),
      number: 3,
      name: 'Off',
      customerName: 'Paused',
    },
  ];
  // const [selectedMode, setSelectedMode] = useState<ModeOption>(modeOptions[0]);
  const [selectedModeCustomer, setSelectedModeCustomer] =
    useState<ModeOption>();
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const isCustomerActive = () => selectedModeCustomer?.number === 1;
  const setUserToTemporaryManualMode = () => {
    setSelectedModeCustomer(
      modeOptions.find((option: ModeOption) => option.number === 3),
    );
    console.log('setUserToTemporaryManualMode', selectedModeCustomer);
  }
  const fetchCustomerDetails = async (customerId: number) => {
    request<any[]>({
      url: API_ENDPOINTS.customer.details(customerId),
      method: 'GET',
    })
      .then(({ content }: any) => {
        setSelectedModeCustomer(
          modeOptions.find(
            (option: ModeOption) =>
              option.customerName === content?.state?.name,
          ) || modeOptions[0],
        );
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-details-customer',
        });
      });
  };
  const handleCustomerRadioChange = (title: string, mode: number) => {
    const selectedOption = modeOptions.find(
      (option: ModeOption) => option.customerName === title,
    );
    if (selectedOption) {
      setSelectedModeCustomer(selectedOption);
    }
    return request<any>({
      url: API_ENDPOINTS.customer.updateState(customerId, mode),
      method: 'PUT',
    })
      .then(() => {
        addToast({
          type: 'success',
          text: t('config.success-message'),
          duration: 4000,
          id: 'update-operation-mode',
        });
        //onChangeOperationMode(currentConversation.id, title);
        return true;
      })
      .catch((error) => {
        addToast({
          type: 'danger',
          text: error.message.description ?? error.message,
          duration: 4000,
          id: 'error-update-messages',
        });
        return false;
      });
  };
  // Cuando es desktop, se setea el customerId desde el contexto. Cuando es mobile, se setea desde el view.
  useEffect(() => {
    if (initialCustomerId) {
      setCustomerId(initialCustomerId);
      fetchCustomerDetails(initialCustomerId);
    } else if (customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [initialCustomerId, customerId]);

  return (
    <ModeCustomerContext.Provider
      value={{
        selectedModeCustomer,
        handleRadioChange,
        handleCustomerRadioChange,
        modeOptions,
        setSelectedModeCustomer,
        isCustomerActive,
        setUserToTemporaryManualMode,
        setCustomerId,
      }}
    >
      {children}
    </ModeCustomerContext.Provider>
  );
};

export default ModeCustomerDataProvider;
