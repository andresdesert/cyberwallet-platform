// src/context/Settings/PreferencesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreferencesState {
  notifications: boolean;
  sound: boolean;
  autoSave: boolean;
  language: string;
  showInUSD: boolean;
}

interface PreferencesContextType {
  preferences: PreferencesState;
  updatePreferences: (updates: Partial<PreferencesState>) => void;
  resetPreferences: () => void;
  language: string;
  setLanguage: (language: string) => void;
  showInUSD: boolean;
  toggleCurrencyDisplay: () => void;
}

const defaultPreferences: PreferencesState = {
  notifications: true,
  sound: true,
  autoSave: true,
  language: 'es',
  showInUSD: false,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences debe ser usado dentro de un PreferencesProvider');
  }
  return context;
};

interface PreferencesProviderProps {
  children: ReactNode;
}

const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);

  const updatePreferences = (_updates: Partial<PreferencesState>) => {
    // TODO: Implementar actualización de preferencias
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const setLanguage = (language: string) => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const toggleCurrencyDisplay = () => {
    setPreferences(prev => ({ ...prev, showInUSD: !prev.showInUSD }));
  };

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      updatePreferences, 
      resetPreferences,
      language: preferences.language,
      setLanguage,
      showInUSD: preferences.showInUSD,
      toggleCurrencyDisplay
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;
