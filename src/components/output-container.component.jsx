"use client"

import React, {useContext, useEffect, useState} from 'react'
import { Stack, Text } from '@chakra-ui/react';
/*
Where we implement pagination or infinite scroll.
If pagination will implemented, add a shortcut to the first page.
Else infinite scroll, add go to the beginning button.
*/

const OutputContainer = ({children}) => {
  return (
  <Stack align={'center'}  w={'full'} h={'full'}>
    {children}
  </Stack>
  );
}

export default OutputContainer;