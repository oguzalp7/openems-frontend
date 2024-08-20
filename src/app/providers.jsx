'use client';

import { theme } from './theme';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { VStack, HStack, Box } from "@chakra-ui/react";
import Footer from '@/components/footer';
import Layout from '@/components/content-layout';

export function Providers({ children }) {
  return (
    <CacheProvider>
        <ChakraProvider theme={theme}>
            <Layout>
                {children}
            </Layout> 
            <Footer/>
        </ChakraProvider>
    </CacheProvider>
  );
}