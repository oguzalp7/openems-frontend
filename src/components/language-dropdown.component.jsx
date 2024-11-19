"use client"

import React from 'react';
import { useLanguage } from '@/context/LanguageContaxt';
import { Select, Text } from '@chakra-ui/react';
import ReactCountryFlag from 'react-country-flag';

const LanguageDropdown = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    changeLanguage(newLanguage);
  };
  
  return (
    <Select backgroundColor={'transparent'} color='green'  value={language} onChange={handleLanguageChange}>
      {availableLanguages.map((lang, index) => (
        <>
          <option key={index} value={lang.code}>
            {lang.name}
          </option>
        </>
      ))}
    </Select>
  );
};

export default LanguageDropdown;
