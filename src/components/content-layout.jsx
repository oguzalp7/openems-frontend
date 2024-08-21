"use client"
import { Box, Flex } from '@chakra-ui/react';
import Footer from './footer';

const Layout = ({ children }) => {
  return (
    <Flex  direction="column" maxHeight="100vh">
      
      {/* Content Section */}
      <Flex as="main" flex="1" justify="center" align="center" p={4} w={['md-2px', 'full']}>
        {/* <Box width="100%" maxWidth="full"> */}
          {children}
        {/* </Box> */}
      </Flex>
      
      <Footer/>
    </Flex>
  );
};

export default Layout;