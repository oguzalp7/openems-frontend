'use client';

import { theme } from './theme';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/content-layout';

export function Providers({ children }) {
  return (
    <CacheProvider>
        <ChakraProvider theme={theme}>
            <Layout>
                {children}
            </Layout> 
        </ChakraProvider>
    </CacheProvider>
  );
}