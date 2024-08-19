"use client"

import { Box, Text, Button, useDisclosure, Flex } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import React, {useState, useEffect} from 'react'

const PwaModalContent = ({show, onInstall}) => {
  
  return (
    <>
    {show && (
      <Box inset="0" flex justifyContent={'center'}>
        <Box  w={'full'} p={4} rounded={'lg'} shadow={'xl'}>
            <Text as={'h2'} fontSize={'lg'} mb={2} > Uygulamayı Ana Ekrana Ekle</Text>
            <Text as={'p'} fontSize={'sm'} >Uygulamayı ana ekrana eklemek için aşağıdaki butona basın.</Text>
        </Box>
        <Flex flex="1" justify="center" align="center" >
            <Button colorScheme={'blue'} px={4} rounded={'md'} onClick={onInstall}>YÜKLE</Button>
        </Flex>
    </Box>
    )}
    </>
  )
}

const PwaModal = () => {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setPrompt(event);

      if(!window.matchMedia("(display-mode: standalone)").matches){
        setShowInstallModal(true);
      }

      
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }
    
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if(showInstallModal){
      onOpen();
    }
  }, [showInstallModal])

  const handleInstall = () => {
    if(prompt){
      prompt.prompt();
    }
  }

  return(
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>   
          <ModalCloseButton />
          <ModalBody>
            <Flex flex="1" justify="center" align="center">
              <PwaModalContent show={showInstallModal} onInstall={handleInstall}/>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
}

export default PwaModal