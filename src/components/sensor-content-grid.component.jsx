"use client"

import React, {useEffect, useState, useContext} from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { SimpleGrid, Heading, Text, Button, Stack } from '@chakra-ui/react'
import { useLanguage } from '@/context/LanguageContaxt'
import { Icon } from '@chakra-ui/react'
import { MdOutlineSensorsOff } from "react-icons/md";

const SensorContentGrid = () => {
    const { language, changeLanguage, availableLanguages } = useLanguage();
    return (
        <Stack spacing={4} >
            <Stack align={'center'}>
                
                <Icon as={MdOutlineSensorsOff } w={8} h={8} color='gray.300' />
                <Text>{language == 'en' ? 'No Sensor Registered.' : 'Kayıtlı Sensör Bulunamadı.'}</Text>
            </Stack>
                    
        </Stack>
    )
}

export default SensorContentGrid



