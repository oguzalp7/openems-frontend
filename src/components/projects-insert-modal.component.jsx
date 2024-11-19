"use client"

import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContaxt';
import { MdOutlineCreateNewFolder } from "react-icons/md";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button, IconButton, useDisclosure, useToast, Input, HStack, Text, Icon
} from '@chakra-ui/react'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import { apiClient } from '@/apiClient';
import GlowingButton from './glowing-button.component';


const ProjectInsertModal = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const {user} = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [name, setName] = useState(``);
  const isError = name === '' || name.length < 3;
  const [description, setDescription] = useState("");

  const toast = useToast();
    
  const handleSubmit = async () => {
    const data = {
      name: name,
      description: description,
      user_ids:  [1, user.uid]
    }
    
    try {
      const response = await apiClient.post("/projects/", data);
      toast({
          title: language == 'en' ? "Project created.":"Proje Oluşturuldu.",
          description: language == 'en' ? 
          `
            Name: ${response.data.name}\n
            Description: ${response.data.description}\n
            Project Token: ${response.data.api_key}
          ` : 
          `
            Proje Adı: ${response.data.name}\n
            Açıklama: ${response.data.description}\n
            Proje Anahtarı: ${response.data.api_key}
          `,
          status: 'success',
          duration: 9000,
          isClosable: true,
      })
    } catch (error) {
      console.log(error)
      toast({
        title: language == 'en' ? "Project couldn't created.":"Proje Oluşturulamadı.",
        description: language == 'en' ? error.response.data.detail.en : error.response.data.detail.tr,
        status: 'error',
        //duration: 9000,
        isClosable: true,
      })
    }
  }
    
  return ( 
    <>
     
      <IconButton w={'xs'}  isRound onClick={onOpen} aria-label={language == "en" ? "Create Project" : "Proje Oluştur"}>
        <MdOutlineCreateNewFolder size={'lg'} />
      </IconButton>
        
      
      {/* <Button onClick={onOpen}>{buttonTitle}</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{language == "en" ? "Create Project".toUpperCase() : "Proje Oluştur".toUpperCase()}</ModalHeader>
          <ModalCloseButton />

          <ModalBody >

          <FormControl isInvalid={isError} isRequired>
            <FormLabel>{language == "en" ? "Project Name" : "Proje Adı"}</FormLabel>
            <Input type='text' rounded='md' variant='filled' focusBorderColor='green.400' value={name} onChange={(e) => setName(e.target.value)} placeholder={language == "en" ? "Give a name to your new project. (Min 3 characters)" : "Projenize yeni isim verin. (Minimum 3 karakter)"}/>
            {!isError ? (
              <FormHelperText>{language == "en" ? "Give your project a name so you can easily distinguish between your projects." : "Projelerinizi rahat ayırabilmek için projenize isim verin."}</FormHelperText>
            ) : (
              <FormErrorMessage>{language == 'en' ? "Please enter valid name for your project." : "Lütfen projenize geçerli bir isim verin."}</FormErrorMessage>
            )}
          </FormControl>
          <br/>
          <FormControl>
          <FormLabel>{language == "en" ? "Description" : "Açıklama"}</FormLabel>
            <Input type='text' rounded='md' variant='filled' focusBorderColor='green.400' value={description} onChange={(e) => setDescription(e.target.value)} placeholder={language == "en" ? "Briefly explain the new project." : "Projenizi kısaca açıklayın."}/>
            <FormHelperText>{language == "en" ? "With the help of description, you can easily distinguish between your projects." : "Açıklamalar aracılığıyla, projelerinizi daha rahat ayrıştırabilirsiniz."}</FormHelperText>
          </FormControl>



          </ModalBody>

          <ModalFooter>
            <GlowingButton handleClick={handleSubmit}>
              <HStack>
              {/* <Text>{language == "en" ? "Save" : "Kaydet"}</Text> */}
                {/* <IoIosCloudUpload  /> */}
                <Icon as={MdOutlineCreateNewFolder} boxSize={7}/>
                
              </HStack>
              
              
            </GlowingButton>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              {language == "en" ? "Close" : "Vazgeç"}
            </Button> */}
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProjectInsertModal