"use client"

import { useState } from 'react';
import { Box, Button, Text, Flex, Stack } from '@chakra-ui/react';
import { useLanguage } from '@/context/LanguageContaxt';

const CookieConsent = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { language, changeLanguage, availableLanguages } = useLanguage();

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };
  const handleReject = () => {
    setIsVisible(false);
  }
  const textTR = 'Deneyiminizi geliştirmek için çerezleri kullanıyoruz. Devam ederek çerez kullanımımızı kabul etmiş olursunuz.'
  const textEN = 'We use cookies to improve your experience. By continuing, you agree to our use of cookies.'
  return isVisible ? (
    <Box position="fixed" left="0" bottom="0" w={['full', 'full', '50%', '50%']} bg="rgba(0, 0, 0, 0.7)" color="white" p={4} zIndex="500" rounded={'full'}>
      <Flex justifyContent="space-between" alignItems="center" ml={'10px'} mr={'10px'}>
        <Text>{language === 'en' ? textEN : textTR} 🍪🥠</Text>
        <Stack flexDir={['column', 'column', 'row', 'row']}>
          <Button variant={'outline'} colorScheme="green" onClick={handleAccept}>
            {language === 'en' ? "Accept" : "Kabul Et"} ✅
          </Button>
          <Button variant={'outline'} colorScheme="red" onClick={handleReject}>
            {language === 'en' ? "Reject" : "Reddet"} ❌
          </Button>
        </Stack>
      </Flex>
    </Box>
  ) : null;
};

export default CookieConsent;