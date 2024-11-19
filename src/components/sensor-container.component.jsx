"use client"

import React, {useContext, useEffect, useState} from 'react'
import { Stack, Text } from '@chakra-ui/react';


const SensorContainer = ({children}) => {
  return (
  <Stack align={'center'}  w={'full'} h={'15vh'}>
    {children}
  </Stack>
  );
}

export default SensorContainer;