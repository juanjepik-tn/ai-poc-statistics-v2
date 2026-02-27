import React, { createContext, useCallback, useContext, useState } from 'react';

interface DirectSendModeContextType {
  isDirectSendMode: boolean;
  toggleDirectSendMode: () => void;
}

const DirectSendModeContext = createContext<DirectSendModeContextType>({
  isDirectSendMode: false,
  toggleDirectSendMode: () => {},
});

export const useDirectSendMode = () => useContext(DirectSendModeContext);

export const DirectSendModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDirectSendMode, setIsDirectSendMode] = useState(false);

  const toggleDirectSendMode = useCallback(() => {
    setIsDirectSendMode(prev => !prev);
  }, []);

  return (
    <DirectSendModeContext.Provider value={{ isDirectSendMode, toggleDirectSendMode }}>
      {children}
    </DirectSendModeContext.Provider>
  );
};

export default DirectSendModeProvider;
