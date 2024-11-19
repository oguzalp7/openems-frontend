"use client"

import React, {useEffect, useState, useContext} from 'react'
import { Card, CardHeader, CardBody, CardFooter, Spinner, HStack, Flex, VStack, Image } from '@chakra-ui/react'
import { Heading, Text } from '@chakra-ui/react'
import NeonToggleSwitch from './neon-switch.component'
import useToggleSwitch from '@/hooks/useToggleSwitch'
import AuthContext from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContaxt'
import { apiClient } from '@/apiClient'


const OutputContentCard = ({output}) => {
    

    if (!output) {
        return <Spinner/>;
    }
    
    const [isOn, toggleSwitch] = useToggleSwitch(output.state ? true : false);
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const outerColor = isOn ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"
    const internalColor = isOn ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"
    

    const textEn = isOn && language == 'en' ? "START" : "STOP";
    const textTr = isOn && language == 'tr' ? "AÇIK" : "KAPALI";

    return (
        <Card align={'center'}>
            <CardHeader>
            <Heading size='md'>{output.name}</Heading>
            </CardHeader>
            <CardBody>
                <Flex
                    bg={internalColor}
                    rounded={'full'}
                    boxShadow={`0 0 30px ${outerColor}`}
                    justifyContent={'center'}
                    boxSize={["200px", "200px", "300px", "300px"]}
                >
                    <Image rounded={'full'}  src='../valve-icon.png'/>
                    
                </Flex>
                <br/>
                <br/>
                
                <Flex mr={[2, 10]} justifyContent={'center'}>
                    <NeonToggleSwitch isOn={isOn} toggleSwitch={() => toggleSwitch(output)} />
                </Flex>

            </CardBody>
            <CardFooter>
                <Text>{language == 'en' ? "In order to trigger your device, click/touch to the switch." : "Açma/Kapatma için dümeye basın."}</Text>
            </CardFooter>
        </Card>
    );
    

    
    // Render for sealed output (use neon start/stop buttons)
    
}

export default OutputContentCard