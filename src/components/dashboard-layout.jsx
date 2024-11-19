"use client"

import React, {useContext, useEffect, useState} from 'react'
import { Stack } from '@chakra-ui/react';


const DashboardLayout = ({children}) => {
  return (
  <Stack  w={'full'} h={'full'} borderRadius={10}>
    {children}
  </Stack>
  );
}

export default DashboardLayout;