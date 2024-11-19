"use client"


import { useContext, useState, useEffect } from "react"
import AuthContext from "@/context/AuthContext"
import { useColorMode, IconButton, Flex, useToast  } from "@chakra-ui/react";
import { Box, VStack, Image, Text, FormControl, FormLabel, Input, Button, Stack, Heading, HStack } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import PasswordInput from "@/components/password-input.component";
import CookieConsent from "@/components/cookie-consent-banner.component";
import { useLanguage } from "@/context/LanguageContaxt";
import Cookies from "js-cookie";
import LanguageDropdown from "@/components/language-dropdown.component";

const Login = () => {
    const {login} = useContext(AuthContext);
    const { colorMode, toggleColorMode } = useColorMode();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { language, changeLanguage, availableLanguages } = useLanguage();
  

    useEffect(() => {
        if (Cookies.get('cookiesAccepted')) {
        //getGeolocation();
        changeLanguage(Cookies.get('language') || 'en');
        // @TODO : dump the data into a file or database.
        }
    }, [changeLanguage]);

    const handleAcceptCookies = () => {
        Cookies.set('cookiesAccepted', 'true', { expires: 7 });
        getGeolocation();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log({uname: username, sifre : password})
        login(username, password);
    }

    return(
        <Box 
            w={['full', 'md']} 
            p={[8, 10]}
            
            mx='auto'
            border={['none', '1px']}
            borderColor={['', 'gray.300']}
            borderRadius={10}
        >
        {!Cookies.get('cookiesAccepted')  && (<CookieConsent onAccept={handleAcceptCookies} />)}
          <VStack spacing={4} align={'flex-start'} w='full'>
          
          <HStack w='full'>
            {/* <IconButton
                rounded="full"
                w='full'
                aria-label="Toggle color mode"
                bgColor="transparent"
                onClick={toggleColorMode}
                icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                border={'1px'}
            /> */}
            {/* <Text>{language == 'en' ? 'Language: ' : 'Dil Seçimi: '}</Text> */}
            <LanguageDropdown/>
          </HStack>
          
            <VStack spacing={1} align={[ 'center']} w='full'> 
              {/* <Image
                  src="./LV.png"
                  alt="Logo"
                  borderRadius='full'
                  boxSize={['100px', '150px', '200px', '250px']}
              /> */}
              
              <Stack
                direction={'row'}
                spacing={0}
                
                >
                <Image 
                //boxSize={['sm']}
                //objectFit='cover' 
                //rounded={'full'}
                src="./PulseFlowLogoV4.png"
                borderRadius={'full'}
                onClick={() =>{
                console.log('image')
                window.location.href = '/'
                }}
                /> 
                </Stack>
                <br/>
              <FormControl isRequired>
                      <FormLabel>{language == 'en' ? 'Username: ' : 'Kullanıcı Adı*: '}</FormLabel>
                      <Input rounded='md' variant='filled' type="text" name="username" required placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </FormControl>
              <br/>
              {/* <FormControl>
                      <FormLabel>Şifre*:</FormLabel>
                      <Input rounded='none' variant='filled' type="password" name="password" required placeholder="Şifre"/>
              </FormControl> */}
              <PasswordInput label={language == 'en' ? 'Password* ' : 'Şifre* '} placeholder="Şifre" name={'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
              <br/>
              <Button onClick={handleSubmit} colorScheme="blue" w='full'>{language == 'en' ? 'Login ' : 'Giriş '}</Button>

            </VStack>
            
          </VStack>
        </Box>
    );

}

export default Login;