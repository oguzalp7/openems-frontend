"use client"


import { useContext, useState } from "react"
import AuthContext from "@/context/AuthContext"
import { useColorMode, IconButton, Flex, useToast  } from "@chakra-ui/react";
import { Box, VStack, Image, Text, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import PasswordInput from "@/components/password-input.component";

const Login = () => {
    const {login} = useContext(AuthContext);
    const { colorMode, toggleColorMode } = useColorMode();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

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
          <VStack spacing={4} align={'flex-start'} w='full'>
          <IconButton
                rounded="full"
                w='full'
                aria-label="Toggle color mode"
                bgColor="transparent"
                onClick={toggleColorMode}
                icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                border={'1px'}
            />
            <VStack spacing={1} align={[ 'center']} w='full'> 
              <Image
                  src="./logo.png"
                  alt="Logo"
                  borderRadius='full'
                  boxSize={['100px', '150px', '200px', '250px']}
              />
              {/* <Text>Kullanıcı Adı ve Şifrenizi Giriniz.</Text> */}
              
              
              <FormControl>
                      <FormLabel>Kullanıcı Adı*:</FormLabel>
                      <Input rounded='md' variant='filled' type="text" name="username" required placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </FormControl>
              <br/>
              {/* <FormControl>
                      <FormLabel>Şifre*:</FormLabel>
                      <Input rounded='none' variant='filled' type="password" name="password" required placeholder="Şifre"/>
              </FormControl> */}
              <PasswordInput label={'Şifre*'} placeholder="Şifre" name={'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
              <br/>
              <Button onClick={handleSubmit} colorScheme="blue" w='full'>Giriş Yap</Button>

            </VStack>
            
          </VStack>
        </Box>
    );

}

export default Login;