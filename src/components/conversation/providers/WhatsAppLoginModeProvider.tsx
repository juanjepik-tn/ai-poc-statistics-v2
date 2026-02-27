import React, { createContext, useContext } from 'react';

interface WhatsAppLoginModeContextType {
  isUsernameMode: boolean;
}

const WhatsAppLoginModeContext = createContext<WhatsAppLoginModeContextType>({
  isUsernameMode: false,
});

export const useWhatsAppLoginMode = () => useContext(WhatsAppLoginModeContext);

interface WhatsAppLoginModeProviderProps {
  children: React.ReactNode;
  isUsernameMode?: boolean;
}

export const WhatsAppLoginModeProvider: React.FC<WhatsAppLoginModeProviderProps> = ({
  children,
  isUsernameMode = false,
}) => (
  <WhatsAppLoginModeContext.Provider value={{ isUsernameMode }}>
    {children}
  </WhatsAppLoginModeContext.Provider>
);
