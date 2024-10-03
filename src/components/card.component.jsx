"use client"

import React, {useEffect, useState} from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Box, Text, VStack } from '@chakra-ui/react';

const CardComponent = ({data}) => {
    console.log(data)
    return (
        // <Box
        //   borderWidth="1px"
        //   borderRadius="lg"
        //   overflow="hidden"
        //   boxShadow="md"
        //   p={4}
        //   _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
        //   transition="0.2s"
        //   w={'full'}
        // >
        //   <VStack spacing={2} align="start">
        //     <Text fontWeight="bold" fontSize="lg">
        //       TARİH: {data['TARİH']}
        //     </Text>
        //     <Text>PERSONEL: {data['PERSONEL']}</Text>
        //     <Text>İŞLEM: {data['İŞLEM']}</Text>
        //   </VStack>
        // </Box>
        <div>hello</div>
    )
}

export default CardComponent;