import React from 'react'
import BaseHOC from './base'
import BranchForm from '@/components/forms/branch-form.component';
import { Box, VStack } from '@chakra-ui/react';

const Branch = () => {
    const limit = 30;
    const tableTitle = 'ŞUBE'
    const slug = '/branch'
    const fetchUrl = '/branch/?skip=0&limit=30'
  return (
    <Box>
      <VStack>
        <BaseHOC form={<BranchForm/>}  slug={slug} tableTitle={tableTitle} fetchUrl={fetchUrl}/>
      </VStack>
    </Box>
    
  )
}

export default Branch