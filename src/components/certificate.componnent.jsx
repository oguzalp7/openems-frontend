import React,  {useState, useEffect, useContext, useRef} from 'react'
import '@/styles/fonts.css';


import { Box, Text, Image, IconButton, Stack } from '@chakra-ui/react'
import { GrPrint  } from "react-icons/gr";

const Certificate = ({ title, text, uuid, qrCode, onSave}) => {
    const [fontSize, setFontSize] = useState(50); // Default font size
    const maxCharacters = 26;

    useEffect(() => {
        // Adjust the font size based on the length of the text
        const textLength = title.length;
        
        // Simple formula: decrease font size if length exceeds limit
        if (textLength > maxCharacters) {
          const newFontSize = 50 - 2*(textLength - maxCharacters);
          setFontSize(Math.max(newFontSize, 30)); // Ensure font size doesn't go below 30
        } else {
          setFontSize(50); // Reset to default if below limit
        }
    }, [title]);

    return (
        <Stack align={'center'}>
        <IconButton w={'sm'} fontSize={'30px'}  onClick={onSave} aria-label='Sertifika oluştur'><GrPrint color='white'/></IconButton>
        <Box id='certificate' w={'4xl'} position="relative"  margin="auto" mt={10} textAlign={'center'}>
            <Image src={'../cert-images/ms-cert-template.png'} alt="Certificate Template" boxSize="100%" objectFit="cover" />
            
            {/* Overlay text for each field, styled and positioned on the certificate */}
            
                <Text fontFamily={'Corinthia'} position="absolute" left={'50%'} transform="translateX(-50%)" top={`${40 + parseInt((50 - fontSize)/2)}%`}  fontSize={`${fontSize}px`} fontWeight="medium" color="black">
                    {title}
                </Text>

            <Text noOfLines={2} fontFamily={'Gideon'}  position="absolute" transform={'translateY(10%)'} top={`${60 + parseInt((50 - fontSize)/2)}%`} left='10%' right="10%" fontSize="20px" fontWeight="bold" color="gray" paddingBottom={'5px'}>
                {text}
            </Text>

            <Image src={qrCode} alt="Scan To View The Certificate"  position={'absolute'} left={'10%'} bottom={'13%'} width={'70px'} height={'70px'}/>

            <Text  position="absolute" top="88%" left='5%' color={'gray.200'}>
                Sertifika No: {uuid}
            </Text>
        </Box>
        </Stack>
         
    )
}

export default Certificate