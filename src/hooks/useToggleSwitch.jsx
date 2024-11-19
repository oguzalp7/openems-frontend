import { useState } from "react";
import { apiClient } from '@/apiClient';
import { useToast } from '@chakra-ui/react';
import { useLanguage } from '@/context/LanguageContaxt';

const useToggleSwitch = (initialState = false) => {
    const [isOn, setIsOn] = useState(initialState);
  
    const toggleSwitch = async (outputToToggle) => {
        setIsOn(!isOn);

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
    }
    return [isOn, toggleSwitch];
};

export default useToggleSwitch;