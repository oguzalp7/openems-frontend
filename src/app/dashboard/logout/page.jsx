"use client"

import React, {useContext} from 'react'
import ProtectedRoute from '@/components/protected-route.component'
import AuthContext from '@/context/AuthContext'
import { Text, HStack, VStack, Button } from '@chakra-ui/react'
import { useLanguage } from '@/context/LanguageContaxt'

const Logout = () => {
    const {user, logout} = useContext(AuthContext);
    const { language, changeLanguage, availableLanguages } = useLanguage();
    return (
        <ProtectedRoute>
            <VStack>
                <Text>{language == 'en' ? "Are you sure to logout?" : "Çıkmak istediğinize emin misiniz?"}</Text>
                <HStack>
                    
                    <Button onClick={logout} color={'white'} colorScheme='red'>Evet</Button>
                    {/* <Button colorScheme='green' color={'white'} onClick={() => {window.location.href = '/'}}>Hayır</Button> */}
                </HStack>
            </VStack>
        </ProtectedRoute>
    )
}

export default Logout