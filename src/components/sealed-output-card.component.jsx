"use client"

import React, {useEffect, useState, useContext} from 'react'
import { Card, CardHeader, CardBody, CardFooter, Spinner, HStack, Flex, Image, VStack } from '@chakra-ui/react'
import { Heading, Text } from '@chakra-ui/react'

import { useLanguage } from '@/context/LanguageContaxt'

import useSealedButtonsToggle from '@/hooks/useToggleSealedButtons';

import CircleButton from './circle-button.compnent'



const SealedOutputCard = (outputs) => {

    
    if (!outputs || outputs.length === 0) {
        return <Spinner/>;
    }

    const [cardName, setCardName] = useState("");
    const [start, setStart] = useState({});
    const [stop, setStop] = useState({});
    const { language, changeLanguage, availableLanguages } = useLanguage();

    

    // const [initialState, setInitialState] = useState(start.state && start.state === 1 ? true : false);
    
    const { isStartOn, isStopOn, setIsStartOn, setIsStopOn, toggleSealedButtons } = useSealedButtonsToggle( );
    const outerColor = isStartOn ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"
    const internalColor = isStartOn ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"

    useEffect(() => {
        // Parse output names to find "start" and "stop" related outputs
        // lowercase the output name and search for start and stop words, 
        // attach the objects accordingly to the start and stop useState hooks.
        const startOutput = outputs.outputs.find(output => output.name.toLowerCase().includes('start'));
        const stopOutput = outputs.outputs.find(output => output.name.toLowerCase().includes('stop'));
        // find the common name for example: motor 1 start - motor 1 stop => motor 1 (Remove start and stop words and if two strings are equal name the card, else card name is first output name without start/stop.)

        // Extract common card name by removing "start" and "stop"
        if (startOutput && stopOutput) {
            const startName = startOutput.name.replace(/start/i, '').trim();
            const stopName = stopOutput.name.replace(/stop/i, '').trim();
            if (startName === stopName) {
            setCardName(startName); // Common name (e.g., "Motor 1")
            } else {
            setCardName(startOutput.name); // Default to start output name if no common base name
            }
    
            // Set start and stop states
            setStart(startOutput);
            setStop(stopOutput);

            // Initialize buttons' states based on the API response
            setIsStartOn(startOutput.state === 1);  // Assuming 1 is ON, 0 is OFF
            setIsStopOn(stopOutput.state === 1);    // Assuming 1 is ON, 0 is OFF
            
        }
        
    }, [outputs, setIsStartOn, setIsStopOn]);

    
    return (
        <Card align={'center'}>
            
        <CardHeader>
            <Heading size="md">{cardName}</Heading>
        </CardHeader>
        <CardBody>
            <VStack>
            <Flex
                bg={internalColor}
                rounded={'full'}
                boxShadow={`0 0 30px ${outerColor}`}
                justifyContent={'center'}
                boxSize={["200px", "200px", "300px", "300px"]}
                //display={["full", "none", "full"]}
            >
                <Image rounded={'full'}  src='../motor-icon.png'/>
            </Flex>
            <br/>
            <HStack spacing={[4, 5, 6, 8]}>
                {/* CircleButton for Start */}
                <CircleButton isOn={isStartOn} isStart={true} toggleSealedButtons={() => toggleSealedButtons(start)}>
                    {language == 'en' ? "Start" : "Başlat"}
                </CircleButton>

                {/* CircleButton for Stop */}
                <CircleButton isOn={isStopOn} isStart={false} toggleSealedButtons={() => toggleSealedButtons(stop)}>
                    {language == 'en' ? "Stop" : "Durdur"}
                </CircleButton>
            </HStack>
            </VStack>
            
        </CardBody>
        <CardFooter>
        <Text>{language == 'en' ? 'Use the "Start" button to start your process, "Stop" button to stop.': 'Çalıştırmak için "Başlat" dümesine bir kere basın, durdurmak için "Durdur" butonuna bir kere basın.'}</Text>
        </CardFooter>
        </Card>
    );
}

export default SealedOutputCard