import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES } from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    AsyncStorage.getItem('lang').then((saved) => {
      if (saved) setLang(saved);
    });
  }, []);

  const switchLang = async (code) => {
    setLang(code);
    await AsyncStorage.setItem('lang', code);
  };

  const direction = LANGUAGES.find(l => l.code === lang)?.dir || 'rtl';

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLang, direction }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
