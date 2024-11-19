"use client"

import { useState } from 'react';
import { apiClient } from '@/apiClient';
import { useToast } from '@chakra-ui/react';
import { useLanguage } from '@/context/LanguageContaxt';

const useSealedButtonsToggle = () => {
  const [isStartOn, setIsStartOn] = useState(false);
  const [isStopOn, setIsStopOn] = useState(!isStartOn);

  const { language, changeLanguage, availableLanguages } = useLanguage();

  const toast = useToast();

  

  const toggleSealedButtons = async (outputToToggle) => {
    if (outputToToggle.name.toLowerCase().includes('start')) {
      setIsStartOn(true);
      setIsStopOn(false);  // Turn off the stop button when start is toggled on
    } else if (outputToToggle.name.toLowerCase().includes('stop')) {
      setIsStopOn(true);
      setIsStartOn(false);  // Turn off the start button when stop is toggled on
    }
    
    try {
        const payload = {
            gpio_type: outputToToggle.gpio_type,
            gpio: outputToToggle.gpio,
            pcf8574_address: outputToToggle.pcf8574_address
        }
        const response = await apiClient.put(`/toggle/${outputToToggle.device_id}`, payload)
    } catch (error) {
        toast({
            title: language == 'en' ? "Error" : "Hata",
            description: language == 'en' ? error.response.data.detail.en : error.response.data.detail.tr,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
    }
    
  };

  return { isStartOn, isStopOn, setIsStartOn, setIsStopOn, toggleSealedButtons };
};

export default useSealedButtonsToggle;