"use client"

import React, {useContext} from 'react'
import ProtectedRoute from '@/components/protected-route.component'
import AuthContext from '@/context/AuthContext'
import { Text, HStack, VStack, Button } from '@chakra-ui/react'

const Logout = () => {
    const {user, logout} = useContext(AuthContext);
    return (
        <ProtectedRoute>
            <VStack>
                <Text>Çıkmak istediğinize emin misiniz?</Text>
                <HStack>
                    
                    <Button onClick={logout} color={'white'} colorScheme='red'>Evet</Button>
                    {/* <Button colorScheme='green' color={'white'} onClick={() => {window.location.href = '/'}}>Hayır</Button> */}
                </HStack>
            </VStack>
        </ProtectedRoute>
    )
}

export default Logout