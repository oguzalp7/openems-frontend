"use client"

import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
const LanguageContext = createContext();

const availableLanguages = [
  { code: 'en', name: 'EN' },
  { code: 'tr', name: 'TR' },
  // Add more languages as needed
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(Cookies.get('language') ? Cookies.get('language') : 'en');

  const changeLanguage = (newLanguage) => {
    Cookies.set('language', newLanguage, { expires: 7 });
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};